"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="border-t bg-pearl-luster py-12 w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="grid gap-8 lg:grid-cols-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            {
              title: "اقامت‌بان",
              description:
                "مدیریت هوشمند اتاق‌های مهمانسرای شما. رزروها، وضعیت اتاق‌ها و درآمدها در یک پنل",
            },
            {
              title: "محصول",
              links: ["امکانات", "تعرفه‌ها", "نمایش محصول"],
            },
            {
              title: "شرکت",
              links: ["درباره ما", "بلاگ", "همکاری با ما"],
            },
            {
              title: "پشتیبانی",
              links: ["مرکز راهنما", "تماس با ما", "حریم خصوصی"],
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <h3 className="font-bold text-deep-ocean">{section.title}</h3>
              {section.description && (
                <p className="text-deep-ocean/70 max-w-xs">
                  {section.description}
                </p>
              )}
              {section.links && (
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href="#"
                        className="text-deep-ocean/70 hover:text-aqua-spark transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-12 border-t border-deep-ocean/10 pt-6 text-center text-deep-ocean/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>© ۱۴۰۳ اقامت‌بان. تمام حقوق محفوظ است.</p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
