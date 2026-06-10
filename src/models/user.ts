import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  reg_no: string;
  fullname: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  foundation_series: string[];
  core_series: string[];
  advance_series: string[];
  masterclass_series: string[];
  payment_status: string;
  order_id: string;
  receipt_no: string;
  total_amount: number;
  payment_date: Date;
  createAt: Date;
}

function toTitleCase(str: string) {
  return str
    .split(" ") // Split the string into words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // Capitalize first letter and lowercase the rest
    )
    .join(" "); // Join the words back together
}

const UserSchema: Schema<User> = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      set: toTitleCase,
    },
    reg_no: {
      type: String,
      trim: true,
      required: [true, "Registration number is required "],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email id is required"],
    },
    mobile: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    foundation_series: [{ type: String, trim: true }],
    core_series: [{ type: String, trim: true }],
    advance_series: [{ type: String, trim: true }],
    masterclass_series: [{ type: String, trim: true }],
    payment_status: { type: String, trim: true, default: "Pending" },
    payment_date: { type: Date, trim: true },
    receipt_no: { type: String, trim: true },
    order_id: { type: String, trim: true },
    total_amount: { type: Number, trim: true },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
