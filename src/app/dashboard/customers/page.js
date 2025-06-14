import { getUserReservations } from "@/app/actions/reserve";
import CustomersPage from "@/components/Dashbaord/Customers/CustomersInfo";

export const metadata = {
  title: "اقامت بان | مشتریان ",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default async function Customers() {
  const reserveData = await getUserReservations();
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <CustomersPage reservations={reserveData?.data} />
    </div>
  );
}
