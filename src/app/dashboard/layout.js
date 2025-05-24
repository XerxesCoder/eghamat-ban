import { AppSidebar } from "@/components/Dashbaord/Sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className="min-h-screen bg-white w-full flex flex-col justify-center items-center">
        {children}
      </main>
    </SidebarProvider>
  );
}
