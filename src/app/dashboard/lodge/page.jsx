import { getUserLodge } from "@/app/actions/lodge";
import LodgeInfo from "@/components/Dashbaord/Lodge/LodgeInfo";

export const metadata = {
  title: "اقامت بان | اقامتگاه من",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Lodge() {
  const lodgeData = await getUserLodge();

  return <LodgeInfo userLodgeInfo={lodgeData?.data} />;
}
