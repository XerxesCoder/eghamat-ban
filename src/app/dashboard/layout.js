import { AppSidebar } from "@/components/Dashbaord/Sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className="min-h-screen bg-pearl-luster w-full flex flex-col justify-center items-center">
        <Toaster richColors position="top-center" />
        {children}
      </main>
    </SidebarProvider>
  );
}
