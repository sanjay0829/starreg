"use client";
import Header from "@/components/header";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ThanksPage = () => {
  const [userData, setUserData] = useState<User>();
  const params = useParams<{ userid: string }>();

  const router = useRouter();
  const userId = params.userid;

  const getUser = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user", {
        params: { id: userId },
      });

      if (response.data.success) {
        setUserData(response.data.user);
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
      if (userData.payment_status == "Pending") {
        router.push("/");
      }
    }
  }, [userData]);

  return (
    <div className="w-full p-3">
      <div className="w-full max-w-3xl border border-white rounded-sm mx-auto bg-gray-200 mt-4">
        <Header />
        <div className="w-full flex justify-center items-center p-2 bg-blue-900 text-white rounded-md">
          <h2 className="text-xl md:text-2xl font-semibold">
            REGISTRATION SUCCESSFULL
          </h2>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-xl font-bold text-amber-500">
            Congratulations !
          </h3>
          <p className="p-1 mt-3 text-lg">
            Your registration is submitted successfully
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;
