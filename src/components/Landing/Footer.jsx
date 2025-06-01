"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { persianYear } from "@/lib/jalali";

export default function Footer() {
  return (
    <footer className="border-t bg-pearl-luster py-6 w-full ">
      <motion.div
        className="container max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="pt-2 mt-2  text-center text-deep-ocean/70  border-t border-deep-ocean/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>© {persianYear} اقامت‌ بان، تمامی حقوق محفوظ است.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
