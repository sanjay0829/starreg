import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const searchText: string = url.searchParams.get("search") as string;

    const workshop: string = url.searchParams.get("workshop") as string;
    const payment_status: string = url.searchParams.get(
      "payment_status",
    ) as string;

    const users = await UserModel.find({
      $and: [
        {
          $or: [
            { fullname: { $regex: searchText, $options: "i" } },
            { email: searchText },
            { mobile: { $regex: searchText, $options: "i" } },
            { reg_no: searchText },
          ],
        },

        ...(payment_status ? [{ payment_status: payment_status }] : []),
        ...(workshop
          ? [
              {
                $or: [
                  { foundation_series: workshop },
                  { core_series: workshop },
                  { advance_series: workshop },
                  { masterclass_series: workshop },
                ],
              },
            ]
          : []),
      ],
    });

    if (!users) {
      return Response.json(
        { success: false, message: "No Users found" },
        { status: 400 },
      );
    }

    return Response.json(
      { success: true, message: "Users Found", userList: users },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error getting Registration List", error);
    return Response.json(
      { success: false, message: "Error getting Registration List" },
      { status: 500 },
    );
  }
}
