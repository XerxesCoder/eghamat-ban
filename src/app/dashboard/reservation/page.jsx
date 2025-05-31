import ReservationsPage from "@/components/Dashbaord/Reserve/ReserveInfo";
export const metadata = {
  title: "اقامت بان | رزرو",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default  function Reservation() {
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <ReservationsPage />
    </div>
  );
}
