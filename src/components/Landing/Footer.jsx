"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { persianYear } from "@/lib/jalali";

export default function Footer() {
  return (
    <footer className="border-t bg-pearl-luster py-12 w-full ">
      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            {
              title: "اقامت‌ بان",
              description: "مدیریت هوشمند اتاق‌های اقامتگاه شما",
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              className="space-y-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <h3 className="font-bold text-deep-ocean">{section.title}</h3>
              {section.description && (
                <p className="text-deep-ocean/70 max-w-xs">
                  {section.description}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="pt-2 mt-2  text-center text-deep-ocean/70  border-t border-deep-ocean/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>© {persianYear} اقامت‌ بان. تمامی حقوق محفوظ است.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
