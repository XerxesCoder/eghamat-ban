import { AppSidebar } from "@/components/Dashbaord/Sidebar";
import { MobileHeader } from "@/components/Dashbaord/MobileHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import DashbaordProvider from "@/components/Dashbaord/DashbaordProvider";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <MobileHeader />
      <SidebarInset className=" bg-pearl-luster overflow-x-hidden">
        <Toaster richColors position="top-center" />
        <DashbaordProvider>{children}</DashbaordProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
