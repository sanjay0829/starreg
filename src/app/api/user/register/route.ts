import generateRegistrationNumber from "@/helpers/regNoGeneration";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/user";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const userdata = (await request.json()) as User;

    const regNo = await generateRegistrationNumber();

    const newUser = await UserModel.findOneAndUpdate(
      { email: userdata.email, payment_status: "Pending" }, // condition
      {
        $set: { ...userdata },
        $setOnInsert: { reg_no: regNo },
      },
      {
        new: true, // return updated/new document
        upsert: true, // create if not exists
      },
    );

    // const newUser = await UserModel.create({ ...userdata, reg_no: regNo });

    return Response.json(
      {
        success: true,
        message: "Registration Done Successfully",
        user: newUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in registering User", error);

    return Response.json(
      { success: false, message: "Error in registering User" },
      { status: 500 },
    );
  }
}
