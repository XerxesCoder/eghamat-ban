import { AppSidebar } from "@/components/Dashbaord/Sidebar";
import { MobileHeader } from "@/components/Dashbaord/MobileHeader";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <MobileHeader />
      <SidebarInset className=" bg-pearl-luster overflow-x-hidden">
        <Toaster richColors position="top-center" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
