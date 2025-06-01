"use client";

import {
  HomeIcon,
  Hotel,
  CalendarSearch,
  LayoutDashboard,
  CalendarDays,
  Clock,
  Banknote,
  DoorClosed,
  Users,
  DollarSign,
} from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

const items = [
  {
    title: "نمای کلی",
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "اتاق ها",
    url: "/dashboard/rooms",
    icon: DoorClosed,
  },
  {
    title: "رزرو",
    url: "/dashboard/reservation",
    icon: CalendarDays,
  },
  {
    title: "تقویم سکونت",
    url: "/dashboard/calendar",
    icon: CalendarSearch,
  },
  {
    title: "مالی",
    url: "/dashboard/finance",
    icon: DollarSign,
  },
  {
    title: "مشتریان",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: " اقامتگاه من",
    url: "/dashboard/lodge",
    icon: Hotel,
  },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
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
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
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
            {/*     <Clock className="h-6 w-6" /> */}
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

      <SidebarFooter>
        {open && (
          <SignedIn>
            <SidebarMenuButton
              size="md"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserButton
                showName
                appearance={{
                  elements: {
                    userButtonTrigger:
                      "flex flex-row-reverse items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100",
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonBox: "flex-row-reverse ",
                    userButtonOuterIdentifier: "pl-0",
                  },
                }}
              />
            </SidebarMenuButton>
          </SignedIn>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
