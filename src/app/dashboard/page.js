import Overview from "@/components/Dashbaord/Overview/Overview";
import QuickActions from "@/components/Dashbaord/Overview/QuickActions";
import RoomStats from "@/components/Dashbaord/Overview/RoomStats";

export const metadata = {
  title: "اقامت بان | نمای کلی",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};

export default function Dashboard() {
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto" >
      <Overview />
      <QuickActions />
      <RoomStats />
    </div>
  );
}
