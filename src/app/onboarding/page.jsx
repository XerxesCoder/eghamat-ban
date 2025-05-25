"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "../actions/onboarding";
import { useState } from "react";
import { toast } from "sonner";

export default function OnboardingComponent() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
    };
    toast.loading("در حال تکمیل ثبت نام..");
    try {
      const res = await completeOnboarding(data);

      if (res?.message && res.success) {
        toast.dismiss();
        toast.success("ثبت نام با موفقیت انجام شد");
        await user?.reload();
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داده است");
      toast.dismiss();
      toast.error("خطایی در ثبت نام رخ داده است. لطفا مجددا تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl-luster p-6 flex justify-center items-center w-full">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 w-full">
        <h1 className="text-2xl font-bold text-deep-ocean mb-6 text-center">
          تکمیل ثبت نام
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-deep-ocean mb-1"
            >
              نام <span className="text-coral-pulse">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-2 border border-sky-glint rounded-lg focus:ring-2 focus:ring-aqua-spark focus:border-transparent"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-deep-ocean mb-1"
            >
              نام خانوادگی <span className="text-coral-pulse">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-2 border border-sky-glint rounded-lg focus:ring-2 focus:ring-aqua-spark focus:border-transparent"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-deep-ocean mb-1"
            >
              شماره تلفن <span className="text-coral-pulse">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              pattern="(\+98|0)?9\d{9}"
              className="w-full px-4 py-2 border border-sky-glint rounded-lg focus:ring-2 focus:ring-aqua-spark focus:border-transparent"
              placeholder="09123456789"
            />
            <p className="text-xs text-deep-ocean/70 mt-1">
              فرمت صحیح: 09123456789
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-coral-pulse rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium cursor-pointer text-white ${
              isSubmitting
                ? "bg-aqua-spark animate-pulse"
                : "bg-aqua-spark hover:bg-aqua-spark/90"
            } transition-colors shadow-md`}
          >
            {isSubmitting ? "در حال ارسال..." : "ثبت اطلاعات"}
          </button>
        </form>
      </div>
    </div>
  );
}
