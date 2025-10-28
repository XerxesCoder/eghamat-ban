import { AppSidebar } from "@/components/Dashbaord/Sidebar";
import { MobileHeader } from "@/components/Dashbaord/MobileHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <MobileHeader />
      <SidebarInset className=" bg-pearl-luster overflow-x-hidden"> 
        <Toaster
          richColors
          swipeDirections={"right"}
          closeButton
          position="top-center"
          visibleToasts={3}
          dir="rtl"
          style={{
            fontFamily: "Vazirmatn, sans-serif",
          }}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
