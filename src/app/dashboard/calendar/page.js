import OccupancyPage from "@/components/Dashbaord/Calendar/OccupancyCalendar";

export const metadata = {
  title: "اقامت بان | تقویم",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default function Calendar() {
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <OccupancyPage />
    </div>
  );
}
