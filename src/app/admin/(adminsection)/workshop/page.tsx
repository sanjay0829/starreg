"use client";

import ProcessingOverlay from "@/components/processing";
import Workshopform from "@/components/workshopform";
import { Workshop } from "@/models/workshop";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const WorkshopPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workshopId, setWorkshopId] = useState("");
  const [workshops, setWorkshops] = useState<Workshop[] | undefined>([]);
  const [btnTxt, SetBtnTxt] = useState("Submit");

  const getWorkshops = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/admin/workshop");

      setWorkshops(response.data.workshopList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  useEffect(() => {
    getWorkshops();
  }, []);

  return (
    <div className="max-w-screen-2xl w-full">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          WORKSHOPS
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:pt-2">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex justify-end">
            <button
              className="text-lg font-semibold px-3 py-1 rounded-sm flex justify-center items-center gap-1 bg-linear-to-tr from-zinc-800 to-gray-700 text-white hover:from-gray-500 hover:to-zinc-800"
              onClick={() => {
                setIsOpen(true);
                setWorkshopId("");
                SetBtnTxt("Submit");
              }}
            >
              <MdLibraryAdd /> Add New
            </button>
          </div>
          <div className="w-full p-2 bg-stone-200/15 mt-3">
            {workshops && workshops?.length > 0 && (
              <div className="w-full overflow-auto max-h-screen">
                <table className="w-full">
                  <thead>
                    <tr className="bg-black text-white">
                      <td className="text-left font-bold border px-2">
                        Short Name
                      </td>
                      <td className="text-left font-bold border px-2">Title</td>
                      <td className="text-left font-bold border px-2">Seat</td>
                      <td className="text-left font-bold border px-2">Date</td>

                      <td className="text-left font-bold border px-2">
                        Amount (Rs.)
                      </td>
                      <td className="text-left font-bold border px-2">
                        Action
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {workshops.map((item, index) => (
                      <tr
                        key={item._id.toString()}
                        className="hover:bg-zinc-300 text-sm odd:bg-yellow-50"
                      >
                        <td className="border px-2 py-2">
                          {item.workshop_shortname}
                        </td>
                        <td className="border px-2 py-2">
                          {item.workshop_title}
                        </td>
                        <td className="border px-2 py-2">
                          {item.workshop_seat}
                        </td>
                        <td className="border px-2 py-2">
                          {item.workshop_date}
                        </td>

                        <td className="border px-2 py-2">
                          {item.workshop_amount}
                        </td>
                        <td className="border px-2  py-2">
                          <div className="w-full flex gap2">
                            <FaRegEdit
                              size={20}
                              className="cursor-pointer"
                              onClick={() => {
                                setIsOpen(true);
                                setWorkshopId(item._id.toString());
                                SetBtnTxt("Update");
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-175 w-full flex"
        >
          <DialogHeader className="hidden">
            <DialogTitle>Add new workshop</DialogTitle>
          </DialogHeader>
          <Workshopform
            buttonText={btnTxt}
            workshopId={workshopId}
            closeModal={() => {
              setIsOpen(false);
            }}
            updateWorkshop={() => {
              getWorkshops();
            }}
          />
        </DialogContent>
      </Dialog>

      {isLoading && <ProcessingOverlay />}
    </div>
  );
};

export default WorkshopPage;
