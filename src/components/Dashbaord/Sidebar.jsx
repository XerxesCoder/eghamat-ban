"use client";

import {
  Calendar,
  Clipboard,
  Home,
  HomeIcon,
  Hotel,
  Inbox,
  Search,
  Settings,
  LayoutDashboard,
  CalendarDays,
  Moon,
  Sun,
  SunIcon,
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
  persianDate,
  persianMonthName,
  persianTodayName,
  persianTodayNumber,
} from "@/lib/jalali";
import { SignedIn, UserButton } from "@clerk/nextjs";

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
  const { setTheme, theme } = useTheme();
  console.log(theme);
  return (
    <Sidebar side="right" collapsible="icon" variant="sidebar">
      <SidebarHeader className="pb-2">
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
          <div className="flex  gap-5 justify-center items-center">
            <Clock className="h-8 w-8" />
            <div>
              <p>{persianDate}</p>
              <p>
                {`${persianTodayName}, ${persianTodayNumber} ${persianMonthName}`}
              </p>
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
                    className={`${
                      pathname === item.url ? "bg-aqua-spark " : ""
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
