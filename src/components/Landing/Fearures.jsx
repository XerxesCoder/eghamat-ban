"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="w-full py-20 bg-white">
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
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-block rounded-lg bg-sky-glint px-3 py-1 text-sm text-deep-ocean">
              امکانات ویژه
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
              تمام آنچه برای مدیریت نیاز دارید
            </h2>
            <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              مجموعه ابزارهای کامل برای مدیریت حرفه‌ای مهمانسرا
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
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-sky-glint bg-pearl-luster p-6 shadow-md transition-all hover:shadow-lg hover:shadow-aqua-spark/10 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-spark text-deep-ocean mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-deep-ocean mb-2">
                {["اطلاع‌رسانی لحظه‌ای", "مدیریت رزرواسیون", "تحلیل درآمد"][i]}
              </h3>
              <p className="text-deep-ocean/80">
                {
                  [
                    "دریافت هشدارهای فوری هنگام خالی شدن یا رزرو اتاق‌ها",
                    "مدیریت آسان رزروها، ورود و خروج مهمانان در یک پنل",
                    "رصد درآمدها و نرخ اشغال با گزارش‌های تحلیلی دقیق",
                  ][i]
                }
              </p>
              <div className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-zest px-3 py-1 text-xs font-medium text-deep-ocean">
                {["بروزرسانی زنده", "یکپارچه", "داده‌محور"][i]}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
