import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const result = url.searchParams.get("id");
    console.log(result);

    const userExists = await UserModel.findOne({ _id: result });

    if (!userExists) {
      return Response.json(
        { success: false, message: "User Details Not Found" },
        { status: 400 },
      );
    }

    return Response.json(
      { success: true, message: "User Details Found", user: userExists },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in getting User", error);

    return Response.json(
      { success: false, message: "Error in getting User" },
      { status: 500 },
    );
  }
}
