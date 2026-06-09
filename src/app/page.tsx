"use client";
import Image from "next/image";

import { z } from "zod";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/registerSchema";
import { Workshop } from "@/models/workshop";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import Header from "@/components/header";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof RegisterSchema>;

export default function Home() {
  const router = useRouter();

  const workshops = [
    {
      workshop_shortname: "CU01",
      workshop_title:
        "The 300-day Ovarian Symphony - HPO Axis & Folliculogenesis",
      workshop_amount: 1179,
    },
    {
      workshop_shortname: "CU02",
      workshop_title: "Follicular Phase Endocrinology",
      workshop_amount: 1179,
    },
    {
      workshop_shortname: "CU03",
      workshop_title:
        "Ovulation- Physiology/ Precision Triggering/ Molecular Dynamics to Clinical Applications",
      workshop_amount: 1179,
    },
    {
      workshop_shortname: "CU04",
      workshop_title:
        "Luteal Phase Endocrinology and Advances in Luteal Phase Support",
      workshop_amount: 1179,
    },
    {
      workshop_shortname: "CU05",
      workshop_title:
        "Implantation – Genesis Dialogue – Decoding the Molecular Dialogue of Human Embryo Implantation",
      workshop_amount: 1179,
    },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      mobile: "",
      city: "",
      state: "",
      workshop: [],
      total_amount: 0,
    },
  });

  // const getWorkshops = async () => {
  //   try {
  //     const response = await axios.get<ApiResponse>("/api/admin/workshop");
  //     console.log(response);

  //     if (response.data.success) {
  //       setWorkshops(response.data.workshopList);
  //     }
  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast.error(axiosError.response?.data.message as string);
  //   }
  // };

  const onSubmit = (data: FormData) => {};

  return (
    <div className="w-full  min-h-screen flex items-center justify-center p-1">
      <div className="max-w-5xl shadow-2xl my-2">
        <Header />

        <div className="bg-white p-3">
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid  grid-cols-1 gap-3">
                <Controller
                  name="fullname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Name
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
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Email Id
                      </FieldLabel>
                      <input type="text" {...field} className="text-input3" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="mobile"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Mobile
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
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        City
                      </FieldLabel>
                      <input type="text" {...field} className="text-input3" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        State
                      </FieldLabel>
                      <input type="text" {...field} className="text-input3" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid  grid-cols-1 gap-3">
                <Controller
                  name="fullname"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Courses
                      </FieldLabel>
                      <div className="w-full grid  grid-cols-1">
                        {workshops &&
                          workshops.map((item, index) => (
                            <div key={index}>
                              <div className="flex gap-4 items-center justify-between border p-1 m-1 bg-yellow-50">
                                <div className="h-full min-h-[50px]  flex items-center">
                                  <Label
                                    htmlFor={item.workshop_shortname}
                                    className="text-[1rem] cursor-pointer"
                                  >
                                    {item.workshop_title}
                                  </Label>
                                </div>
                                <div className="flex p justify-center items-center ">
                                  <span className="text-nowrap mr-2 text-lg font-bold">
                                    {"INR "}
                                    {item.workshop_amount}{" "}
                                  </span>
                                  <input
                                    type="checkbox"
                                    id={item.workshop_shortname}
                                    {...field}
                                    value={item.workshop_shortname}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange(item.workshop_shortname); // Set the selected one
                                      } else {
                                        field.onChange(""); // Uncheck
                                      }
                                    }}
                                    className="w-5 h-5 flex-shrink-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
