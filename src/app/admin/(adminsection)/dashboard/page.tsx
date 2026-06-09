"use client";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface counts {
  TOTAL_REG: number;
  CONF: number;
  WORKSHOP: number;
  ACCOMMODATION: number;
}

interface wrkcounts {
  shortname: string;
  count: number;
  title: string;
}

const Dashboard = () => {
  const [countData, setCountData] = useState<counts>({
    TOTAL_REG: 0,
    CONF: 0,
    WORKSHOP: 0,
    ACCOMMODATION: 0,
  });

  const [wrkCountData, setWrkCountData] = useState<wrkcounts[]>([]);

  const getDataCounts = async () => {
    try {
      const response = await axios.get(
        "/api/admin/dashboardreports?calltype=counts",
      );
      if (response.data.success) {
        setCountData(response.data.countdata[0]);
        setWrkCountData(response.data.workshopcount);
        console.log(response.data.workshopcount);

        console.log(response.data.countdata);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getDataCounts();
  }, []);

  return (
    <div className="max-w-screen-2xl w-full">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          DASHBOARD
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:pt-2">
        <div className="flex gap-4 justify-center flex-wrap ">
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              TOTAL REGISTRATION
            </div>
            <div className="bg-sky-900/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.TOTAL_REG}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              CONFERENCE REGISTRATION
            </div>
            <div className="bg-green-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.CONF}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              WORKSHOP REGISTRATION
            </div>
            <div className="bg-green-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.WORKSHOP}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              ACCOMMODATIONS
            </div>
            <div className="bg-red-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.ACCOMMODATION}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10 flex-col items-center pt-3 border-t-2">
          <h2 className="text-center text-2xl font-bold">
            Workshop Wise Registrations
          </h2>
          <table className="w-full max-w-3xl">
            <thead>
              <tr className="p-2 bg-amber-300 font-extrabold text-lg">
                <td className="p-1 border">Workshop Id</td>
                <td className="p-1 border">Workshop Title</td>
                <td className="p-1 border">Count</td>
              </tr>
            </thead>
            <tbody>
              {wrkCountData.length > 0 &&
                wrkCountData.map((item, index) => (
                  <tr key={index} className="bg-amber-50">
                    <td className="p-1 border">{item.shortname}</td>
                    <td className="p-1 border">{item.title}</td>
                    <td className="p-1 border">{item.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
