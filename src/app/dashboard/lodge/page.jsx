import { getUserLodge } from "@/app/actions/lodge";
import LodgeInfo from "@/components/Dashbaord/Lodge/LodgeInfo";

export default async function Lodge() {
  const { data, error } = await getUserLodge();

  return <LodgeInfo userLodgeInfo={data[0]} />;
}
