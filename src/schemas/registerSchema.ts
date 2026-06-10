import { z } from "zod";

export const RegisterSchema = z.object({
  fullname: z
    .string()
    .min(1, " Name is required")
    .max(100, "Name must be less tha 100 character"),
  email: z.string().email({ message: "please enter a valid email id" }),
  mobile: z
    .string()
    .regex(/^[+0-9]{10,17}$/, "Phone number must be a valid  number"),
  city: z.string().min(1, "City Name is required"),
  state: z.string().min(1, "State Name is required"),
  workshop: z.array(z.string()).min(1, "Please select atleast one course"),
  total_amount: z.number(),
});
