"use client";

import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "محمد رضایی",
      role: "مدیر مهمانسرای آرامش، تهران",
      quote:
        "با اقامت‌بان دیگر هیچ رزروی گم نمی‌شود! سیستم مدیریت اتاق‌ها زندگی من را راحت کرده. درآمد ما در ۳ ماه اول ۳۵٪ افزایش داشت.",
      rating: 5,
      improvement: "کاهش ۷۰٪ خطاهای دستی",
    },
    {
      name: "فاطمه محمدی",
      role: "مدیر اقامتگاه بهشت، اصفهان",
      quote:
        "گزارشات مالی خودکار اقامت‌بان واقعاً نجات‌بخش بود. حالا می‌توانم روی مهمان‌نوازی تمرکز کنم نه محاسبات دستی.",
      rating: 5,
      improvement: "صرفه‌جویی ۱۰ ساعت در هفته",
    },
    {
      name: "علی کریمی",
      role: "مدیر هتل آفتاب، مشهد",
      quote:
        "مهمانان عاشق سیستم سریع چک‌این شده‌اند. رابط کاربری ساده باعث شده تمام کارمندان به راحتی از سیستم استفاده کنند.",
      rating: 4,
      improvement: "رضایت مشتریان +۴۰٪",
    },
    {
      name: "زهرا حسینی",
      role: "مدیر مهمانپذیر دریا، چالوس",
      quote:
        "تقویم رزرواسیون اقامت‌بان بهترین ویژگی آن است. به راحتی می‌توانم ۶ ماه آینده را برنامه‌ریزی کنم.",
      rating: 5,
      improvement: "افزایش ۵۰٪ رزروهای آنلاین",
    },
  ];

  return (
    <section id="testimonials" className="py-20 w-full bg-white">
      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6"
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
            صدای مشتریان ما
          </h4>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
            مدیران چه می‌گویند؟
          </h2>
          <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed">
            تجربه واقعی مدیران اقامتگاه‌هایی که به اقامت‌بان اعتماد کردند
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-sky-glint/50 bg-pearl-luster p-6 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 flex items-center justify-center rounded-full bg-deep-ocean text-white font-bold`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-ocean">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-deep-ocean/70">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${
                        j < testimonial.rating
                          ? "text-aqua-spark fill-current"
                          : "text-deep-ocean/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <blockquote className="text-deep-ocean mb-4 relative pl-4">
                <p className="text-justify">"{testimonial.quote}"</p>
              </blockquote>
              <p className="text-xs  text-deep-ocean px-2 py-1 rounded">
                {testimonial.improvement}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
