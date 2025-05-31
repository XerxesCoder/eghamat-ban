"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
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
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-block rounded-lg bg-sky-glint px-3 py-1 text-sm text-deep-ocean">
            نظرات مشتریان
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
            تجربه مدیران مهمانسراها
          </h2>
          <p className="max-w-[900px] text-deep-ocean/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            نظرات مدیرانی که با اقامت‌بان کسب و کار خود را متحول کرده‌اند
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            {
              name: "محمد رضایی",
              role: "مدیر مهمانسرای تهران",
              color: "bg-aqua-spark",
              quote:
                "اقامت‌بان به من کمک کرد تا مدیریت مهمان‌پذیر خود را به طور کامل متحول کنم. دیگر نگران از دست دادن رزروها نیستم و درآمدم ۴۰٪ افزایش یافته است.",
            },
            {
              name: "سارا احمدی",
              role: "مدیر اقامتگاه اصفهان",
              color: "bg-coral-pulse",
              quote:
                "سیستم گزارش‌دهی اقامت‌بان فوق‌العاده است. حالا به راحتی می‌توانم تصمیمات تجاری بگیرم و مهمانان رضایت بیشتری دارند.",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              className="rounded-xl bg-sky-glint p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div
                  className={`h-12 w-12 flex items-center justify-center rounded-full ${testimonial.color} text-white font-bold`}
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
              <blockquote className="text-deep-ocean">
                <p className="mb-2">"{testimonial.quote}"</p>
              </blockquote>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
