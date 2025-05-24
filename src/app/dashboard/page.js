import Overview from "@/components/Dashbaord/Overview/Overview";
import QuickActions from "@/components/Dashbaord/Overview/QuickActions";

export default function Dashboard() {
  return (
    <div className="  py-14 px-6 w-full min-h-screen">
      <Overview />
      <QuickActions />
    </div>
  );
}
