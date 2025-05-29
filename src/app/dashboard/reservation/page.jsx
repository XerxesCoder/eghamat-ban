import { getUserReservations } from "@/app/actions/reserve";
import { getUserRooms } from "@/app/actions/rooms";
import ReservationsPage from "@/components/Dashbaord/Reserve/ReserveInfo";

export default async function Reservation() {
  const { data, error } = await getUserRooms();
  const { data: reservations, error: reservationError } =
    await getUserReservations();
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <ReservationsPage rooms={data} reservations={reservations} />
    </div>
  );
}
