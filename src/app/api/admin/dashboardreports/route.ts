import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import WorkshopModel from "@/models/workshop";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    console.log(url);

    const callType = url.searchParams.get("calltype");
    console.log(callType);

    //check calltype
    if (!callType) {
      return Response.json(
        {
          success: false,
          message: "Call Type is required",
        },
        { status: 400 },
      );
    }

    //Registration Counts
    if (callType == "counts") {
      const countData = await UserModel.aggregate([
        {
          $facet: {
            TOTAL_REG: [{ $count: "total" }],
            CONF: [
              { $match: { conference_reg: "Yes", payment_status: "Paid" } },
              { $count: "conf" },
            ],
            WORKSHOP: [
              {
                $match: {
                  payment_status: "Paid",
                },
              },
              {
                $project: {
                  workshops: [
                    "$preconf_fullday_workshop",
                    "$preconf_prelunch_workshop",
                    "$preconf_postlunch_workshop",
                    "$postconf_workshop",
                  ],
                },
              },
              {
                // remove empty and null workshops
                $project: {
                  validWorkshops: {
                    $filter: {
                      input: "$workshops",
                      as: "w",
                      cond: {
                        $and: [{ $ne: ["$$w", ""] }, { $ne: ["$$w", null] }],
                      },
                    },
                  },
                },
              },
              {
                // count number of workshops per user
                $project: {
                  workshopCount: { $size: "$validWorkshops" },
                },
              },
              {
                // sum all workshop selections (pre + post combined)
                $group: {
                  _id: null,
                  workshop: { $sum: "$workshopCount" },
                },
              },
            ],

            ACCOMMODATION: [
              { $match: { payment_status: "Paid", room_type: { $ne: "" } } },
              { $count: "accommodation" },
            ],
          },
        },
        {
          $project: {
            TOTAL_REG: {
              $ifNull: [{ $arrayElemAt: ["$TOTAL_REG.total", 0] }, 0],
            },
            CONF: { $ifNull: [{ $arrayElemAt: ["$CONF.conf", 0] }, 0] },
            WORKSHOP: {
              $ifNull: [{ $arrayElemAt: ["$WORKSHOP.workshop", 0] }, 0],
            },
            ACCOMMODATION: {
              $ifNull: [
                { $arrayElemAt: ["$ACCOMMODATION.accomodation", 0] },
                0,
              ],
            },
          },
        },
      ]);

      const workshopWiseCount = await WorkshopModel.aggregate([
        {
          $lookup: {
            from: "users",
            let: { shortname: "$workshop_shortname" },
            pipeline: [
              {
                $match: {
                  payment_status: "Paid",
                  $expr: {
                    $in: ["$$shortname", "$foundation_series"], // ✅ FIX
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "userCount",
          },
        },
        {
          $addFields: {
            count: {
              $ifNull: [{ $arrayElemAt: ["$userCount.count", 0] }, 0],
            },
          },
        },
        {
          $project: {
            _id: 0,
            shortname: "$workshop_shortname",
            title: "$workshop_title",
            workshop_type: 1,
            workshop_date: 1,
            count: 1,
          },
        },
        {
          $addFields: {
            sortOrder: {
              $toInt: {
                $replaceAll: {
                  input: "$shortname",
                  find: "F",
                  replacement: "",
                },
              },
            },
          },
        },
        {
          $sort: { sortOrder: 1 },
        },
      ]);

      return Response.json(
        {
          success: true,
          message: "Data found",
          countdata: countData,
          workshopcount: workshopWiseCount,
        },
        { status: 200 },
      );
    }

    // Payment Status wise || Category Wise

    // Paid registrations category wise
    if (callType == "categorypaid") {
      const userData = await UserModel.aggregate([
        {
          $match: { payment_status: "Paid" },
        },
        {
          $group: {
            _id: "$reg_category", // Group by CATEGORY
            COUNT: { $sum: 1 }, // Count occurrences
          },
        },
        {
          $sort: { _id: 1 }, // Sort by CATEGORY (ascending order)
        },
      ]);

      return Response.json(
        {
          success: true,
          message: "Data found",
          categorypaid: userData,
        },
        { status: 200 },
      );
    }

    //For Last 7 days Registration Counts
    if (callType == "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      console.log(sevenDaysAgo.getDate() + 1);

      const dateArray = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        dateArray.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      }

      const result = await UserModel.aggregate([
        {
          $match: {
            payment_date: { $gte: sevenDaysAgo }, // Filter registrations from the last 7 days
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$payment_date" },
            }, // Group by date
            regcount: { $sum: 1 }, // Count registrations per day
          },
        },
        {
          $project: {
            _id: 0, // Remove _id
            reg_date: "$_id", // Rename _id to reg_date
            regcount: 1, // Keep count field
          },
        },
        {
          $sort: { reg_date: 1 }, // Sort by date ascending
        },
      ]);

      const finalResult = dateArray.map((date) => {
        const found = result.find((r) => r.reg_date === date);
        return found || { reg_date: date, count: 0 }; // If date not found, set count to 0
      });

      return Response.json(
        {
          success: true,
          message: "Data found",
          last7days: finalResult,
        },
        { status: 200 },
      );
    }

    //if nothing matches
    return Response.json(
      {
        success: false,
        message: "Call Type is not matching",
      },
      { status: 400 },
    );
  } catch (error) {
    console.log("Error in fetching report", error);

    return Response.json(
      {
        status: false,
        message: "Error in fetching report",
      },
      { status: 500 },
    );
  }
}
