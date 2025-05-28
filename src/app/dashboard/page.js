import Overview from "@/components/Dashbaord/Overview/Overview";
import QuickActions from "@/components/Dashbaord/Overview/QuickActions";
import RoomStats from "@/components/Dashbaord/Overview/RoomStats";
import { getUserRooms } from "../actions/rooms";
import { getUserReservations } from "../actions/reserve";
import { getDetailedTodayMovements } from "@/lib/jalali";

export default async function Dashboard() {
  const { data, error } = await getUserRooms();
  const { data: reservations, error: reservationError } =
    await getUserReservations();
  const detailedOverview = getDetailedTodayMovements(reservations);


  return (
    <div className="py-14 px-6 w-full min-h-screen">
      <Overview overviewData={detailedOverview} rooms={data} reservations={reservations} />
      <QuickActions />
      <RoomStats rooms={data} reservations={reservations} />
    </div>
  );
}
