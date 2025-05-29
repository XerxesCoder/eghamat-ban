import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import OccupancyPage from "@/components/Dashbaord/Calendar/OccupancyCalendar";

export default async function Calendar() {
  const { data, error } = await getUserRooms();
  const { data: reservations, error: reservationError } =
    await getUserReservations();

  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <OccupancyPage reservations={reservations} rooms={data} />
    </div>
  );
}
