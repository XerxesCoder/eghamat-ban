"use client";

import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
export default function CTA() {
  const { isSignedIn } = useAuth;
  return (
    <section className="py-20 bg-gradient-to-r from-aqua-spark to-lime-zest w-full">
      <motion.div
        className="container px-4 md:px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
              <span className="block"> رایگان امتحان کنید</span>
            </h2>
            <p className="max-w-[600px] text-deep-ocean/80 md:text-xl/relaxed">
              همین امروز مدیریت هوشمند را شروع کنید
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button variant="outline" asChild>
              <Link href={"/sign-in"}>ورود</Link>
            </Button>
            <Button
              className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
              asChild
            >
              <Link href={"/dashboard"}>ورود به داشبورد</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={"/sign-up"}>ثبت‌ نام </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
