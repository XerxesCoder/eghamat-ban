import CustomersPage from "@/components/Customers/CustomersInfo";

export const metadata = {
  title: "اقامت بان | مشتریان ",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};
export default function Customers() {
  return (
    <div className="py-20 sm:py-14 px-6 w-full min-h-screen  container mx-auto">
      <CustomersPage />
    </div>
  );
}
