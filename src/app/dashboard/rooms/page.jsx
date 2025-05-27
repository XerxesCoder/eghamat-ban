import { getUserRooms } from "@/app/actions/rooms";
import RoomsPage from "@/components/Dashbaord/Rooms/RoomInfo";

export default async function Rooms() {
  const { data, error } = await getUserRooms();


  return (
    <div className="py-14 px-6 w-full min-h-screen">
      <RoomsPage rooms={data} />
    </div>
  );
}
