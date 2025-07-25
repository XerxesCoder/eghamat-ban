"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";

import { User, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
export function UserProfile() {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!isLoaded) return null;
  if (!user?.id) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="cursor-pointer">
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            asChild
            tooltip={"پروفایل "}
            className={"hover:bg-aqua-spark/20"}
          >
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 w-full p-2 hover:bg-blue-50 rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.username} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-0.5  text-right">
                  <span className="font-semibold text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
          </SidebarMenuButton>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem
              onClick={() => openUserProfile()}
              className="cursor-pointer flex justify-end items-center "
            >
              <span>حساب کاربری</span>
              <User className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut()}
              className="cursor-pointer  flex justify-end items-center group text-red-600 focus:bg-red-600 focus:text-white"
            >
              <span>خروج</span>
              <LogOut className="h-4 w-4 text-red-600 group-hover:text-white" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
