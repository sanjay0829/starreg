import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { User } from "@/models/user";
import { Workshop } from "@/models/workshop";

const formatDate = (dateString: Date) => {
  if (!dateString) return ""; // Handle empty dates
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
  const month = date.toLocaleString("en-GB", { month: "short" }); // Get short month
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${day}-${month}-${year} ${hour}:${minute}`;
};

const formatDateDOB = (dateString: Date) => {
  if (!dateString) return ""; // Handle empty dates
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
  const month = date.toLocaleString("en-GB", { month: "short" }); // Get short month
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${day}-${month}-${year}`;
};

export function exportToExcel(
  users: User[],
  workshops: Workshop[],
  filename: string = "RegData.xlxs",
) {
  try {
    if (users.length == 0) return;

    const workshopMap = new Map<string, string>();
    workshops.forEach((workshop) => {
      workshopMap.set(workshop.workshop_shortname, workshop.workshop_title);
    });

    const data = users.map((user) => {
      const flattenedUser: any = {
        reg_no: user.reg_no,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        state: user.state,
        foundation_series: user.foundation_series.join(","),
        total_amount: user.total_amount,
        payment_date: user.payment_date,
        payment_status: user.payment_status,
        payment_id: user.receipt_no,
      };

      return flattenedUser;
    });

    const formattedUsers = data?.map((user) => ({
      ...user,
      dob: formatDateDOB(user?.dob),
      payment_date: formatDate(user?.payment_date), // Format date before adding
    }));

    const ws = XLSX.utils.json_to_sheet(formattedUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Convert to buffer and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(dataBlob, filename);
  } catch (error) {}
}
