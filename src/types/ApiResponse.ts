import { User } from "@/models/user";
import { Workshop } from "@/models/workshop";

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  userList?: User[];

  workshop?: Workshop;
  workshopList?: Workshop[];
}
