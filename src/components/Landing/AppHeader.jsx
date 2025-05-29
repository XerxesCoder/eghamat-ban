"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-deep-ocean">اقامت‌ بان</h3>
        </div>

        <div className="md:hidden">
          <button
            className="text-deep-ocean hover:text-aqua-spark transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.nav
          className="hidden md:flex items-center gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { href: "#features", label: "ویژگی‌ها" },
            { href: "#testimonials", label: "نظرات کاربران" },
            { href: "#pricing", label: "تعرفه‌ها" },
          ].map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              <Link
                href={link.href}
                className="text-deep-ocean hover:text-aqua-spark transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <Button
              className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
              asChild
            >
              <Link href={"/dashboard"}>ورود به داشبورد</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href={"/sign-in"}>ورود</Link>
              </Button>
              <Button
                className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
                asChild
              >
                <Link href={"/sign-up"}>ثبت‌ نام رایگان</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="absolute top-16 left-0 w-full bg-background shadow-md flex flex-col items-center py-4 gap-4 md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { href: "#features", label: "ویژگی‌ها" },
            { href: "#testimonials", label: "نظرات کاربران" },
            { href: "#pricing", label: "تعرفه‌ها" },
          ].map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-deep-ocean hover:text-aqua-spark transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex justify-center items-center gap-5">
            {isSignedIn ? (
              <Button
                className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
                asChild
              >
                <Link href={"/dashboard"}>ورود به داشبورد</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={"/sign-in"}>ورود</Link>
                </Button>
                <Button
                  className="bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/90"
                  asChild
                >
                  <Link href={"/sign-up"}>ثبت‌ نام رایگان</Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
