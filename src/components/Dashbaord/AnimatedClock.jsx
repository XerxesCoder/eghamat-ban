"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  convertToEnglishDigits,
  persianMonthName,
  persianTodayName,
  persianTodayNumber,
  persianYear,
} from "@/lib/jalali";

export function AnimatedClock() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("fa-IR", {
        timeStyle: "full",
      });

      setTime(formatter.format(new Date()).split(" ")[0]);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getTimeOfDay = () => {
    const hourJalali = time.split(":")[0];
    const hour = convertToEnglishDigits(hourJalali);

    if (hour >= 5 && hour < 12) return "صبح";
    if (hour >= 12 && hour < 15) return "ظهر";
    if (hour >= 15 && hour < 18) return "بعد از ظهر";
    if (hour >= 18 && hour < 20) return "عصر";
    return "شب";
  };

  const getTimeOfDayMessage = () => {
    const timeOfDay = getTimeOfDay();
    switch (timeOfDay) {
      case "صبح":
        return "صبح بخیر! روز خوبی داشته باشی";
      case "ظهر":
        return "ظهر بخیر! وقت استراحته";
      case "بعد از ظهر":
        return "بعد از ظهر خوبی داشته باشی";
      case "عصر":
        return "عصر بخیر! امیدوارم روز خوبی داشتی";
      case "شب":
        return "شب بخیر! خسته نباشی";
      default:
        return "سلام! حالت چطوره؟";
    }
  };

  return (
    <div className="p-2 ">
      <div className="text-center">
        <p className={`text-lg font-bold text-black mb-1  duration-1000`}>
          {time}
        </p>

        <div className="text-sm text-deep-ocean font-bold">
          {`${persianTodayName}, ${persianTodayNumber} ${persianMonthName} ${persianYear}`}
        </div>

        <div className="mt-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-deep-ocean bg-sky-glint`}
          >
            {getTimeOfDayMessage()}
          </span>
        </div>
      </div>
    </div>
  );
}
