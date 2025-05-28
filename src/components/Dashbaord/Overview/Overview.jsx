import {
  CalendarCheck,
  Hotel,
  Percent,
  UserMinus,
  UserPlus,
} from "lucide-react";
import StatCard from "./StatCard";
import {
  persianMonthName,
  persianTodayName,
  persianTodayNumber,
  persianYear,
} from "@/lib/jalali";

export default function Overview({ overviewData, rooms, reservations }) {
  const OverviewData = [
    {
      title: "تعداد اتاق ها",
      icon: <Hotel className="h-6 w-6" />,
      value: `${rooms.length}`,
      description: "تعداد کل اتاق ها",
    },
    {
      title: "تعداد رزروها",
      icon: <CalendarCheck className="h-6 w-6" />,
      value: `${reservations.length}`,
      description: "رزرو تا به امروز",
    },
    {
      title: "ورودی امروز",
      icon: <UserPlus className="h-6 w-6" />,
      value: `${overviewData.checkingIn.guests}`,
      description: `مهمان ورودی امروز | (${overviewData.checkingIn.count} اتاق)`,
    },
    {
      title: "خروجی امروز",
      icon: <UserMinus className="h-6 w-6" />,
      value: `${overviewData.checkingOut.guests}`,
      description: `مهمان خروجی امروز | (${overviewData.checkingOut.count} اتاق) `,
    },
  ];
  return (
    <div className="flex-col space-y-4">
      <div className="flex flex-col items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">نمای کلی</h1>
        <p className="text-lg text-deep-ocean pt-2">
          امروز {persianTodayName}, {persianTodayNumber} {persianMonthName}{" "}
          {persianYear}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {OverviewData.map((item, idx) => (
          <StatCard
            key={idx}
            title={item.title}
            icon={item.icon}
            value={item.value}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
