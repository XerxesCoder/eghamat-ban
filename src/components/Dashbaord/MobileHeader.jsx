// components/Dashboard/MobileHeader.js
"use client";

import {
  LayoutDashboard,
  HomeIcon,
  CalendarDays,
  Calendar,
  Hotel,
  X,
  Menu,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function MobileHeader() {
  const { toggleSidebar, open } = useSidebar();
  const pathname = usePathname();

  const items = [
    {
      title: "نمای کلی",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "اتاق ها",
      url: "/dashboard/rooms",
      icon: HomeIcon,
    },
    {
      title: "رزرو",
      url: "/dashboard/reservation",
      icon: CalendarDays,
    },
    {
      title: "تقویم سکونت",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "اقامتگاه من",
      url: "/dashboard/lodge",
      icon: Hotel,
    },
  ];

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b">
      <div className="flex items-center justify-between p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-8 w-8" />
        </Button>

        <div className="flex-1 text-center">
          <h3 className="text-deep-ocean font-bold">
            {items.find((item) => item.url === pathname)?.title}
          </h3>
        </div>

        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/assets/logo.png"
            alt="EghamatBan"
            className="rounded-full"
          />
          <AvatarFallback>EG</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
