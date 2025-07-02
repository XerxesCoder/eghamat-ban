import Overview from "@/components/Dashbaord/Overview/Overview";
import QuickActions from "@/components/Dashbaord/Overview/QuickActions";
import RoomStats from "@/components/Dashbaord/Overview/RoomStats";
import { getUserReservations } from "../actions/reserve";
import { getUserRooms } from "../actions/rooms";
import { getUserLodge } from "../actions/lodge";

export const metadata = {
  title: "اقامت بان | نمای کلی",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};

export default async function Dashboard() {
  const roomData = await getUserRooms();
  const reserveData = await getUserReservations();
  const lodgeData = await getUserLodge();

  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <Overview rooms={roomData?.data} reservations={reserveData?.data} />
      <QuickActions />
      <RoomStats rooms={roomData?.data} reservations={reserveData?.data} />
    </div>
  );
}
