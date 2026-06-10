import mongoose, { Schema, Document } from "mongoose";

export interface Workshop extends Document {
  workshop_title: string;
  workshop_amount: number;
  workshop_date: string;
  workshop_shortname: string;
  workshop_type: string;
  workshop_seat: number;
}

const WorkshopSchema: Schema<Workshop> = new Schema(
  {
    workshop_title: {
      type: String,
      required: [true, "Workshop title is required"],
      trim: true,
    },
    workshop_amount: {
      type: Number,
      required: [true, "Workshop amount is required"],
    },
    workshop_date: { type: String, trim: true },
    workshop_type: { type: String, trim: true },
    workshop_shortname: { type: String, trim: true, unique: true },
    workshop_seat: { type: Number, trim: true, default: 0 },
  },
  { timestamps: true },
);

const WorkshopModel =
  (mongoose.models.Workshop as mongoose.Model<Workshop>) ||
  mongoose.model<Workshop>("Workshop", WorkshopSchema);

export default WorkshopModel;
