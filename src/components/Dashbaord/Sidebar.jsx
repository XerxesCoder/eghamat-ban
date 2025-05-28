"use client";

import {
  HomeIcon,
  Hotel,
  Calendar,
  LayoutDashboard,
  CalendarDays,
  Clock,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  persianMonthName,
  persianTodayName,
  persianTodayNumber,
  persianYear,
} from "@/lib/jalali";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Menu items.
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
    title: " اقامتگاه من",
    url: "/dashboard/lodge",
    icon: Hotel,
  },
];

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  const pathname = usePathname();

  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("fa-IR", {
        timeStyle: "full",
      });
      setCurrentTime(formatter.format(new Date()).split(" ")[0]);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Sidebar side="right" collapsible="icon" variant="inset">
      <SidebarHeader className="pb-2 ">
        <SidebarMenu>
          <SidebarMenuItem onClick={toggleSidebar} className={"cursor-pointer"}>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/assets/logo.png" alt="EghamatBan" />
                  <AvatarFallback>EG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">اقامت بان</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {open && (
          <div className="flex  gap-5 justify-start items-center">
            <Clock className="h-6 w-6" />
            <div>
              <p>
                {`${persianTodayName}, ${persianTodayNumber} ${persianMonthName} ${persianYear}`}
              </p>
              <p>{currentTime}</p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>داشبورد</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={` hover:bg-aqua-spark/20 ${
                      pathname === item.url &&
                      "bg-aqua-spark border-l-2 border-deep-ocean pointer-events-none"
                    }`}
                    size="md"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <SidebarTrigger />
        {open && (
          <SignedIn>
            <UserButton showName />
          </SignedIn>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
