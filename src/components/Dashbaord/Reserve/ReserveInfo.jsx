"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import {
  Plus,
  Search,
  CalendarIcon,
  User,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  checkRoomAvailability,
  getJalaliDateDifference,
  persianDate,
  updateEndedReservations,
  updateReservationStatuses,
  validateReservationDates,
} from "@/lib/jalali";
import {
  addNewReserve,
  deleteReservation,
  editReservation,
} from "@/app/actions/reserve";
import { useRouter } from "next/navigation";
import { reserveStatus, roomTypes } from "@/lib/roomsData";
import moment from "moment-jalaali";
import ReserveDialog from "./ReserveDialog";

export default function ReservationsPage({ rooms, reservations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(persianDate);
  const [viewMode, setViewMode] = useState("list");
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const router = useRouter();
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

  const dateDifference = useMemo(() => {
    if (formData.checkIn == formData.checkOut) return 1;
    return getJalaliDateDifference(formData.checkIn, formData.checkOut);
  }, [formData.checkIn, formData.checkOut]);

  const filteredReservations = useMemo(() => {
    const rawData = updateReservationStatuses(reservations);
    let filtered = rawData;

    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.guest_phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (res) => String(res.status).toLowerCase() === statusFilter
      );
    }

    if (roomFilter !== "all") {
      filtered = filtered.filter(
        (res) => String(res.room_id).toLowerCase() === roomFilter
      );
    }

    return filtered;
  }, [rooms, searchTerm, statusFilter, roomFilter]);

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

  const handleCalendarDatePick = (value) => {
    const choosenDate = `${value?.year}/${value?.month.number}/${value?.day}`;
    setSelectedDate(String(choosenDate));
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      roomId: reservation.room_id,
      guestName: reservation.guest_name,
      guestPhone: reservation.guest_phone,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      adults: reservation.adults.toString(),
      notes: reservation.special_requests,
      status: reserveStatus.find(
        (res) => res.value === String(reservation.status).toLowerCase()
      )?.value,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (reservation) => {
    toast(`آیا از حذف رزرواسیون ${reservation.guest_name} اطمینان دارید؟`, {
      action: {
        label: "حذف",
        onClick: async () => {
          toast.promise(
            await deleteReservation(reservation.id, reservation.room_id),
            {
              loading: `در حال حذف رزرواسیون ${reservation.guest_name}...`,
              success: () => {
                router.refresh();
                return `رزرواسیون ${reservation.guest_name} با موفقیت حذف شد`;
              },
              error: "خطا در حذف رزرواسیون",
            }
          );
        },
      },
      cancel: {
        label: "انصراف",
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "outdated":
        return "bg-red-100 text-red-800";
      case "ended":
        return "bg-orange-100 text-orange-800 animate-pulse";
      case "checked_in":
        return "bg-cyan-100 text-cyan-800 animate-pulse";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getReservationsForDate = (jalaliDate) => {
    const targetDate = moment(jalaliDate, "jYYYY/jM/jD");

    return reservations.filter((res) => {
      const checkIn = moment(res.check_in, "jYYYY/jM/jD");
      const checkOut = moment(res.check_out, "jYYYY/jM/jD");

      return targetDate.isSameOrAfter(checkIn) && targetDate.isBefore(checkOut);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">سامانه رزرواسیون</h1>
          <p className="text-gray-600 mt-1">مدیریت رزرواسیون اقامتکاه</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() =>
              setViewMode(viewMode === "list" ? "calendar" : "list")
            }
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {viewMode === "list" ? "نمای تقویم" : "نمای لیست"}
          </Button>
          <ReserveDialog
            rooms={rooms}
            reservations={reservations}
            editingReservation={editingReservation}
            setEditingReservation={setEditingReservation}
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            formData={formData}
            setFormData={setFormData}
            resetForm={resetForm}
            withButton={true}
          />
        </div>
      </div>

      {/* Filters and Search */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {reserveStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="اتاق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اتاق ها</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.room_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={"w-full md:max=w-md"}>
            <CardHeader>
              <CardTitle>تقویم</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                value={selectedDate}
                onChange={handleCalendarDatePick}
                calendar={persian}
                locale={persian_fa}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>رزروهای {String(selectedDate)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getReservationsForDate(selectedDate).map((reservation) => {
                  const room = rooms.find(
                    (r) => String(r.id) === String(reservation.room_id)
                  );
                  return (
                    <div key={reservation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {reservation.guest_name}
                        </h4>
                        <Badge
                          className={getStatusColor(
                            String(reservation.status).toLowerCase()
                          )}
                        >
                          {
                            reserveStatus.find(
                              (res) =>
                                res.value ===
                                String(reservation.status).toLowerCase()
                            )?.label
                          }
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-bold text-deep-ocean text-sm">
                          اتاق {room?.room_number} -{" "}
                          {
                            roomTypes.find(
                              (type) =>
                                room.type == String(type.value).toUpperCase()
                            ).label
                          }
                        </p>
                        <p>
                          <span className="text-lime-600">
                            {reservation.check_in}
                          </span>{" "}
                          -{" "}
                          <span className="text-red-600">
                            {reservation.check_out}
                          </span>
                        </p>
                        <p>{reservation.adults} نفر</p>
                      </div>
                    </div>
                  );
                })}
                {getReservationsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    رزروی برای این تاریخ موجود نیست
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReservations.map((reservation) => {
            const room = rooms.find(
              (r) => String(r.id) === String(reservation.room_id)
            );
            return (
              <Card className={"gap-0"} key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {reservation.guest_name}
                        </h3>
                        <p className="text-gray-600">
                          اتاق {room?.room_number} -{" "}
                          {
                            roomTypes.find(
                              (type) =>
                                room.type == String(type.value).toUpperCase()
                            ).label
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getStatusColor(
                          String(reservation.status).toLowerCase()
                        )}
                      >
                        {
                          reserveStatus.find(
                            (res) =>
                              res.value ===
                              String(reservation.status).toLowerCase()
                          )?.label
                        }
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(reservation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(reservation)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center  gap-4 text-sm">
                    <div className="flex flex-col  items-start justify-center gap-4 enter text-sm w-full">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{reservation.guest_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 w-full">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{reservation.adults} نفر</span>
                      </div>
                    </div>

                    <div className="flex flex-col  items-end justify-center gap-4 enter text-sm w-full">
                      <div>
                        <span className="text-lime-600 ml-1">تاریخ ورود:</span>
                        <span className="font-medium">
                          {reservation.check_in}
                        </span>
                      </div>

                      <div>
                        <span className="text-red-600 ml-1">تاریخ خروج:</span>
                        <span className="font-medium">
                          {reservation.check_out}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="mt-4 pt-4 border-t w-full border-gray-200">
                    <div className="text-right">
                      <span className="text-gray-600">هزینه اقامت: </span>
                      <span className="font-semibold text-lg">
                        {Number(reservation.total_price).toLocaleString(
                          "fa-IR"
                        )}{" "}
                        تومان
                      </span>
                    </div>
                    {reservation.special_requests !== "" && (
                      <div className="mt-4">
                        <span className="text-gray-600">یادداشت: </span>
                        <span className="text-gray-800">
                          {reservation.special_requests}
                        </span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}

          {filteredReservations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  رزروی پیدا نشد
                </h3>
                <p className="text-gray-600 mb-4">
                  {reservations.length === 0
                    ? "اولین رزرو خود را ایجاد کنید"
                    : "پارامترهای جستجوی خود را تغییر دهید"}
                </p>
                {reservations.length === 0 && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className={
                      "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ایجاد رزرو
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
