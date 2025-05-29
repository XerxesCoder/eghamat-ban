"use client";

import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Printer,
  ChevronLeftCircle,
  ChevronRightIcon,
  ChevronRightCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import moment from "moment-jalaali";
import { roomTypes } from "@/lib/roomsData";
import ReserveDialog from "../Reserve/ReserveDialog";

export default function OccupancyPage({ rooms, reservations }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedRoomName, setSelectedRoomName] = useState("all");
  const tableRef = useRef(null);

  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    notes: "",
    status: "pending",
  });

  const resetForm = () => {
    setFormData({
      roomId: "",
      guestName: "",
      guestPhone: "",
      checkIn: "",
      checkOut: "",
      adults: "1",
      notes: "",
      status: "pending",
    });
  };
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const typeMatch =
        selectedRoomType === "all" ||
        String(room.type).toLowerCase() === selectedRoomType;

      const nameMatch =
        selectedRoomName === "all" ||
        room.room_number.includes(selectedRoomName);

      return typeMatch && nameMatch;
    });
  }, [rooms, selectedRoomType, selectedRoomName]);

  const generateCalendarDays = () => {
    const startOfMonth = selectedDate.clone().startOf("jMonth");
    const endOfMonth = selectedDate.clone().endOf("jMonth");
    const startDate = startOfMonth.clone().startOf("week");
    const endDate = endOfMonth.clone().endOf("week");

    const days = [];
    const currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      days.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    return days;
  };

  const getRoomStatusForDate = (room, date) => {
    const today = moment().startOf("day");
    const checkDate = date.clone().startOf("day");

    const reservation = reservations.find((res) => {
      if (res.room_id !== room.id) return false;
      if (res.status === "cancelled") return false;

      const checkIn = moment(res.check_in, "jYYYY/jMM/jDD").startOf("day");
      const checkOut = moment(res.check_out, "jYYYY/jMM/jDD").startOf("day");

      return checkDate.isSameOrAfter(checkIn) && checkDate.isBefore(checkOut);
    });

    return {
      date: checkDate,
      isOccupied: !!reservation,
      reservation,
      isToday: checkDate.isSame(today),
      dayNumber: moment().format("jD"),
      yearNumber: moment().format("jYYYY"),
      isCurrentMonth: checkDate.jMonth() === selectedDate.jMonth(),
    };
  };

  const navigateMonth = (direction) => {
    const newDate = selectedDate.clone();
    if (direction === "prev") {
      newDate.subtract(1, "jMonth");
    } else {
      newDate.add(1, "jMonth");
    }
    setSelectedDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = selectedDate.clone();
    if (direction === "prev") {
      newDate.subtract(1, "jYear");
    } else {
      newDate.add(1, "jYear");
    }
    setSelectedDate(newDate);
  };

  const exportToCSV = () => {
    const calendarDays = generateCalendarDays();
    const monthDays = calendarDays.filter(
      (day) => day.jMonth() === selectedDate.jMonth()
    );

    let csv = "اتاق,نوع,";
    monthDays.forEach((day) => {
      csv += `${day.jDate()},`;
    });
    csv += "\n";

    filteredRooms.forEach((room) => {
      csv += `${room.room_number},${
        roomTypes.find((type) => type.value == String(room.type).toLowerCase())
          ?.label
      },`;
      monthDays.forEach((day) => {
        const status = getRoomStatusForDate(room, day);
        csv += `${status.isOccupied ? "پر" : "خالی"},`;
      });
      csv += "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `occupancy-${selectedDate.jYear()}-${
      selectedDate.jMonth() + 1
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("با موفقیت صادر شد.", {
      description: "تقویم  به صورت CSV دانلود شد.",
    });
  };

  const calendarDays = generateCalendarDays();
  const monthDays = calendarDays.filter(
    (day) => day.jMonth() === selectedDate.jMonth()
  );

  const totalRoomDays = filteredRooms.length * monthDays.length;
  const occupiedRoomDays = filteredRooms.reduce((total, room) => {
    return (
      total +
      monthDays.filter((day) => getRoomStatusForDate(room, day).isOccupied)
        .length
    );
  }, 0);
  const occupancyRate =
    totalRoomDays > 0
      ? Math.round((occupiedRoomDays / totalRoomDays) * 100)
      : 0;

  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const months = [
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

  return (
    <div>
      <ReserveDialog
        rooms={rooms}
        reservations={reservations}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        resetForm={resetForm}
        withButton={false}
      />
      <div className="space-y-4">
        <Card>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  تقویم سکونت
                </h1>
                <p className="text-sm text-gray-600 mt-1 md:text-base">
                  جدول سکونت در تمام اتاق ها در یک نمای ماهانه
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={exportToCSV}
                >
                  <Download className="w-4 h-4 ml-1" />
                  <span className="hidden sm:inline">خروجی CSV</span>
                </Button>

                <Select
                  value={selectedRoomType}
                  onValueChange={setSelectedRoomType}
                >
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="نوع اتاق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">نوع اتاق</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedRoomName}
                  onValueChange={setSelectedRoomName}
                >
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder=" اتاق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اتاق ها</SelectItem>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.room_number}>
                        {room.room_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex justify-between items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => navigateYear("prev")}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="text-center font-bold text-deep-ocean">
                    {months[selectedDate.jMonth()]} {selectedDate.jYear()}
                  </h3>
                  <div className="flex justify-between items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => navigateYear("next")}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">نرخ اشغال:</span>
                    <span className="font-medium">{occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد اتاق:</span>
                    <span className="font-medium">{filteredRooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">روزهای ماه:</span>
                    <span className="font-medium">{monthDays.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-green-600">
                  {monthDays.length}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  روزهای ماه
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">
                  {occupiedRoomDays}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  روز اشغال شده
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-amber-600">
                  {totalRoomDays - occupiedRoomDays}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  روز خالی
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendar Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <h1 className="sticky right-5  w-fit text-center  text-lg sm:text-xl text-deep-ocean font-bold mb-2">
                {months[selectedDate.jMonth()]} {selectedDate.jYear()}
              </h1>
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse" ref={tableRef}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="sticky right-0 z-10 bg-gray-50 px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 w-26">
                        <span className="inline"> اتاق</span>
                      </th>
                      {monthDays.map((day, index) => (
                        <th
                          key={index}
                          className="px-1 py-2 text-center text-xs font-medium text-gray-900 uppercase tracking-wider border-l border-gray-200 w-8 sm:w-10 bg-gray-50"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">
                              {weekDays[day.day()]}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-900">
                              {day.jDate()}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="sticky right-0 z-10 bg-white px-3 py-2 border-l border-gray-200">
                            <div className="text-right">
                              <div className="font-medium text-deep-ocean text-sm">
                                {room.room_number}
                              </div>
                              <div className="text-xs text-gray-500">
                                {
                                  roomTypes.find(
                                    (type) =>
                                      type.value ==
                                      String(room.type).toLowerCase()
                                  )?.label
                                }
                              </div>
                            </div>
                          </td>
                          {monthDays.map((day, dayIndex) => {
                            const dayStatus = getRoomStatusForDate(room, day);

                            return (
                              <td
                                key={dayIndex}
                                className={cn(
                                  "px-0.5 py-1 text-center border border-gray-100 relative",
                                  dayStatus.isToday &&
                                    "ring-1 ring-deep-ocean rounded-sm ring-inset"
                                )}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "w-6 h-6  mx-auto p-0 rounded-full flex items-center justify-center text-xs",
                                    dayStatus.isOccupied
                                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                                      : "bg-green-100 text-green-800 hover:bg-green-200"
                                  )}
                                  disabled={
                                    day.jMonth() === moment().jMonth() &&
                                    day.jYear() === moment().jYear() &&
                                    day.jDate() < moment().jDate()
                                  }
                                  onClick={() => {
                                    toast.dismiss();

                                    if (dayStatus.isOccupied) {
                                      toast.warning(
                                        `اتاق ${room.room_number} در این تاریخ رزرو شده است`,
                                        {
                                          description: `مهمان: ${
                                            dayStatus.reservation?.guest_name ||
                                            "نامشخص"
                                          } - خروج: ${
                                            dayStatus.reservation?.check_out
                                          }`,
                                        }
                                      );
                                    } else {
                                      toast(
                                        `اتاق ${room.room_number} در این تاریخ خالی است`,
                                        {
                                          action: {
                                            label: "رزرو",
                                            onClick: () => {
                                              setFormData((prev) => ({
                                                ...prev,
                                                roomId: room.id,
                                                checkIn: String(
                                                  day.format("jYYYY-jMM-jDD")
                                                ),
                                              }));

                                              setIsAddDialogOpen(true);
                                            },
                                          },
                                        }
                                      );
                                    }
                                  }}
                                >
                                  {dayStatus.isOccupied ? "●" : "○"}
                                </Button>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={monthDays.length + 1}
                          className="py-8 text-center text-gray-500 text-sm"
                        >
                          هیچ اتاقی با فیلترهای انتخاب شده یافت نشد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Summary - Grid View */}
        {filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => {
              const occupiedDays = monthDays.filter(
                (day) => getRoomStatusForDate(room, day).isOccupied
              ).length;
              const roomOccupancyRate =
                monthDays.length > 0
                  ? Math.round((occupiedDays / monthDays.length) * 100)
                  : 0;

              return (
                <Card
                  key={room.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">اتاق {room.room_number}</h4>
                        <p className="text-xs text-gray-500">
                          {
                            roomTypes.find(
                              (type) =>
                                type.value == String(room.type).toLowerCase()
                            )?.label
                          }
                        </p>
                      </div>
                      <Badge
                        variant={
                          roomOccupancyRate > 70 ? "destructive" : "default"
                        }
                        className="text-xs"
                      >
                        {roomOccupancyRate}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span>اشغال شده:</span>
                        <span className="font-medium">{occupiedDays} روز</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>خالی:</span>
                        <span className="font-medium">
                          {monthDays.length - occupiedDays} روز
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            roomOccupancyRate > 70
                              ? "bg-red-500"
                              : roomOccupancyRate > 30
                              ? "bg-amber-500"
                              : "bg-green-500"
                          )}
                          style={{ width: `${roomOccupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
