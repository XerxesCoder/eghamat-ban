"use client";

import { motion } from "framer-motion";
import { persianYear } from "@/lib/jalali";
import { Mail, Github } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "دسترسی سریع",
      links: [
        { name: "ویژگی‌ها", href: "#features" },
        { name: "راهنما  ", href: "#demo" },
        { name: "نظرات", href: "#testimonials" },
      ],
    },
    {
      title: "پشتیبانی",
      links: [
        {
          name: "xerxescode@gmail.com",
          href: "mailto:xerxescode@gmail.com",
          icon: <Mail className="h-4 w-4" />,
        },
        {
          name: "توسعه‌دهنده",
          href: "https://github.com/XerxesCoder",
          icon: <Github className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <footer className="border-t bg-pearl-luster w-full">
      <motion.div
        className="container max-w-7xl mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-deep-ocean">اقامت‌ بان</h3>
            <p className="text-deep-ocean/80 text-justify">
              مدیریت هوشمند مهمانپذیرها و اقامتگاه‌ها
            </p>
          </div>

          {footerLinks.map((section, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-lg font-bold text-deep-ocean">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-deep-ocean/80 hover:text-deep-ocean transition-colors"
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                    >
                      {link.icon && link.icon}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          className="pt-6  text-center text-deep-ocean/70 border-t border-deep-ocean/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>© {persianYear} اقامت‌ بان</p>
          <p className="text-sm mt-2">
            تمامی حقوق برای تیم اقامت‌ بان محفوظ است{" "}
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
