"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/images/logo.png";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SetPasswordForm() {
  const router = useRouter();

  // reset api endpoint

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      const res = await resetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Password reset successfully");
        localStorage.removeItem("forgetPasswordToken");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full rounded-md border px-6 py-8">
      <Link
        href="/login"
        className="flex-center-start mb-4 gap-x-2 font-medium text-white hover:text-primary-blue/85"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 flex flex-col items-center justify-center space-y-2">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h4 className="text-3xl font-semibold text-white">Set New Password</h4>
        <p className="text-center text-white/90">
          Enter your new password login
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit}>
        <UInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          size="large"
          className="!mb-0 !h-10"
          required={true}
          labelStyles={{ fontWeight: "500", color: "white" }}
        />

        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
          labelStyles={{ fontWeight: "500", color: "white" }}
        />

        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
          labelStyles={{ fontWeight: "500", color: "white" }}
        />

        <Button
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
          style={{ background: "#000000" }}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
