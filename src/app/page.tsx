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
import { Button } from "@/components/ui/button";

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [allselected, setAllSelected] = useState(false);

  const workshopSelected = form.watch("workshop");

  useEffect(() => {
    const selectedWorkshops = workshops.filter((w) =>
      workshopSelected?.includes(w.workshop_shortname),
    );

    if (selectedWorkshops.length == 5) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }

    const amount = selectedWorkshops.reduce(
      (sum, item) => sum + item.workshop_amount,
      0,
    );
    setTotalAmount(amount);
  }, [workshopSelected]);

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

  const onSubmit = async (data: FormData) => {
    try {
      // 🔹 calculate total amount
      const selectedWorkshops = workshops.filter((w) =>
        data.workshop?.includes(w.workshop_shortname),
      );

      const totalAmount = selectedWorkshops.reduce(
        (sum, item) => sum + item.workshop_amount,
        0,
      );

      const payload = {
        ...data,
        total_amount: totalAmount,
      };

      console.log("Payload:", payload);

      // 🔹 API call
      const response = await axios.post<ApiResponse>(
        "/api/user/register",
        payload,
      );

      if (response.data.success) {
        toast.success("Registration Successful");
        router.push("/success"); // change route if needed
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    }
  };

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
                  name="workshop"
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
                                      const checked = e.target.checked;
                                      const value = item.workshop_shortname;

                                      if (checked) {
                                        field.onChange([
                                          ...(field.value || []),
                                          value,
                                        ]);
                                      } else {
                                        field.onChange(
                                          (field.value || []).filter(
                                            (v: string) => v !== value,
                                          ),
                                        );
                                      }
                                    }}
                                    checked={
                                      field.value?.includes(
                                        item.workshop_shortname,
                                      ) || false
                                    }
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

              <div className="grid md:grid-cols-2 grid-cols-1 items-end">
                <div></div>
                <div className="border border-slate-500">
                  <h2 className="text-lg font-bold px-1 bg-yellow-200 text-black py-2">
                    Payment Details
                  </h2>
                  <table className="w-full font-bold text-lg">
                    <tbody>
                      <tr className="bg-gray-700 text-white">
                        <td className="px-2">Total Amount :</td>
                        <td>
                          <span>
                            {"INR"} {totalAmount}
                          </span>
                        </td>
                      </tr>
                      {allselected && (
                        <tr className="bg-amber-500 text-white">
                          <td className="px-2">Discounted Amount :</td>
                          <td>
                            <span className="font-bold">
                              {"INR"} {4715}
                            </span>
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td
                          colSpan={2}
                          className="bg-orange-500 text-right  text-white text-sm"
                        >
                          *Amounts are inclusive of GST
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col justify-start mt-3">
                <hr className="bg-black border border-black" />
                <Button
                  type="submit"
                  className="ml-3 w-fit mt-3 text-lg bg-blue-900 font-bold px-6 py-2"
                >
                  Submit
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
