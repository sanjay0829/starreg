"use client";
import { WorkshopSchema } from "@/schemas/workshopSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";

interface WorkshopProps {
  workshopId?: string;
  buttonText: string;
  closeModal: () => void;
  updateWorkshop: () => void;
}

type FormData = z.infer<typeof WorkshopSchema>;

const WorkshopForm: React.FC<WorkshopProps> = ({
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
      workshop_type: "",
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
      {" "}
      <form id="workshopform" onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="bg-slate-300 text-center text-xl font-bold rounded-t-lg">
          {workshopId && workshopId.length > 0
            ? "Update Workshop"
            : " Add New Workshop"}
        </h2>
        <FieldGroup className="bg-gray-100 px-1">
          <div className="grid grid-cols-1 gap-3">
            <Controller
              name="workshop_title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Title
                  </FieldLabel>
                  <input type="text" {...field} className="text-input3" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <Controller
              name="workshop_shortname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Code
                  </FieldLabel>
                  <input type="text" {...field} className="text-input3" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="workshop_amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Amount (INR)
                  </FieldLabel>
                  <input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value),
                      )
                    }
                    className="text-input3"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <Controller
              name="workshop_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Date
                  </FieldLabel>
                  <input type="text" {...field} className="text-input3" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="workshop_seat"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Seat
                  </FieldLabel>
                  <input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value),
                      )
                    }
                    className="text-input3"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <Controller
              name="workshop_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xl font-bold">
                    Workshop Type
                  </FieldLabel>
                  <select {...field} className="text-input3">
                    <option value="">Select</option>
                    <option value="Foundation_Series">Foundation Series</option>
                    <option value="Core_Series">Core Series</option>
                    <option value="Advance_Series">Advance Series</option>
                    <option value="Masterclass_Series">
                      Master Class Series
                    </option>
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex w-full border-t-2 justify-center p-2">
            <Button className="text-xl">{buttonText}</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};

export default WorkshopForm;
