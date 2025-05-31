"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Demo() {
  return (
    <section id="demo" className="py-20 bg-pearl-luster w-full">
      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-block rounded-lg bg-sky-glint px-3 py-1 text-sm text-deep-ocean">
            راهنمای مدیریت اقامتگاه
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
            مدیریت آسان مهمانسرا با اقامت‌بان
          </h2>
          <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            از ثبت اقامتگاه تا مدیریت رزروها و بررسی وضعیت اتاق‌ها
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl grid gap-6 py-12 lg:grid-cols-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            {
              title: "۱. ثبت اقامتگاه",
              description:
                "مدیران مهمانسرا می‌توانند اطلاعات اقامتگاه خود را ثبت کنند، شامل نام، موقعیت مکانی و امکانات.",
            },
            {
              title: "۲. افزودن اتاق‌ها",
              description:
                "تعریف اتاق‌های مختلف با ظرفیت، قیمت‌گذاری، عکس‌ها و توضیحات برای هر واحد.",
            },
            {
              title: "۳. مدیریت رزروها",
              description:
                "رزروهای جدید را بررسی کنید، اتاق‌ها را اختصاص دهید و تغییرات را به‌صورت زنده مشاهده کنید.",
            },
            {
              title: "۴. بررسی وضعیت اتاق‌ها",
              description:
                "اطلاعات اتاق‌های اشغال شده و در دسترس را مشاهده کنید، تنظیمات مربوط به پذیرش را مدیریت کنید.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-lg border border-sky-glint bg-pearl-luster p-6 shadow-md transition-all hover:shadow-lg hover:shadow-aqua-spark/10 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-spark text-deep-ocean mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-deep-ocean mb-2">
                {step.title}
              </h3>
              <p className="text-deep-ocean/80">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
