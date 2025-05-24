import { Hotel, Percent, UserMinus, UserPlus } from "lucide-react";
import StatCard from "./StatCard";
import {
  persianMonthName,
  persianTodayName,
  persianTodayNumber,
  persianYear,
} from "@/lib/jalali";

export default function Overview() {
  const OverviewData = [
    {
      title: "تعداد اتاق ها",
      icon: <Hotel className="h-6 w-6" />,
      value: 10,
      description: "اتاق موجود است",
    },
    {
      title: "نرخ اتاق",
      icon: <Percent className="h-6 w-6" />,
      value: 50,
      description: " اتاق موجود است",
    },
    {
      title: "ورودی امروز",
      icon: <UserPlus className="h-6 w-6" />,
      value: 0,
      description: "مهمان ورودی امروز",
    },
    {
      title: "خروجی امروز",
      icon: <UserMinus className="h-6 w-6" />,
      value: 2,
      description: "مهمان خروجی امروز",
    },
  ];
  return (
    <div className="flex-col space-y-4">
      <div className="flex flex-col items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">نمای کلی</h1>
        <p className="text-lg text-muted-foreground pt-2">
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
