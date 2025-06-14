import { getUserRooms } from "@/app/actions/rooms";
import RoomsPage from "@/components/Dashbaord/Rooms/RoomInfo";

export const metadata = {
  title: "اقامت بان | اتاق ها",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Rooms() {
  const roomData = await getUserRooms();

  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <RoomsPage rooms={roomData?.data} />
    </div>
  );
}
