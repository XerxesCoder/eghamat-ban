"use client";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Download,
  ChevronsLeft,
  ChevronsRight,
  CircleDot,
  CircleDashed,
  BanIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import moment from "moment-jalaali";
import { roomTypes } from "@/lib/roomsData";
import ReserveDialog from "../Reserve/ReserveDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLodgeData } from "../DashbaordProvider";
import { convertToPersianDigits } from "@/lib/jalali";
export default function OccupancyPage() {
  const { rooms, reservations } = useLodgeData();
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

  /*   const exportToCSV = () => {
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
  }; */

  const exportToCSV = () => {
    const calendarDays = generateCalendarDays();
    const monthDays = calendarDays.filter(
      (day) => day.jMonth() === selectedDate.jMonth()
    );

    let csv = "اتاق,نوع,تاریخ,";
    monthDays.forEach((day) => {
      csv += `${day.jDate()},`;
    });
    csv += "\n";

    filteredRooms.forEach((room) => {
      const jalaliMonthYear = `${
        months[selectedDate.jMonth()]
      } - ${selectedDate.jYear()}`;

      csv += `${room.room_number},${
        roomTypes.find((type) => type.value === String(room.type).toLowerCase())
          ?.label
      },${jalaliMonthYear},`;

      monthDays.forEach((day) => {
        const status = getRoomStatusForDate(room, day);
        csv += `${status.isOccupied ? "X" : "خالی"},`;
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
      description: "تقویم به صورت CSV دانلود شد.",
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

  const weekDays = ["ی", "د", "س", "چ", "پ", "ج", "ش"];
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
    <motion.div initial="hidden" animate="visible" variants={container}>
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
        <motion.div variants={item}>
          {" "}
          <Card className={'p-0'}>
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 md:text-3xl"
                  >
                    تقویم سکونت
                  </motion.h1>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-600 mt-1 md:text-base"
                  >
                    جدول سکونت در تمام اتاق ها در یک نمای ماهانه
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
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
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="col-span-2"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex justify-between items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => navigateYear("prev")}
                          >
                            <ChevronsRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>سال قبل</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => navigateMonth("prev")}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ماه قبل</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <h3 className="text-center font-bold text-deep-ocean">
                      {months[selectedDate.jMonth()]}{" "}
                      {selectedDate
                        .jYear()
                        .toLocaleString("fa-IR", { useGrouping: false })}
                    </h3>
                    <div className="flex justify-between items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => navigateMonth("next")}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ماه بعد</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => navigateYear("next")}
                          >
                            <ChevronsLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>سال بعد</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">نرخ اشغال:</span>
                      <span className="font-medium">
                        {Number(occupancyRate).toLocaleString("fa-IR", {
                          useGrouping: false,
                        })}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">تعداد اتاق:</span>
                      <span className="font-medium">
                        {Number(filteredRooms.length).toLocaleString("fa-IR", {
                          useGrouping: false,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">روزهای ماه:</span>
                      <span className="font-medium">
                        {Number(monthDays.length).toLocaleString("fa-IR", {
                          useGrouping: false,
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                >
                  <motion.h3
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl font-bold text-green-600"
                  >
                    {Number(monthDays.length).toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </motion.h3>
                  <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-gray-600 text-center"
                  >
                    روزهای ماه
                  </motion.p>
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                >
                  <h3 className="text-2xl font-bold text-blue-600">
                    {Number(occupiedRoomDays).toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    روز اشغال شده
                  </p>
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                >
                  <h3 className="text-2xl font-bold text-amber-600">
                    {Number(totalRoomDays - occupiedRoomDays).toLocaleString(
                      "fa-IR",
                      {
                        useGrouping: false,
                      }
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">روز خالی</p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <h1 className="sticky right-5  w-fit text-center  text-lg sm:text-xl text-deep-ocean font-bold mb-2">
                  {months[selectedDate.jMonth()]}{" "}
                  {selectedDate
                    .jYear()
                    .toLocaleString("fa-IR", { useGrouping: false })}
                </h1>
                <div className="inline-block min-w-full align-middle px-4">
                  <table className="min-w-full" ref={tableRef}>
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
                                {day.jDate().toLocaleString("fa-IR", {
                                  useGrouping: false,
                                })}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y  divide-sky-glint ">
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => (
                          <tr key={room.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <td className="sticky right-0 z-10 bg-white px-3 py-2 border-l border-gray-200 h-12">
                                  <div className="text-right">
                                    <h4 className="font-medium text-deep-ocean text-sm">
                                      {room.room_number}{" "}
                                    </h4>
                                  </div>
                                </td>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {
                                    roomTypes.find(
                                      (type) =>
                                        type.value ==
                                        String(room.type).toLowerCase()
                                    )?.label
                                  }
                                </p>
                              </TooltipContent>
                            </Tooltip>

                            {monthDays.map((day, dayIndex) => {
                              const dayStatus = getRoomStatusForDate(room, day);

                              const todayDate = moment();
                              const isDisabled =
                                day.jYear() < todayDate.jYear() ||
                                (day.jYear() === todayDate.jYear() &&
                                  (day.jMonth() < todayDate.jMonth() ||
                                    (day.jMonth() === todayDate.jMonth() &&
                                      day.jDate() < todayDate.jDate())));

                              return isDisabled ? (
                                <td
                                  key={dayIndex}
                                  className={cn(
                                    "p-1 text-center opacity-50  border transition-colors ease-in-out rounded-sm border-gray-100 relative"
                                  )}
                                >
                                  <BanIcon className="text-center w-4 h-4 mx-auto" />
                                </td>
                              ) : (
                                <TooltipProvider key={dayIndex}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <td
                                        className={cn(
                                          "p-1 cursor-pointer text-center items-center hover:bg-pearl-luster rounded-xs  transition-colors ease-in-out border border-gray-100 relative",
                                          dayStatus.isToday &&
                                            "ring-1 ring-deep-ocean  ring-inset",
                                          dayStatus.isOccupied
                                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                                            : "bg-green-100 text-green-800 hover:bg-green-200"
                                        )}
                                        onClick={() => {
                                          toast.dismiss();

                                          if (dayStatus.isOccupied) {
                                            toast.warning(
                                              `اتاق ${room.room_number} در این تاریخ رزرو شده است`,
                                              {
                                                description: `مهمان: ${
                                                  dayStatus.reservation
                                                    ?.guest_name || "نامشخص"
                                                } - خروج: ${convertToPersianDigits(
                                                  dayStatus.reservation
                                                    ?.check_out
                                                )}`,
                                              }
                                            );
                                          } else {
                                            toast(
                                              `اتاق ${room.room_number} در این تاریخ خالی است`,
                                              {
                                                action: {
                                                  label: "رزرو",
                                                  onClick: () => {
                                                    console.log(
                                                      day.format(
                                                        "jYYYY/jMM/jDD"
                                                      )
                                                    );
                                                    setFormData((prev) => ({
                                                      ...prev,
                                                      roomId: room.id,
                                                      checkIn: String(
                                                        day.format(
                                                          "jYYYY/jMM/jDD"
                                                        )
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
                                        {dayStatus.isOccupied ? (
                                          <CircleDot className="text-center sm:w-5 sm:h-5 w-4 h-4 mx-auto" />
                                        ) : (
                                          <CircleDashed className="text-center sm:w-5 sm:h-5 w-4 h-4 mx-auto" />
                                        )}
                                      </td>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {dayStatus.isOccupied ? (
                                        <>
                                          <p>
                                            {dayStatus.isOccupied &&
                                              ` اتاق ${room.room_number} در این تاریخ رزرو شده است`}
                                          </p>
                                          <p>
                                            {dayStatus.isOccupied &&
                                              `مهمان: ${
                                                dayStatus.reservation
                                                  ?.guest_name || "نامشخص"
                                              } - خروج: ${convertToPersianDigits(
                                                dayStatus.reservation?.check_out
                                              )}`}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p>
                                            {`اتاق ${room.room_number} در این تاریخ خالی است.`}
                                          </p>
                                          <p>برای رزرو کلیک کنید</p>
                                        </>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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
        </motion.div>

        {filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room, index) => {
              const occupiedDays = monthDays.filter(
                (day) => getRoomStatusForDate(room, day).isOccupied
              ).length;
              const roomOccupancyRate =
                monthDays.length > 0
                  ? Math.round((occupiedDays / monthDays.length) * 100)
                  : 0;

              return (
                <motion.div
                  key={room.id}
                  variants={item}
                  custom={index}
                  whileHover={{ y: -5 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">
                            اتاق {room.room_number}
                          </h4>
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
                          {Number(roomOccupancyRate).toLocaleString("fa-IR", {
                            useGrouping: false,
                          })}
                          %
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span>اشغال شده:</span>
                          <span className="font-medium">
                            {Number(occupiedDays).toLocaleString("fa-IR", {
                              useGrouping: false,
                            })}{" "}
                            روز
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>خالی:</span>
                          <span className="font-medium">
                            {Number(
                              monthDays.length - occupiedDays
                            ).toLocaleString("fa-IR", {
                              useGrouping: false,
                            })}{" "}
                            روز
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
