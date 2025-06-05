"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Menu, X, Home, User, Calendar, Star, LogIn } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const pagesLink = [
    {
      href: "#features",
      label: "ویژگی‌ها",
      icon: <Star className="w-5 h-5" />,
    },
    {
      href: "#demo",
      label: "راهنما ",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      href: "#testimonials",
      label: "نظرات",
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-deep-ocean/10 bg-pearl-luster/95 backdrop-blur supports-[backdrop-filter]:bg-pearl-luster/60"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.h3
            className="text-xl font-bold text-deep-ocean"
            whileHover={{ scale: 1.05 }}
          >
            اقامت‌بان
          </motion.h3>
        </Link>

        <motion.nav
          className="hidden lg:flex items-center gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {pagesLink.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={link.href}
                className="flex items-center gap-1 text-deep-ocean hover:text-aqua-spark transition-colors text-sm font-medium"
              >
                {link.icon}
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <div className="hidden lg:flex items-center gap-3">
          {isSignedIn ? (
            <Button
              className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90 font-bold"
              asChild
            >
              <Link href="/dashboard">داشبورد مدیریت</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-deep-ocean text-deep-ocean"
                asChild
              >
                <Link href="/sign-in" className="flex items-center gap-1">
                  <LogIn className="w-4 h-4" />
                  ورود
                </Link>
              </Button>
              <Button
                className="bg-lime-zest text-deep-ocean hover:bg-lime-zest/80 px-6 font-bold"
                asChild
              >
                <Link href="/sign-up">ثبت‌نام رایگان</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-deep-ocean hover:text-aqua-spark transition-colors p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="منو"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {isOpen && (
          <motion.div
            className="absolute top-16 left-0 w-full bg-pearl-luster/95 backdrop-blur-lg shadow-md flex flex-col items-center py-4 gap-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {pagesLink.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-2 text-deep-ocean hover:text-aqua-spark text-lg w-full justify-center py-3 border-b border-deep-ocean/10"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.label}
              </a>
            ))}

            <div className="flex flex-col gap-4 w-full px-8 mt-4">
              {isSignedIn ? (
                <Button
                  className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
                  asChild
                >
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    داشبورد مدیریت
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-deep-ocean text-deep-ocean "
                    asChild
                  >
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      ورود به حساب کاربری
                    </Link>
                  </Button>
                  <Button
                    className="bg-lime-zest text-deep-ocean hover:bg-lime-zest/80"
                    asChild
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      ثبت‌نام رایگان
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
