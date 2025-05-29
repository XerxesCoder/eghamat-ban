import { getUserRooms } from "@/app/actions/rooms";
import RoomsPage from "@/components/Dashbaord/Rooms/RoomInfo";

export default async function Rooms() {
  const { data, error } = await getUserRooms();


  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <RoomsPage rooms={data} />
    </div>
  );
}
