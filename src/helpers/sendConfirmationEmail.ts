"use server";
import { MailService } from "@sendgrid/mail";

import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import WorkshopModel from "@/models/workshop";

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function SendConfiramtionEmail(id: string): Promise<ApiResponse> {
  await dbConnect();
  try {
    const userData = await UserModel.findById(id);

    if (!userData) {
      return { success: false, message: "User Data not found" };
    }
    if (userData.payment_status == "Pending") {
      return { success: false, message: "User Payment pending" };
    }
    console.log(userData);

    const workshops = await WorkshopModel.find({
      workshop_shortname: { $in: userData.foundation_series },
    });

    console.log(workshops);

    const response = sgMail.send({
      from: { email: "noreply@groupthink.events", name: "Academy of SRT" },
      bcc: { email: "sanjaymarki@gmail.com" },
      to: userData.email,
      subject: "Online Successful Payment At - Academy of SRT",
      html: `<div
        style='max-width:800px; width:90%; background-color: #2F2484; margin:10px auto; border: 1px solid #ccc; font-family:  "Lucida sans",  sans-serif; font-size:1rem;padding:10px;'>
        <img src="https://registration.academyofsrt.com/img/header.jpg" alt="" style="width: 100%;">
        <div style="background-color: #fff; border-radius: 10px; padding: 10px; margin-top: 10px;">
         <p><b>Dear ${userData.fullname}</b></p>
         <p>Greetings for the day!</p>
            <p>We hereby confirm your registration for the Foundation Series</p>

            <h3 style="padding: 5px 7px; background-color: #2F2484; color: #fff;">REGISTRATION DETAILS</h3>
            
             <div>
              
                  ${
                    workshops.length != 0
                      ? `<table border="1" cellspacing="0" cellpadding="5" style="width:100%">
                    <tr>
                        <td>S.no</td>
                        <td>Code</td>
                        <td>Title</td>
                       
                    <tr>
                    ${workshops
                      .map(
                        (item, index) =>
                          `<tr>
                      <td>${index + 1}</td> 
                      <td>${item.workshop_shortname}</td>   
                       <td>${item.workshop_title}</td>   
                     
                      </tr>`,
                      )
                      .join("")}
                    </table>`
                      : `<p>None</p>`
                  }
                    
            </div>
            <div>
                <h4 style="padding: 5px 7px; background-color: #2F2484; color: #fff;">PAYMENT DETAILS</h4>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <td><b>Total Amount</b></td>
                            <td>:</td>
                            <td>INR ${userData.total_amount}</td>
                        </tr>
                        <tr>
                            <td><b>Payment Status</b></td>
                            <td>:</td>
                            <td>${userData.payment_status}</td>
                        </tr>
                    </table>
            </div>  
           
            <p>Should you require any further clarification, please write to us at  secretariat@xxxxx.com</p>
            <p>Looking forward to welcoming you.</p>
            <br>
            <p>
                <b>Thanks & Regards</b><br>
                Academy of SRT
            </p>
        </div>
    </div>       

        `,
    });

    return { success: true, message: "Confirmation email sent" };
  } catch (error) {
    console.error("Error sending confirmation email", error);
    return { success: false, message: "Failed to send confirmation email" };
  }
}
