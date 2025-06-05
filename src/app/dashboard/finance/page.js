import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import FinanceInfo from "@/components/Dashbaord/Finance/FinanceInfo";

export const metadata = {
  title: "اقامت بان | مالی ",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Finance() {
  const roomData = await getUserRooms();
  const reserveData = await getUserReservations();
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <FinanceInfo reservations={reserveData?.data} rooms={roomData?.data} />
    </div>
  );
}
