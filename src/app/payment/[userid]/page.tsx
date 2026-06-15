"use client";
import Header from "@/components/header";
import ProcessingOverlay from "@/components/processing";
import { Button } from "@/components/ui/button";
import { updatePaymentDetails } from "@/helpers/updatePaymentDetails";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbHomeStar } from "react-icons/tb";

const PaymentPage = () => {
  const [userData, setUserData] = useState<User>();
  const [isSaving, setIsSaving] = useState(false);
  const [amountTotal, setAmountTotal] = useState(0);
  const params = useParams<{ userid: string }>();

  const router = useRouter();
  const userId = params.userid;

  const getUser = async () => {
    try {
      setIsSaving(true);
      const response = await axios.get<ApiResponse>("/api/user", {
        params: { id: userId },
      });

      if (response.data.success) {
        setUserData(response.data.user);
        //console.log(response.data.user);
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData) {
      const total = userData?.total_amount;

      setAmountTotal(total);
    }

    if (userData?.total_amount == 0) {
      setIsSaving(true);
      updatePaymentDetails(userData._id.toString(), "Complimentary", "NA").then(
        (data: any) => {
          // console.log(data);

          if (data.success) {
            router.replace(`/thanks/${userId}`);
            setIsSaving(false);
          }
        },
      );
    }
  }, [userData]);

  const createOrder = async () => {
    try {
      setIsSaving(true);
      if (!userData) {
        return;
      }
      console.log("U are hre", userData.payment_status);
      if (userData.payment_status && userData.payment_status != "Pending") {
        return;
      }

      const amount = userData.total_amount;

      const res = await axios.post("/api/user/createRzpOrder", {
        //amount: amount * 100,
        amount: 100,
        currency: "INR",
        receipt_id: `${userData.reg_no}_star`,
        userId: userData._id,
      });

      const data = await res.data.data;

      console.log("data", data);

      if (data) {
        const paymentData = {
          name: userData.fullname,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: data.id,
          image: "https://registration.academyofsrt.com/img/logo.png",
          handler: async function (response: any) {
            // verify payment
            const res = await fetch("/api/user/verifyOrder", {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
              // do whatever page transition you want here as payment was successful
              setIsSaving(true);
              updatePaymentDetails(
                userData._id.toString(),
                "Paid",
                response.razorpay_payment_id,
              ).then((data: any) => {
                console.log(data);

                if (data.success) {
                  router.replace(`/thanks/${userId}`);
                  setIsSaving(false);
                }
              });
            } else {
              alert("Payment failed");
              setIsSaving(false);
            }
          },
          description: "STAR Fees",
          prefill: {
            name: userData.fullname,
            email: userData.email,
            contact: userData.mobile,
          },
          theme: {
            color: "#EFA735",
          },
        };

        const payment = new (window as any).Razorpay(paymentData);
        payment.open();
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-3">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <div className="max-w-3xl mx-auto rounded-lg border border-white">
        <Header />
        <div className="p-2 bg-red-400 ">
          <h2 className="text-xl md:text-3xl text-white font-bold text-center">
            PAYMENT PAGE
          </h2>
        </div>
        <div className="bg-gray-200 p-3">
          <div className="">
            <h2 className="text-2xl font-semibold text-center">
              Hi, {userData?.fullname}
            </h2>
          </div>
          <div className="flex p-2 w-full  border justify-center">
            <div className="border border-blue-500 rounded-md max-w-[500px] w-full flex flex-col items-center justify-center bg-sky-100 p-2">
              <table className="table max-w-[400px] w-full">
                <tbody>
                  <tr>
                    <td className="border border-blue-400 p-2 font-semibold">
                      Foundation Series Amount (X{" "}
                      {userData?.foundation_series.length || 0} )<br />
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {"₹"}
                    </td>
                    <td className="border border-blue-400 p-2">
                      {userData?.total_amount}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-right w-full max-w-100 text-orange-600">
                *Amount inclusive of GST
              </p>
            </div>
          </div>
          <div className="flex w-full justify-center p-1">
            <Button
              disabled={isSaving}
              onClick={createOrder}
              className="rounded-md bg-gradient-to-br hover:scale-105 transition-all duration-150 ease-in-out from-amber-600 to-yellow-300 hover:from-yellow-300 hover:to-amber-700 text-lg font-bold px-4 py-1 m-2"
            >
              {isSaving ? "Processing..." : "Continue to Pay"}
            </Button>
          </div>
        </div>
      </div>
      {isSaving && <ProcessingOverlay LabelName="Processing..." />}
    </div>
  );
};

export default PaymentPage;
