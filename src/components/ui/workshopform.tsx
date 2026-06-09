import { WorkshopSchema } from "@/schemas/workshopSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { z } from "zod";
import ProcessingOverlay from "@/components/processing";

interface WorkshopProps {
  workshopId?: string;
  buttonText: string;
  closeModal: () => void;
  updateWorkshop: () => void;
}

type FormData = z.infer<typeof WorkshopSchema>;

const Workshopform: React.FC<WorkshopProps> = ({
  workshopId,
  buttonText,
  closeModal,
  updateWorkshop,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(WorkshopSchema),
    defaultValues: {
      workshop_title: "",
      workshop_date: "",
      workshop_seat: 0,
      workshop_amount: 0,
      workshop_shortname: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (workshopId && workshopId.length > 0) {
        console.log("workid", workshopId);
        const response = await axios.post<ApiResponse>(
          "/api/admin/workshop?workshopId=" + workshopId,
          data,
        );

        if (response.data.success) {
          toast.success("Workshop updated successfully");
          closeModal();
          updateWorkshop();
        }
      } else {
        const response = await axios.post<ApiResponse>(
          "/api/admin/workshop",
          data,
        );
        if (response.data.success) {
          toast.success("Workshop Added successfully");
          closeModal();
          updateWorkshop();
        }
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  const getWorkshop = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "/api/admin/workshop?id=" + workshopId,
      );

      if (response.data.success) {
        form.reset(response.data.workshop);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  useEffect(() => {
    if (workshopId && workshopId.length > 0) {
      getWorkshop();
    }
  }, []);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <div className="max-w-3xl w-full">
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default Workshopform;
