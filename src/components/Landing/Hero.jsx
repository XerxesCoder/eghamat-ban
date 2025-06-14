"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import PWAInstallButton from "../pwaButton";
import { useAuth } from "@clerk/nextjs";

export default function Hero() {
  const { isSignedIn } = useAuth();
  return (
    <section className="flex w-full overflow-hidden py-20 md:py-32 bg-pearl-luster">
      <motion.div
        className="flex flex-col justify-center items-center space-y-4 container max-w-7xl mx-auto w-full px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-bold tracking-normal sm:text-5xl xl:text-6xl/none text-deep-ocean"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          اقامت‌ بان، دستیار هوشمند شما
        </motion.h1>

        <motion.h4
          className="text-2xl sm:text-3xl mt-2 text-deep-ocean/90"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          مدیریت هوشمند اقامتگاه{" "}
        </motion.h4>

        <motion.p
          className="max-w-[600px] text-deep-ocean/80 md:text-xl text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          از مدیریت اتاق‌ها تا پیگیری مالی‌ - همه در یک سیستم ساده و کاربردی
        </motion.p>

        <motion.div
          className="flex flex-col gap-2 sm:flex-row mt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {isSignedIn ? (
            <Button
              className="bg-lime-zest text-deep-ocean hover:bg-lime-zest/80 font-bold  sm:text-lg"
              asChild
              size={"lg"}
            >
              <Link href="/dashboard">داشبورد مدیریت</Link>
            </Button>
          ) : (
            <Button
              className="bg-lime-zest text-deep-ocean hover:bg-lime-zest/80 font-bold  sm:text-lg"
              asChild
              size={"lg"}
            >
              <Link href="/sign-up">شروع رایگان</Link>
            </Button>
          )}

          <Button
            className="bg-deep-ocean text-pearl-luster hover:text-white hover:bg-deep-ocean/80 sm:text-lg"
            asChild
            size={"lg"}
          >
            <a href={"#features"}>امکانات بیشتر</a>
          </Button>
          <PWAInstallButton />
        </motion.div>
      </motion.div>
    </section>
  );
}
