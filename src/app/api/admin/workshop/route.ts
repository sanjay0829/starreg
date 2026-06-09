import dbConnect from "@/lib/dbConnect";
import WorkshopModel, { Workshop } from "@/models/workshop";
import { log } from "console";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const workshopId = url.searchParams.get("workshopId");
    const postData = (await request.json()) as Workshop;

    console.log("workshop", postData);

    if (workshopId) {
      const workshopExistsShortName = await WorkshopModel.findOne({
        $and: [
          {
            workshop_shortname: {
              $regex: new RegExp(`^${postData.workshop_shortname}$`, "i"),
            },
          },
          { _id: { $ne: workshopId } },
        ],
      });

      if (workshopExistsShortName) {
        return Response.json(
          {
            success: false,
            message: "Workshop short name already exists!",
          },
          { status: 409 },
        );
      }

      const workshopExists = await WorkshopModel.findById(workshopId);

      if (workshopExists) {
        const updatedWorkshop = await WorkshopModel.findByIdAndUpdate(
          workshopId,
          postData,
          { new: true },
        );

        return Response.json(
          {
            success: true,
            message: "Workhop updated successfully",
          },
          { status: 201 },
        );
      }
    }

    const workshopShortNameExists = await WorkshopModel.findOne({
      workshop_shortname: postData.workshop_shortname,
    }).collation({ locale: "en", strength: 2 });

    if (workshopShortNameExists) {
      return Response.json(
        {
          success: false,
          message: "Workshop short name already exists!",
        },
        { status: 409 },
      );
    }

    const newWorkshop = await WorkshopModel.create(postData);

    return Response.json(
      {
        success: true,
        message: "Workshop added successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in adding/Updating Workshop", error);

    return Response.json(
      { success: true, message: "Error in adding/updating workshop." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const workshopId = url.searchParams.get("id");

    if (workshopId) {
      const workshop = await WorkshopModel.findById(workshopId);
      if (!workshop) {
        return Response.json(
          { success: false, message: "Workshop not found" },
          { status: 400 },
        );
      }

      return Response.json(
        {
          success: true,
          message: "Workshop Details Found",
          workshop: workshop,
        },
        { status: 200 },
      );
    }

    const workshopList = await WorkshopModel.find();

    if (!workshopList || workshopList?.length < 1) {
      return Response.json(
        { success: false, message: "No Workshops to display" },
        { status: 400 },
      );
    }

    return Response.json(
      { success: true, message: "Workshop List", workshopList: workshopList },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching workshops", error);

    return Response.json(
      { success: false, message: "Error in getting workshop" },
      { status: 500 },
    );
  }
}
