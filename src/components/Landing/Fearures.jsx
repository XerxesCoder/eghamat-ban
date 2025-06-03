"use client";

import {
  CalendarCheck,
  LineChart,
  BellRing,
  Users,
  Wallet,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "مدیریت هوشمند اتاق‌ها",
      description:
        "نمای کلی از وضعیت اتاق‌ها به همراه امکان فیلتر و جستجوی سریع",
      tag: "سیستم یکپارچه",
    },
    {
      icon: <BellRing className="h-6 w-6" />,
      title: "رزرواسیون آسان",
      description:
        "ثبت رزرو جدید در کمتر از 30 ثانیه با امکان ذخیره اطلاعات مشتریان دائمی",
      tag: "بدون دردسر",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "مدیریت مشتریان",
      description:
        "دسته‌بندی خودکار مشتریان به صورت جدید، دائمی و VIP با تاریخچه اقامت کامل",
      tag: "مشتری مداری",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "تقویم رزروها",
      description: " نمایش گرافیکی رزروها بر اساس تاریخ و اتاق ها  ",
      tag: "دید کلی",
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "گزارشات مالی",
      description: "محاسبه خودکار درآمد ماهانه و سالانه با نمودارهای تحلیلی",
      tag: "شفافیت مالی",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "صدور فاکتور",
      description:
        "صدور فاکتورهای زیبا و حرفه‌ای با قالب‌های قابل تنظیم و لوگوی شما",
      tag: "حرفه‌ای",
    },
  ];

  return (
    <section id="features" className="w-full py-20 bg-white">
      <motion.div
        className="container max-w-7xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="inline-block rounded-lg bg-lime-zest px-3 py-1 text-sm text-deep-ocean mb-10">
              چرا اقامت‌ بان؟
            </h4>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
              مدیریت اقامتگاه خود را متحول کنید
            </h2>
            <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed">
              تمام ابزارهای مورد نیاز برای مدیریت حرفه‌ای اقامتگاه در یک پنل
              ساده و کاربردی
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-sky-glint/50 bg-pearl-luster p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-aqua-spark"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-spark/20 text-deep-ocean mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-deep-ocean mb-2">
                {feature.title}
              </h3>
              <p className="text-deep-ocean/80 text-justify">
                {feature.description}
              </p>
              <p className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-zest/50 px-3 py-1 text-xs font-medium text-deep-ocean border border-lime-zest/30">
                {feature.tag}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
