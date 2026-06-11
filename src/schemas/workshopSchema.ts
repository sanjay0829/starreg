import { z } from "zod";

export const WorkshopSchema = z.object({
  workshop_title: z.string().min(3, "Workshop title is required"),
  workshop_shortname: z.string().min(2, "Workshop shortname is required"),
  workshop_date: z.string().min(2, "Workshop Date is required"),
  workshop_amount: z.number().gt(-1, "Please enter 0 or Valid Amount"),
  workshop_type: z.string().min(2, "Workshop type is required"),
  workshop_seat: z.number().gt(0, "Please  Valid number of seats"),
});
