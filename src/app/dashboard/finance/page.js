import FinanceInfo from "@/components/Dashbaord/Finance/FinanceInfo";

export const metadata = {
  title: "اقامت بان | درآمد ",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default function Finance() {
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <FinanceInfo />
    </div>
  );
}
