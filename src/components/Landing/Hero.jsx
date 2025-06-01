"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex w-full overflow-hidden py-20 md:py-32 bg-pearl-luster">
      <motion.div
        className="flex flex-col justify-center items-center space-y-4 container max-w-7xl mx-auto w-full"
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
          مدیریت هوشمند اقامتگاه
        </motion.h1>
        <motion.h4
          className="text-2xl sm:text-3xl mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          با اقامت‌بان، همه چیز تحت کنترل است
        </motion.h4>
        <motion.p
          className="max-w-[600px] text-deep-ocean/80 md:text-xl text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          سیستم یکپارچه مدیریت اتاق‌ها، رزرواسیون و مالی اقامتگاه شما
        </motion.p>
        <motion.div
          className="flex flex-col gap-2 sm:flex-row"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/80 text-lg"
            asChild
            size={"lg"}
          >
            <Link href={"/dashboard"}>داشبورد</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
