import { getUserLodge } from "@/app/actions/lodge";
import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import ReservationsPage from "@/components/Dashbaord/Reserve/ReserveInfo";
export const metadata = {
  title: "اقامت بان | رزرو",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Reservation() {
  const roomData = await getUserRooms();
  const reserveData = await getUserReservations();
  const lodgeData = await getUserLodge();
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <ReservationsPage
        reservations={reserveData?.data}
        rooms={roomData?.data}
        userLodgeInfo={lodgeData?.data[0]}
      />
    </div>
  );
}
