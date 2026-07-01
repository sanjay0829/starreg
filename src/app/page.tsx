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
import { advanceSeries, coreCourses, masterClass } from "@/helpers/workshops";
import ProcessingOverlay from "@/components/processing";

type FormData = z.infer<typeof RegisterSchema>;

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      mobile: "",
      city: "",
      state: "",
      foundation_series: [],
      core_series: [],
      advance_series: [],
      masterclass_series: [],
      total_amount: 0,
    },
  });

  const [workshops, setWorkshops] = useState<Workshop[] | undefined>([]);

  const getWorkshops = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse>("/api/admin/workshop");
      console.log(response);

      if (response.data.success) {
        // const filteredWorkshops = response.data.workshopList!.filter(
        //   (workshop: any) => workshop.workshop_type === "Full_Day",
        // );

        setWorkshops(response.data.workshopList);

        setIsLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getWorkshops();
  }, []);

  const [totalAmount, setTotalAmount] = useState(0);
  const [foundationAmount, setFoundationAmount] = useState(0);
  const [coreAmount, setCoreAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [masterAmount, setMasterAmount] = useState(0);

  const [dfoundationAmount, setDFoundationAmount] = useState(0);
  const [dcoreAmount, setDCoreAmount] = useState(0);
  const [dadvanceAmount, setDAdvanceAmount] = useState(0);
  const [dmasterAmount, setDMasterAmount] = useState(0);

  const [allFselected, setAllFSelected] = useState(false);
  const [allCselected, setAllCSelected] = useState(false);
  const [allAselected, setAllASelected] = useState(false);
  const [allMselected, setAllMSelected] = useState(false);

  const workshopSelected = form.watch("foundation_series");
  const coreSelected = form.watch("core_series");
  const advanceSelected = form.watch("advance_series");
  const masterSelected = form.watch("masterclass_series");

  useEffect(() => {
    const selectedWorkshops =
      workshops?.filter((w) =>
        workshopSelected?.includes(w.workshop_shortname),
      ) || [];

    const amount = selectedWorkshops?.reduce(
      (sum, item) => sum + (Number(item.workshop_amount) || 0),
      0,
    );

    var dfamount = 0;

    if (
      selectedWorkshops?.length > 0 &&
      selectedWorkshops?.length == workshops?.length
    ) {
      setAllFSelected(true);
      dfamount = amount - amount * 0.2;
      setDFoundationAmount(dfamount);
    } else {
      setAllFSelected(false);
    }

    const selectedCore = coreCourses.filter((w) =>
      coreSelected?.includes(w.workshop_shortname),
    );

    const camount = selectedCore.reduce(
      (sum, item) => sum + item.workshop_amount,
      0,
    );

    var dcamount = 0;
    if (selectedCore.length == coreCourses.length) {
      setAllCSelected(true);
      dcamount = camount - camount * 0.2;
      setDCoreAmount(dcamount);
    } else {
      setAllCSelected(false);
    }

    const selectedAdvance = advanceSeries.filter((w) =>
      advanceSelected?.includes(w.workshop_shortname),
    );

    const aamount = selectedAdvance.reduce(
      (sum, item) => sum + item.workshop_amount,
      0,
    );

    var daamount = 0;
    if (selectedAdvance.length == advanceSeries.length) {
      setAllASelected(true);
      daamount = aamount - aamount * 0.2;
      setDAdvanceAmount(daamount);
    } else {
      setAllASelected(false);
    }

    const selectedMaster = masterClass.filter((w) =>
      masterSelected?.includes(w.workshop_shortname),
    );

    const mamount = selectedMaster.reduce(
      (sum, item) => sum + item.workshop_amount,
      0,
    );

    var dmamount = 0;
    if (selectedMaster.length == masterClass.length) {
      setAllMSelected(true);
      dmamount = mamount - mamount * 0.2;
      setDMasterAmount(dmamount);
    } else {
      setAllMSelected(false);
    }

    setFoundationAmount(amount);
    setCoreAmount(camount);
    setAdvanceAmount(aamount);
    setMasterAmount(mamount);

    setTotalAmount(
      (selectedWorkshops.length == workshops?.length ? dfamount : amount) +
        (selectedCore.length == coreCourses.length ? dcamount : camount) +
        (selectedAdvance.length == advanceSeries.length ? daamount : aamount) +
        (selectedMaster.length == masterClass.length ? dmamount : mamount),
    );
  }, [workshopSelected, coreSelected, advanceSelected, masterSelected]);

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

      const payload = {
        ...data,
        total_amount: totalAmount + totalAmount * 0.18,
      };

      console.log("Payload:", payload);

      //🔹 API call
      const response = await axios.post<ApiResponse>(
        "/api/user/register",
        payload,
      );

      if (response.data.success) {
        toast.success("Registration Successful");
        router.push("/payment/" + response.data.user?._id); // change route if needed
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full  min-h-screen flex items-center justify-center p-1">
      <div className="max-w-5xl w-full shadow-2xl my-2 border-white border-2 rounded-sm overflow-hidden">
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
                  name="foundation_series"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold bg-black text-white px-1 py-2">
                        Foundation Series
                      </FieldLabel>
                      <div className="w-full grid  grid-cols-1">
                        {workshops &&
                          workshops.map((item, index) => (
                            <div key={index}>
                              <div className="flex gap-4 items-center justify-between border p-1 m-1 bg-yellow-50">
                                <div className="h-full min-h-[50px]  flex flex-col ">
                                  <Label
                                    htmlFor={item.workshop_shortname}
                                    className="text-[1rem] cursor-pointer"
                                  >
                                    {item.workshop_title}
                                  </Label>
                                  <p className="font-bold">
                                    (Date: {item.workshop_date}, Time: 8 PM Live
                                    on Zoom)
                                  </p>
                                </div>
                                <div className="flex p gap-2 justify-center items-center ">
                                  <p className="text-nowrap mr-2 text-lg font-bold">
                                    {"INR "}
                                    {item.workshop_amount} <br />
                                  </p>
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
                                    className="w-5 h-5 shrink-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="hidden grid-cols-1 gap-3">
                <Controller
                  name="core_series"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold bg-black text-white px-1 py-2">
                        Core Series
                      </FieldLabel>
                      <div className="w-full grid  grid-cols-1">
                        {coreCourses &&
                          coreCourses.map((item, index) => (
                            <div key={index}>
                              <div className="flex gap-4 items-center justify-between border p-1 m-1 bg-yellow-50">
                                <div className="h-full min-h-[50px]  flex flex-col ">
                                  <Label
                                    htmlFor={item.workshop_shortname}
                                    className="text-[1rem] cursor-pointer"
                                  >
                                    {item.workshop_title}
                                  </Label>
                                </div>
                                <div className="flex p gap-2 justify-center items-center ">
                                  <p className="text-nowrap mr-2 text-lg font-bold">
                                    {"INR "}
                                    {item.workshop_amount} <br />
                                    <span className="text-sm">
                                      (1199 + GST)
                                    </span>
                                  </p>
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
                                    className="w-5 h-5 shrink-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="hidden grid-cols-1 gap-3">
                <Controller
                  name="advance_series"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold bg-black text-white px-1 py-2">
                        Advance Series
                      </FieldLabel>
                      <div className="w-full grid  grid-cols-1">
                        {advanceSeries &&
                          advanceSeries.map((item, index) => (
                            <div key={index}>
                              <div className="flex gap-4 items-center justify-between border p-1 m-1 bg-yellow-50">
                                <div className="h-full min-h-[50px]  flex flex-col ">
                                  <Label
                                    htmlFor={item.workshop_shortname}
                                    className="text-[1rem] cursor-pointer"
                                  >
                                    {item.workshop_title}
                                  </Label>
                                </div>
                                <div className="flex p gap-2 justify-center items-center ">
                                  <p className="text-nowrap mr-2 text-lg font-bold">
                                    {"INR "}
                                    {item.workshop_amount} <br />
                                    <span className="text-sm">
                                      (1399 + GST)
                                    </span>
                                  </p>
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
                                    className="w-5 h-5 shrink-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="hidden grid-cols-1 gap-3">
                <Controller
                  name="masterclass_series"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold bg-black text-white px-1 py-2">
                        Master Class Series
                      </FieldLabel>
                      <div className="w-full grid  grid-cols-1">
                        {masterClass &&
                          masterClass.map((item, index) => (
                            <div key={index}>
                              <div className="flex gap-4 items-center justify-between border p-1 m-1 bg-yellow-50">
                                <div className="h-full min-h-[50px]  flex flex-col ">
                                  <Label
                                    htmlFor={item.workshop_shortname}
                                    className="text-[1rem] cursor-pointer"
                                  >
                                    {item.workshop_title}
                                  </Label>
                                </div>
                                <div className="flex p gap-2 justify-center items-center ">
                                  <p className="text-nowrap mr-2 text-lg font-bold">
                                    {"INR "}
                                    {item.workshop_amount} <br />
                                    <span className="text-sm">
                                      (1499 + GST)
                                    </span>
                                  </p>
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
                                    className="w-5 h-5 shrink-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                        <td className="px-2">
                          Foundation Series Amount{" "}
                          <span>(1179 X {workshopSelected?.length || 0}) </span>{" "}
                          :{" "}
                        </td>
                        <td>
                          <span>
                            {"INR"} {foundationAmount}
                          </span>
                        </td>
                      </tr>
                      {allFselected && (
                        <>
                          <tr className="bg-gray-500  text-white">
                            <td className="px-2">Less 20% Discount :</td>
                            <td>
                              <span className="font-bold">
                                {"INR"} {foundationAmount * 0.2}
                              </span>
                            </td>
                          </tr>
                          <tr className="bg-amber-500 hi  text-white">
                            <td className="px-2">
                              Final Foundation Series Amount :
                            </td>
                            <td>
                              <span className="font-bold">
                                {"INR"} {dfoundationAmount}
                              </span>
                            </td>
                          </tr>
                        </>
                      )}

                      <tr className="bg-gray-500   text-white">
                        <td className="px-2">Gst Amount 18% :</td>
                        <td>
                          <span className="font-bold">
                            {"INR"} {totalAmount * 0.18}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="col-span-2 py-1 bg-white"></td>
                      </tr>

                      <tr className="bg-gray-900 text-white border-t border-white">
                        <td className="px-2 font-bold">Total Amount : </td>
                        <td>
                          <span>
                            {"INR"} {totalAmount + totalAmount * 0.18}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={2}
                          className="bg-orange-500 text-right  text-white text-sm"
                        >
                          *Amounts inclusive of GST
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
      {form.formState.isSubmitting && <ProcessingOverlay />}
      {isLoading && <ProcessingOverlay />}
    </div>
  );
}
