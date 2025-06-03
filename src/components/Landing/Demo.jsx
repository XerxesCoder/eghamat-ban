"use client";

import { motion } from "framer-motion";
import { Home, Bed, Calendar, ClipboardCheck } from "lucide-react";

export default function Demo() {
  const steps = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "۱. ثبت اقامتگاه",
      description:
        "پروفایل اقامتگاه خود را در کمتر از ۵ دقیقه ایجاد کنید. نام، آدرس، امکانات و تصاویر را اضافه نمایید.",
      tip: "می‌توانید بعداً اطلاعات را تکمیل کنید",
    },
    {
      icon: <Bed className="h-6 w-6" />,
      title: "۲. تنظیم اتاق‌ها",
      description:
        "اتاق‌های خود را با جزئیات کامل (ظرفیت، قیمت، امکانات) اضافه کنید و وضعیت آن‌ها را مدیریت نمایید.",
      tip: "از عکس‌های باکیفیت استفاده کنید",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "۳. مدیریت رزروها",
      description:
        "رزروهای جدید را ثبت کنید، مهمانان را به اتاق‌ها اختصاص دهید و تقویم اشغال را به صورت لحظه‌ای مشاهده نمایید.",
      tip: "هشدارهای رزرو خودکار دریافت کنید",
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "۴. نظارت و گزارشات",
      description:
        "وضعیت مالی، نرخ اشغال و رضایت مشتریان را از طریق داشبورد هوشمند پیگیری کنید.",
      tip: "گزارشات را به صورت ماهانه دریافت نمایید",
    },
  ];

  return (
    <section id="demo" className="py-20 bg-pearl-luster w-full">
      <motion.div
        className="container max-w-7xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="inline-block rounded-lg bg-lime-zest px-3 py-1 text-sm text-deep-ocean">
            راهنمای شروع
          </h4>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
            تنها در ۴ مرحله ساده مدیریت را شروع کنید
          </h2>
          <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed">
            ثبت نام تا مدیریت حرفه‌ای اقامتگاه
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl grid gap-6 py-12 lg:grid-cols-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-xl border border-sky-glint/50 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-aqua-spark group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-spark/20 text-deep-ocean flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-deep-ocean mb-2">
                    {step.title}
                  </h3>
                  <p className="text-deep-ocean/80 mb-3">{step.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-aqua-spark to-lime-zest opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
