"use client";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

import { AdminLoginSchema } from "@/schemas/AdminLoginSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import toast from "react-hot-toast";
import { z } from "zod";

type FormData = z.infer<typeof AdminLoginSchema>;
const AdminPage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { login_id: "", login_password: "" },
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/admin/adminauth", data);
      if (response.data.success) {
        toast.success("Login Successful");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <div className="w-full bg-linear-to-r from-amber-100 via-sky-100 to-violet-50 min-h-screen flex items-center justify-center p-1">
      <div className="w-full max-w-2xl border-3 rounded-lg border-green-300 shadow-2xl ">
        <Header />
        <div className="bg-blue-900 py-3 rounded-2xl  my-2 flex mx-1 justify-center">
          <h2 className="text-2xl text-center font-semibold text-white">
            Admin Section
          </h2>
        </div>
        <div className="p-5 flex w-full justify-center">
          <form
            id="form-rhf-demo"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-xl"
          >
            <FieldGroup>
              <div className="grid  grid-cols-1 gap-3">
                <Controller
                  name="login_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Login Id
                      </FieldLabel>
                      <input type="text" {...field} className="text-input3" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="login_password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xl font-bold">
                        Password
                      </FieldLabel>
                      <input
                        type="password"
                        {...field}
                        className="text-input3"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="flex justify-center w-full">
                <Button type="submit" className="text-xl">
                  Login
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
