"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import moment from "moment-jalaali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  Receipt,
  BarChart3,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useLodgeData } from "../DashbaordProvider";
import { updateReservationStatuses } from "@/lib/jalali";

moment.loadPersian({ dialect: "persian-modern" });

const FinancePage = () => {
  const { rooms, reservations } = useLodgeData();
  const [selectedYear, setSelectedYear] = useState(moment().jYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const monthlyData = useMemo(() => {
    const monthlyData = {};
    const updatedRes = updateReservationStatuses(reservations);
    const completedReservations = updatedRes.filter(
      (res) => res.status !== "CONFIRMED"
    );

    completedReservations.forEach((reservation) => {
      const checkInDate = moment(reservation.check_in, "jYYYY/jM/jD");

      const year = checkInDate.jYear();
      const month = checkInDate.jMonth();
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          year,
          month,
          monthName: checkInDate.format("jMMMM"),
          totalRevenue: 0,
          totalReservations: 0,
          averageBookingValue: 0,
          occupancyRate: 0,
          roomNights: 0,
        };
      }

      monthlyData[key].totalRevenue += reservation.total_price;
      monthlyData[key].totalReservations += 1;

      const checkIn = moment(reservation.check_in, "jYYYY/jM/jD");
      const checkOut = moment(reservation.check_out, "jYYYY/jM/jD");
      const nights = checkOut.diff(checkIn, "days");
      monthlyData[key].roomNights += nights;
    });

    Object.values(monthlyData).forEach((data) => {
      data.averageBookingValue =
        data.totalReservations > 0
          ? data.totalRevenue / data.totalReservations
          : 0;
      const daysInMonth = moment.jDaysInMonth(data.year, data.month);
      const totalPossibleRoomNights = rooms.length * daysInMonth;
      data.occupancyRate =
        totalPossibleRoomNights > 0
          ? (data.roomNights / totalPossibleRoomNights) * 100
          : 0;
    });

    return Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [reservations, rooms]);

  const roomRevenueData = useMemo(() => {
    const roomRevenue = {};

    rooms.forEach((room) => {
      roomRevenue[room.id] = {
        roomId: room.id,
        roomNumber: room.room_number,
        roomType: room.type,
        revenue: 0,
        bookings: 0,
      };
    });

    const updatedRes = updateReservationStatuses(reservations);
    const filteredReservations = updatedRes.filter((res) => {
      if (res.status == "CONFIRMED") return false;

      const checkInDate = moment(res.check_in, "jYYYY/jM/jD");
      const resYear = checkInDate.jYear();
      const resMonth = checkInDate.jMonth();

      if (selectedMonth !== null) {
        return resYear === selectedYear && resMonth === selectedMonth;
      } else {
        return resYear === selectedYear;
      }
    });

    filteredReservations.forEach((reservation) => {
      if (roomRevenue[reservation.room_id]) {
        roomRevenue[reservation.room_id].revenue += reservation.total_price;
        roomRevenue[reservation.room_id].bookings += 1;
      }
    });

    return Object.values(roomRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .filter(
        (room) =>
          room.roomNumber.toString().includes(searchTerm) ||
          room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [reservations, rooms, selectedYear, selectedMonth]);

  const exportFinancialData = () => {
    const monthlyData = calculateMonthlyRevenue();
    const roomData = calculateRevenueByRoom(selectedYear, selectedMonth);

    let csv = "گزارش مالی\n\nخلاصه درآمد ماهانه\n";
    csv +=
      "سال,ماه,درآمد کل,تعداد رزروها,میانگین ارزش رزرو,نرخ اشغال,شب اقامت\n";

    monthlyData.forEach((data) => {
      csv += `${data.year},${data.monthName},${data.totalRevenue},${
        data.totalReservations
      },${data.averageBookingValue.toFixed(2)},${data.occupancyRate.toFixed(
        1
      )}%,${data.roomNights}\n`;
    });

    csv += "\n\nتجزیه درآمد بر اساس اتاق\nاتاق,درآمد,تعداد رزروها\n";

    roomData.forEach((room) => {
      csv += `${room.roomNumber},${room.revenue},${room.bookings}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `گزارش-مالی-${selectedYear}${
      selectedMonth !== null ? `-${selectedMonth + 1}` : ""
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.dismiss();
    toast.success("خروجی موفق", {
      description: "گزارش مالی با فرمت CSV دانلود شد.",
    });
  };

  const currentYearData = monthlyData.filter(
    (data) => data.year === selectedYear
  );
  const ytdRevenue = currentYearData.reduce(
    (sum, data) => sum + data.totalRevenue,
    0
  );
  const ytdReservations = currentYearData.reduce(
    (sum, data) => sum + data.totalReservations,
    0
  );
  const avgMonthlyRevenue =
    currentYearData.length > 0 ? ytdRevenue / currentYearData.length : 0;

  const previousYearData = monthlyData.filter(
    (data) => data.year === selectedYear - 1
  );
  const previousYearRevenue = previousYearData.reduce(
    (sum, data) => sum + data.totalRevenue,
    0
  );
  const revenueGrowth =
    previousYearRevenue > 0
      ? ((ytdRevenue - previousYearRevenue) / previousYearRevenue) * 100
      : 0;

  const availableYears = [
    ...new Set(monthlyData.map((data) => data.year)),
  ].sort((a, b) => b - a);
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            گزارش مالی
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            پیگیری درآمد، رزروها و عملکرد مالی
          </motion.p>
        </div>
        <div
          className="flex space-x-3 mt-4 sm:mt-0"
          style={{ direction: "ltr" }}
        >
          <Button variant="outline" onClick={exportFinancialData}>
            <Download className="w-4 h-4 ml-2" />
            CSV خروجی
          </Button>
        </div>
      </motion.div>

      {/* Search and Period Selection */}
      <motion.div variants={item}>
        <Card className={"gap-3"}>
          <CardHeader>
            <p>
              محاسبات بر اساس رزروهای منقضی شده یا در حال اقامت انجام می‌شود.
            </p>
            <p>
              لطفاً توجه داشته باشید که رزروهای با وضعیت "تایید شده" در این
              محاسبات لحاظ نشده‌اند.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="جستجوی اتاق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    سال:
                  </label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(Number(value))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year.toLocaleString("fa-IR", { useGrouping: false })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    ماه:
                  </label>
                  <Select
                    value={selectedMonth?.toString() || "all"}
                    onValueChange={(value) =>
                      setSelectedMonth(value === "all" ? null : Number(value))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه ماه‌ها</SelectItem>
                      {persianMonths.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title:
              selectedMonth !== null
                ? `درآمد ${persianMonths[selectedMonth]}`
                : `درآمد ${selectedYear.toLocaleString("fa-IR", {
                    useGrouping: false,
                  })}`,
            value:
              selectedMonth !== null
                ? currentYearData.find((d) => d.month === selectedMonth)
                    ?.totalRevenue || 0
                : ytdRevenue,
            icon: <DollarSign className="h-4 w-4 text-green-600" />,
            subtitle: `مجموع درآمد ${
              selectedMonth !== null
                ? persianMonths[selectedMonth]
                : selectedYear.toLocaleString("fa-IR", { useGrouping: false })
            } (تومان)`,
            extra: revenueGrowth !== 0 && (
              <p
                className={cn(
                  "text-xs flex items-center",
                  revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {revenueGrowth > 0 ? (
                  <TrendingUp className="w-3 h-3 ml-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 ml-1" />
                )}
                {Math.abs(revenueGrowth).toFixed(1)}% نسبت به سال قبل
              </p>
            ),
            format: (val) => `${val.toLocaleString("fa-IR")}`,
          },
          {
            title: "تعداد رزروها",
            value:
              selectedMonth !== null
                ? currentYearData.find((d) => d.month === selectedMonth)
                    ?.totalReservations || 0
                : ytdReservations,
            icon: <Receipt className="h-4 w-4 text-blue-600" />,
            subtitle: selectedMonth !== null ? "این ماه" : "تاکنون امسال",
            format: (val) => val.toLocaleString("fa-IR"),
          },
          {
            title: "میانگین ارزش رزرو",
            value:
              selectedMonth !== null
                ? currentYearData.find((d) => d.month === selectedMonth)
                    ?.averageBookingValue || 0
                : ytdReservations > 0
                ? ytdRevenue / ytdReservations
                : 0,
            icon: <CreditCard className="h-4 w-4 text-purple-600" />,
            subtitle: "به ازای هر رزرو (تومان)",
            format: (val) => `${val.toLocaleString("fa-IR")}`,
          },
          {
            title: "میانگین درآمد ماهانه",
            value: avgMonthlyRevenue,
            icon: <BarChart3 className="h-4 w-4 text-orange-600" />,
            subtitle: `میانگین ${selectedYear.toLocaleString("fa-IR", {
              useGrouping: false,
            })} (تومان)`,
            format: (val) => `${val.toLocaleString("fa-IR")}`,
          },
        ].map((metric, i) => (
          <motion.div key={i} variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ direction: "ltr" }}
                >
                  {metric.format(metric.value)}
                </div>
                {metric.extra || (
                  <p className="text-xs text-muted-foreground">
                    {metric.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/*       <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>روند درآمد ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={container} className="space-y-4">
              {currentYearData.map((data, index) => {
                const maxRevenue = Math.max(
                  ...currentYearData.map((d) => d.totalRevenue)
                );
                const percentage =
                  maxRevenue > 0 ? (data.totalRevenue / maxRevenue) * 100 : 0;

                return (
                  <motion.div key={index} variants={item} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {data.monthName}
                      </span>
                      <div className="text-left">
                        <span className="text-sm font-bold">
                          {data.totalRevenue.toLocaleString("fa-IR")} تومان
                        </span>
                        <span className="text-xs text-gray-500 mr-2">
                          ({data.totalReservations.toLocaleString("fa-IR")}{" "}
                          رزرو)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="bg-blue-600 h-3 rounded-full"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>میزان اشغال: {data.occupancyRate.toFixed(1)}%</span>
                      <span>
                        میانگین:{" "}
                        {data.averageBookingValue.toLocaleString("fa-IR")}
                        تومان
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div> */}

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>
              درآمد بر اساس اتاق -{" "}
              {selectedMonth !== null
                ? `${
                    persianMonths[selectedMonth]
                  } ${selectedYear.toLocaleString("fa-IR", {
                    useGrouping: false,
                  })}`
                : selectedYear.toLocaleString("fa-IR", { useGrouping: false })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={fadeIn} className="overflow-x-auto">
              <table className="min-w-full ">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">اتاق</th>

                    <th className="text-left py-2">درآمد</th>
                    <th className="text-left py-2">تعداد رزرو</th>
                    <th className="text-left py-2">میانگین هر رزرو</th>
                  </tr>
                </thead>
                <tbody>
                  {roomRevenueData.map((room, index) => (
                    <motion.tr
                      key={room.roomId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium text-right">
                        {room.roomNumber}
                      </td>

                      <td className="py-3 text-left font-semibold">
                        {room.revenue.toLocaleString("fa-IR")}{" "}
                        <span className="text-[10px]">تومان</span>
                      </td>
                      <td className="py-3 text-left">
                        {room.bookings.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-3 text-left">
                        {room.bookings > 0
                          ? (room.revenue / room.bookings).toLocaleString(
                              "fa-IR"
                            )
                          : "۰"}{" "}
                        <span className="text-[10px]">تومان</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {monthlyData.length === 0 && (
        <motion.div variants={item}>
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                داده مالی موجود نیست
              </h3>
              <p className="text-gray-600 mb-4">
                پس از ثبت رزروهای تکمیل شده، داده‌های درآمد در اینجا نمایش داده
                می‌شود.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinancePage;
