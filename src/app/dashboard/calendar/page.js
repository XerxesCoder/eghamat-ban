import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import OccupancyPage from "@/components/Dashbaord/Calendar/OccupancyCalendar";

export const metadata = {
  title: "اقامت بان | تقویم",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Calendar() {
  const roomData = await getUserRooms();
  const reserveData = await getUserReservations();
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <OccupancyPage rooms={roomData?.data} reservations={reserveData?.data} />
    </div>
  );
}
