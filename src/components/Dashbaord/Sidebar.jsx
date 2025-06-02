"use client";

import {
  Hotel,
  CalendarSearch,
  LayoutDashboard,
  CalendarDays,
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
import { UserProfile } from "./UserButtonProfile";
import { AnimatedClock } from "./AnimatedClock";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { open, toggleSidebar, isMobile } = useSidebar();

  const pathname = usePathname();

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem onClick={toggleSidebar} className={"cursor-pointer"}>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={"باز / بسته"}
              className={"hover:bg-aqua-spark/20"}
            >
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
        {open && <AnimatedClock />}
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
                    onClick={() => {
                      if (isMobile && open) {
                        toggleSidebar();
                      }
                    }}
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
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
