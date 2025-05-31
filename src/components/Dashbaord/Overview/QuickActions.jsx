"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, CalendarDays, Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useLodgeData } from "../DashbaordProvider";

export default function QuickActions() {
  const { isDataLoaded } = useLodgeData();
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const actions = [
    {
      icon: <PlusCircle className="h-5 w-5 mb-1" />,
      text: "اضافه کردن اتاق",
      href: "/dashboard/rooms",
    },
    {
      icon: <CalendarDays className="h-5 w-5 mb-1" />,
      text: "رزرو جدید",
      href: "/dashboard/reservation",
    },
    {
      icon: <Calendar className="h-5 w-5 mb-1" />,
      text: "تقویم سکونت",
      href: "/dashboard/calendar",
    },
    {
      icon: <Hotel className="h-5 w-5 mb-1" />,
      text: "اقامتگاه",
      href: "/dashboard/lodge",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-4 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">عملیات سریع</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {actions.map((action, index) => (
              <motion.div key={index} variants={item}>
                <Button
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center shadow-lg w-full "
                  asChild
                  disabled={!isDataLoaded}
                >
                  <Link href={action.href}>
                    {action.icon}
                    <span>{action.text}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
