"use client";

import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, ChevronLeft } from "lucide-react";

export default function CTA() {
  const { isSignedIn } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-deep-ocean to-deep-ocean/90 w-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-aqua-spark blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 rounded-full bg-lime-zest blur-3xl"></div>
      </div>

      <motion.div
        className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-sky-glint/20 text-pearl-luster px-4 py-2 rounded-full border border-sky-glint/30"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Rocket className="h-4 w-4" />
            <span className="text-sm"> رایگان </span>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-pearl-luster">
              <span className="block">مدیریت اقامتگاه خود را متحول کنید</span>
            </h2>
            <p className="max-w-[600px] text-pearl-luster/80 md:text-xl/relaxed">
              همین حالا ثبت‌ نام کنید و در کمتر از ۲ دقیقه شروع کنید!
            </p>
          </div>

          <motion.div
            className="flex flex-col gap-4 min-[400px]:flex-row"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              className="bg-lime-zest text-deep-ocean hover:bg-lime-zest/90 hover:text-deep-ocean/90 px-8 py-6 text-lg font-bold shadow-lg transition-all hover:shadow-xl"
              asChild
            >
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="flex items-center gap-2"
              >
                شروع رایگان
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="bg-transparent text-pearl-luster border-pearl-luster hover:bg-pearl-luster/10 hover:text-pearl-luster px-8 py-6 text-lg font-bold"
              asChild
            >
              <Link href="/sign-in" className="flex items-center gap-2">
                ورود
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
