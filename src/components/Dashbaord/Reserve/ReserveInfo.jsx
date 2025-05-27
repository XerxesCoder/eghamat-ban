"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import transition from "react-element-popper/animations/transition";
import {
  Plus,
  Search,
  CalendarIcon,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import InputIcon from "react-multi-date-picker/components/input_icon";
import { getJalaliDateDifference, persianDate } from "@/lib/jalali";
import {
  addNewReserve,
  deleteReservation,
  editReservation,
} from "@/app/actions/reserve";
import { useRouter } from "next/navigation";
import { reserveStatus, roomTypes } from "@/lib/roomsData";
import moment from "moment-jalaali";

export default function ReservationsPage({ rooms, reservations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const getTwoDateDiffrence = (date1, date2) => {
    if (date1 == date2) return 1;
    return getJalaliDateDifference(date1, date2);
  };

  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.guestPhone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (res) => String(res.status).toLowerCase() === statusFilter
      );
    }

    return filtered;
  }, [rooms, searchTerm, statusFilter]);

  const checkRooms = useMemo(() => {
    const today = String(persianDate);
    let filtered = rooms.map((room) => {
      const exitDate = String(room.exit_date);

      if (exitDate !== String(null)) {
        if (exitDate === today) {
          room.status = "EVACUATE";
        } else {
          room.status = "OCCUPIED";
        }
      } else {
        room.status = "AVAILABLE";
      }

      return room;
    });

    return filtered;
  }, [rooms]);

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

  const calculateTotalAmount = (roomId, checkIn, checkOut, adults) => {
    const room = rooms.find((r) => String(r.id) === String(roomId));
    if (!room || !checkIn || !checkOut) return 0;
    const roomPrice =
      room.price_tag == "night" ? room.price_per_night : room.price_per_person;
    const nights =
      room.price_tag == "night"
        ? dateDifference
        : Number(adults) * dateDifference;

    return nights * roomPrice;
  };

  const handleDatePick = (state, value) => {
    const choosenDate = `${value?.year}/${value?.month.number}/${value?.day}`;
    if (state == "in") {
      setFormData((prev) => ({
        ...prev,
        checkIn: String(choosenDate),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        checkOut: String(choosenDate),
      }));
    }
  };

  const handleCalendarDatePick = (value) => {
    const choosenDate = `${value?.year}/${value?.month.number}/${value?.day}`;
    setSelectedDate(String(choosenDate));
  };

  const validateReservationDates = () => {
    const currentDate = moment(persianDate, "jYYYY-jMM-jDD");
    const checkInDate = moment(formData.checkIn, "jYYYY-jMM-jDD");
    const checkOutDate = moment(formData.checkOut, "jYYYY-jMM-jDD");

    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      toast.warning("فرمت تاریخ وارد شده نامعتبر است");
      return false;
    }

    // Calculate differences
    const daysUntilCheckIn = checkInDate.diff(currentDate, "days");
    const daysUntilCheckOut = checkOutDate.diff(currentDate, "days");
    const reservationDuration = checkOutDate.diff(checkInDate, "days");

    console.log(
      "Reservation duration:",
      reservationDuration,
      "Days until checkout:",
      daysUntilCheckOut
    );

    if (daysUntilCheckIn < 0) {
      toast.warning("تاریخ ورود نباید قبل از تاریخ امروز باشد");
      return false;
    }
    if (reservationDuration <= 0) {
      toast.warning("تاریخ خروج باید بعد از تاریخ ورود باشد");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddingOrEditing(true);
    if (formData.roomId === "") {
      toast.error("لطفا یک اتاق انتخاب کنید");
      return;
    }
    if (formData.checkIn === "") {
      toast.error("لطفا تاریخ ورود را انتخاب کنید");
      return;
    }
    if (formData.checkOut === "") {
      toast.error("لطفا تاریخ خروج را انتخاب کنید");
      return;
    }

    if (!validateReservationDates()) {
      return;
    }

    try {
      const totalAmount = calculateTotalAmount(
        formData.roomId,
        formData.checkIn,
        formData.checkOut,
        formData.adults
      );

      const reservationData = {
        roomId: formData.roomId,
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: Number.parseInt(formData.adults),
        notes: formData.notes,
        status: formData.status,
        totalAmount,
      };

      if (editingReservation) {
        toast.loading("درحال ویرایش اطلاعات");
        const editReserve = await editReservation(
          reservationData,
          editingReservation.id
        );
        if (editReserve.success) {
          toast.dismiss();
          toast.success("با موفقیت ویرایش شد");
          setEditingReservation(null);
          resetForm();
          router.refresh();
        }
      } else {
        toast.loading("درحال افزودن اطلاعات");
        const addReserve = await addNewReserve(reservationData);
        if (addReserve.success) {
          toast.dismiss();
          toast.success("با موفقیت افزوده شد");
          setEditingReservation(null);
          resetForm();
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("خطا در ثبت اطلاعات ");
    } finally {
      setIsAddDialogOpen(false);
      setIsAddingOrEditing(false);
    }
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

  const handleDelete = async (reservation, roomId) => {
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

  const handleStatusChange = (reservation, newStatus) => {
    try {
      StorageManager.updateReservation(reservation.id, { status: newStatus });

      // Update room status based on reservation status
      if (newStatus === "checked-in") {
        StorageManager.updateRoom(reservation.roomId, { status: "occupied" });
      } else if (newStatus === "checked-out") {
        StorageManager.updateRoom(reservation.roomId, { status: "cleaning" });
      }

      toast({
        title: "Status updated",
        description: `Reservation status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingReservation(null);
                }}
                className={
                  "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"
                }
              >
                <Plus className="w-4 h-4 " />
                رزرو جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingReservation ? "ویرایش رزرو" : "رزرو جدید"}
                </DialogTitle>
                <DialogDescription>
                  {editingReservation
                    ? "ویرایش اطلاعات رزرو"
                    : "ایجاد رزرو جدید"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">نام مسافر</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          guestName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">تلفن تماس</Label>
                    <Input
                      id="guestPhone"
                      value={formData.guestPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          guestPhone: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId">اتاق</Label>
                    <Select
                      value={formData.roomId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, roomId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب اتاق" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            اتاق {room.room_number} -{" "}
                            {
                              roomTypes.find(
                                (type) =>
                                  room.type == String(type.value).toUpperCase()
                              ).label
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults">نفرات</Label>
                      <Select
                        value={formData.adults}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, adults: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            {
                              length: formData.roomId
                                ? rooms.find(
                                    (room) =>
                                      String(room.id) == String(formData.roomId)
                                  ).capacity
                                : 6,
                            },
                            (_, i) => i + 1
                          ).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">تاریخ ورود</Label>
                    <DatePicker
                      animations={[transition()]}
                      monthYearSeparator="|"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={formData.checkIn}
                      onChange={(e) => handleDatePick("in", e)}
                      render={<InputIcon />}
                      inputClass={
                        "border-deep-ocean border w-32 rounded-sm bg-transparent px-3 py-1  focus-visible:border-deep-ocean/50 focus-visible:ring-aqua-spark/50 focus-visible:ring-[1px]"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">تاریخ خروج</Label>

                    <DatePicker
                      animations={[transition()]}
                      monthYearSeparator="|"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={formData.checkOut}
                      onChange={(e) => handleDatePick("out", e)}
                      render={<InputIcon />}
                      inputClass={
                        "border-deep-ocean border w-32 rounded-sm bg-transparent px-3 py-1  focus-visible:border-deep-ocean/50 focus-visible:ring-aqua-spark/50 focus-visible:ring-[1px]"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">یادداشت</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="درخواست مسافر یا توضیحات دیگر"
                  />
                </div>

                {formData.roomId &&
                  formData.checkIn &&
                  formData.checkOut &&
                  formData.adults && (
                    <div className="p-4 bg-blue-100 rounded-lg space-y-1">
                      <p className="text-sm text-deep-ocean">
                        <strong>
                          {" "}
                          هزینه اقامت هر{" "}
                          {rooms.find((r) => String(r.id) == formData.roomId)
                            .price_tag == "night"
                            ? "شب"
                            : "نفر"}
                          :{" "}
                          {rooms.find((r) => String(r.id) === formData.roomId)
                            ?.price_tag === "night"
                            ? Number(
                                rooms.find(
                                  (r) => String(r.id) === formData.roomId
                                )?.price_per_night
                              ).toLocaleString("fa-IR")
                            : Number(
                                rooms.find(
                                  (r) => String(r.id) === formData.roomId
                                )?.price_per_person
                              ).toLocaleString("fa-IR")}
                          تومان
                        </strong>
                      </p>
                      <p className="text-sm text-deep-ocean">
                        <strong>مدت اقامت: {dateDifference} شب</strong>
                      </p>
                      <p className="text-sm text-deep-ocean">
                        <strong>تعداد نفرات: {formData.adults} نفر</strong>
                      </p>
                      <p className="text-base text-deep-ocean font-bold">
                        <strong>
                          مبلغ کل:
                          {Number(
                            calculateTotalAmount(
                              formData.roomId,
                              formData.checkIn,
                              formData.checkOut,
                              formData.adults
                            )
                          ).toLocaleString("fa-IR")}{" "}
                          تومان
                        </strong>
                      </p>
                    </div>
                  )}
                {editingReservation && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setIsAddDialogOpen(false);

                      handleDelete(editingReservation);
                    }}
                  >
                    کنسلی
                  </Button>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    لغو
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAddingOrEditing}
                    className={
                      "disabled:opacity-50 disabled:pointer-events-none"
                    }
                  >
                    {editingReservation ? "ویرایش" : "ایجاد"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                          {reservation.check_in} - {reservation.check_out}
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
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const room = rooms.find(
              (r) => String(r.id) === String(reservation.room_id)
            );
            return (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
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
                        {reservation.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(reservation, "checked-in")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}
                        {reservation.status === "checked-in" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(reservation, "checked-out")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Check Out
                          </Button>
                        )}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{reservation.guest_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{reservation.adults} نفر</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600">هزینه اقامت: </span>
                      <span className="font-semibold text-lg">
                        {Number(reservation.total_price).toLocaleString(
                          "fa-IR"
                        )}{" "}
                        تومان
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-start gap-6 enter text-sm">
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
                    {reservation.special_requests && (
                      <div className="mt-4">
                        <span className="text-gray-600">یادداشت: </span>
                        <span className="text-gray-800">
                          {reservation.special_requests}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
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
