"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { roomTypes } from "@/lib/roomsData";
import { CalendarDays, Building } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import transition from "react-element-popper/animations/transition";
import { numberToWords } from "@persian-tools/persian-tools";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  checkRoomAvailability,
  convertToEnglishDigits,
  convertToPersianDigits,
  getJalaliDateDifference,
} from "@/lib/jalali";
import { addNewReserve, editReservation } from "@/app/actions/reserve";
import { toast } from "sonner";

export default function ReserveWholeLodgeDialog({
  isWholeLodgeDialogOpen,
  setIsWholeLodgeDialogOpen,
  reservations,
  rooms,
  withButton,
  editingGroup, // New prop for editing group
  setEditingGroup, // New prop to clear editing group
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    notes: "",
    discount: 0,
    addPrice: 0,
    addpriceDesc: "",
    roomPrice: 0,
    priceType: "night", // "night" or "person"
  });

  useEffect(() => {
    if (editingGroup && editingGroup.groupedReservations) {
      const firstReservation = editingGroup.groupedReservations[0];

      setFormData({
        guestName: firstReservation.guest_name,
        guestPhone: firstReservation.guest_phone,
        checkIn: firstReservation.check_in,
        checkOut: firstReservation.check_out,
        adults: editingGroup.total_adults.toString(),
        notes: firstReservation.special_requests,
        discount: firstReservation.discount,
        addPrice: editingGroup.groupedReservations.reduce(
          (sum, r) => sum + (r.addprice || 0),
          0
        ),
        addpriceDesc: firstReservation.addpricedesc,
        roomPrice: firstReservation.roomprice,
        priceType: editingGroup.allpricetype,
      });
    } else if (!isWholeLodgeDialogOpen) {
      resetForm();
    }
  }, [editingGroup, isWholeLodgeDialogOpen]);

  const resetForm = () => {
    setFormData({
      guestName: "",
      guestPhone: "",
      checkIn: "",
      checkOut: "",
      adults: "1",
      notes: "",
      discount: 0,
      addPrice: 0,
      addpriceDesc: "",
      roomPrice: 0,
      priceType: "night",
    });
    setEditingGroup?.(null);
  };

  const handleInputChange = useCallback((e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const { name, value } = e.target;

    if (name == "guestPhone") {
      setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else if (name == "addPrice" || name == "roomPrice") {
      setFormData((prev) => ({ ...prev, [name]: Number(onlyNumbers) }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name == "discount" ? (value > 100 ? 100 : value) : value,
      }));
    }
  }, []);

  const dateDifference = useMemo(() => {
    if (formData.checkIn == formData.checkOut) return 1;
    return getJalaliDateDifference(formData.checkIn, formData.checkOut);
  }, [formData.checkIn, formData.checkOut]);

  const getAvailableRooms = useCallback(() => {
    if (!formData.checkIn || !formData.checkOut) return rooms;

    return rooms.filter((room) => {
      // When editing, exclude rooms that are part of the current group
      const isCurrentGroupRoom = editingGroup?.groupedReservations.some(
        (r) => String(r.room_id) === String(room.id)
      );

      const roomReservations = reservations.filter(
        (reservation) =>
          String(reservation.room_id) === String(room.id) &&
          // Exclude current group reservations when editing
          (!editingGroup ||
            !editingGroup.groupedReservations.some(
              (gr) => gr.id === reservation.id
            ))
      );

      const tempFormData = {
        roomId: room.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      };

      return (
        checkRoomAvailability(tempFormData, roomReservations) ||
        isCurrentGroupRoom
      );
    });
  }, [formData.checkIn, formData.checkOut, reservations, rooms, editingGroup]);

  const availableRooms = useMemo(() => {
    return getAvailableRooms();
  }, [getAvailableRooms]);

  const calculateTotalAmountForRoom = (room, discount) => {
    if (!room || !formData.checkIn || !formData.checkOut || !formData.roomPrice)
      return 0;

    const roomPrice = formData.roomPrice;

    // Calculate persons per room (distribute total persons evenly across available rooms)
    const personsPerRoom = Math.ceil(
      Number(formData.adults) / availableRooms.length
    );

    const nights =
      formData.priceType === "night"
        ? dateDifference
        : personsPerRoom * dateDifference;

    const total =
      nights * roomPrice + formData.addPrice / availableRooms.length;
    const discounedAmount = (total * discount) / 100;
    const discountedTotal = total - discounedAmount;

    return {
      total: total,
      discountedTotal: Math.round(discountedTotal),
      discounedAmount: discounedAmount,
      personsPerRoom: personsPerRoom,
    };
  };

  const totalAmountForAllRooms = useMemo(() => {
    let total = 0;
    let discountedTotal = 0;
    let discounedAmount = 0;

    availableRooms.forEach((room) => {
      const roomTotal = calculateTotalAmountForRoom(room, formData.discount);
      total += roomTotal.total;
      discountedTotal += roomTotal.discountedTotal;
      discounedAmount += roomTotal.discounedAmount;
    });

    return {
      total: total,
      discountedTotal: discountedTotal,
      discounedAmount: discounedAmount,
    };
  }, [
    availableRooms,
    formData.discount,
    formData.addPrice,
    formData.roomPrice,
    formData.priceType,
    dateDifference,
    formData.adults,
  ]);

  const priceTypeLabel = useMemo(() => {
    return formData.priceType === "night" ? "به ازای هر شب" : "به ازای هر نفر";
  }, [formData.priceType]);

  const todayDate = new DateObject({
    calendar: persian,
    locale: persian_fa,
    format: "YYYY/M/D",
  });

  const handleDatePick = (state, value) => {
    const choosenDate = value.format("YYYY/M/D");

    if (state == "in") {
      setFormData((prev) => ({
        ...prev,
        checkIn: String(choosenDate),
        checkOut: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        checkOut: String(choosenDate),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.guestName === "") {
      toast.warning("لطفا نام مهمان را وارد کنید");
      return;
    }
    if (formData.guestPhone === "") {
      toast.warning("لطفا شماره تلفن را وارد کنید");
      return;
    }
    if (formData.checkIn === "") {
      toast.warning("لطفا تاریخ ورود را انتخاب کنید");
      return;
    }
    if (formData.checkOut === "") {
      toast.warning("لطفا تاریخ خروج را انتخاب کنید");
      return;
    }
    if (formData.roomPrice === 0 || formData.roomPrice === "") {
      toast.warning("لطفا مبلغ اتاق را وارد کنید");
      return;
    }

    const phoneRegex = /^(0|\+98|0098)9[0-9]{9}$/;
    if (!phoneRegex.test(formData.guestPhone)) {
      toast.warning("لطفا شماره تلفن معتبر وارد کنید (مثال: 09123456789)");
      return;
    }

    if (availableRooms.length === 0) {
      toast.warning("هیچ اتاقی در تاریخ انتخابی موجود نیست");
      return;
    }

    setIsAdding(true);
    try {
      if (editingGroup) {
        toast.loading(`در حال ویرایش `);

        const editPromises = availableRooms.map(async (room, index) => {
          const roomTotal = calculateTotalAmountForRoom(
            room,
            formData.discount
          );

          const existingReservation = editingGroup.groupedReservations.find(
            (r) => String(r.room_id) === String(room.id)
          );

          const personsForThisRoom =
            index === availableRooms.length - 1
              ? Number(formData.adults) -
                Math.ceil(Number(formData.adults) / availableRooms.length) *
                  (availableRooms.length - 1)
              : Math.ceil(Number(formData.adults) / availableRooms.length);

          const reservationData = {
            roomId: room.id,
            guestName: formData.guestName,
            guestPhone: formData.guestPhone,
            checkIn: convertToEnglishDigits(formData.checkIn),
            checkOut: convertToEnglishDigits(formData.checkOut),
            adults: personsForThisRoom,
            notes: formData.notes,
            status: existingReservation?.status || "CONFIRMED",
            totalAmount: roomTotal.total,
            addPrice: formData.addPrice / availableRooms.length,
            addpricedesc: formData.addpriceDesc,
            discount: formData.discount,
            discounttotal: roomTotal.discountedTotal,
            roomPrice: formData.roomPrice,
            allPriceType: formData.priceType,
          };

          if (existingReservation) {
            // Update existing reservation
            return await editReservation(
              reservationData,
              existingReservation.id
            );
          } else {
            // Create new reservation for newly added room
            return await addNewReserve({
              ...reservationData,
              isAll: true,
            });
          }
        });

        const results = await Promise.all(editPromises);
        const allSuccess = results.every((result) => result.success);

        if (allSuccess) {
          toast.dismiss();
          toast.success(`${availableRooms.length} اتاق با موفقیت ویرایش شد`);
          resetForm();
          setIsWholeLodgeDialogOpen(false);
        } else {
          const errors = results.filter((result) => result.error);
          toast.dismiss();
          toast.error(`خطا در ویرایش ${errors.length} اتاق`);
        }
      } else {
        // Creating new group
        toast.loading(`در حال رزرو کامل`);

        const reservationPromises = availableRooms.map(async (room, index) => {
          const roomTotal = calculateTotalAmountForRoom(
            room,
            formData.discount
          );

          const personsForThisRoom =
            index === availableRooms.length - 1
              ? Number(formData.adults) -
                Math.ceil(Number(formData.adults) / availableRooms.length) *
                  (availableRooms.length - 1)
              : Math.ceil(Number(formData.adults) / availableRooms.length);

          const reservationData = {
            roomId: room.id,
            guestName: formData.guestName,
            guestPhone: formData.guestPhone,
            checkIn: convertToEnglishDigits(formData.checkIn),
            checkOut: convertToEnglishDigits(formData.checkOut),
            adults: personsForThisRoom,
            notes: formData.notes,
            status: "CONFIRMED",
            totalAmount: roomTotal.total,
            addPrice: formData.addPrice / availableRooms.length,
            addpricedesc: formData.addpriceDesc,
            discount: formData.discount,
            discounttotal: roomTotal.discountedTotal,
            roomPrice: formData.roomPrice,
            isAll: true,
            allPriceType: formData.priceType,
          };

          return await addNewReserve(reservationData);
        });

        const results = await Promise.all(reservationPromises);
        const allSuccess = results.every((result) => result.success);

        if (allSuccess) {
          toast.dismiss();
          toast.success(`${availableRooms.length} اتاق با موفقیت رزرو شد`);
          resetForm();
          setIsWholeLodgeDialogOpen(false);
        } else {
          const errors = results.filter((result) => result.error);
          toast.dismiss();
          toast.error(`خطا در رزرو ${errors.length} اتاق`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("خطا در ثبت رزروهای مهمانخانه");
    } finally {
      setIsAdding(false);
    }
  };

  const CustomDateInputEnter = ({ openCalendar, value }) => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          openCalendar();
        }}
        className={`flex justify-between items-center gap-5 border sm:w-40 rounded-sm bg-transparent px-3 py-1 cursor-pointer
        border-deep-ocean focus-visible:border-deep-ocean/50 focus-visible:ring-aqua-spark/50 focus-visible:ring-[1px]`}
      >
        <CalendarDays className="w-4 h-4 " />
        <span className=" text-sm truncate">{value || "انتخاب تاریخ"}</span>
      </div>
    );
  };

  const CustomDateInputExit = ({ openCalendar, value }) => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          openCalendar();
        }}
        className={`flex justify-between items-center gap-5 border sm:w-40 rounded-sm bg-transparent px-3 py-1 cursor-pointer
       ${
         !formData.checkIn && "opacity-50 pointer-events-none"
       } border-deep-ocean focus-visible:border-deep-ocean/50 focus-visible:ring-aqua-spark/50 focus-visible:ring-[1px]`}
      >
        <CalendarDays className="w-4 h-4 " />
        <span className=" text-sm truncate">{value || "انتخاب تاریخ"}</span>
      </div>
    );
  };

  const handleDeleteRoomFromGroup = async (roomId) => {
    if (!editingGroup) return;

    const reservationToDelete = editingGroup.groupedReservations.find(
      (r) => String(r.room_id) === String(roomId)
    );

    if (reservationToDelete) {
      toast.warning(`آیا از حذف اتاق از این رزرو اطمینان دارید؟`, {
        action: {
          label: "حذف",
          onClick: async () => {
            try {
              // You'll need to implement deleteReservation function
              // await deleteReservation(reservationToDelete.id);
              toast.success("اتاق از رزرو حذف شد");
              // Refresh the data or update state
            } catch (error) {
              toast.error("خطا در حذف اتاق");
            }
          },
        },
        cancel: {
          label: "انصراف",
        },
      });
    }
  };

  return (
    <Dialog
      open={isWholeLodgeDialogOpen}
      onOpenChange={(open) => {
        setIsWholeLodgeDialogOpen(open);
        if (!open) {
          resetForm();
        }
      }}
    >
      {withButton && (
        <DialogTrigger asChild>
          <Button
            onClick={resetForm}
            className={"bg-green-600 text-white hover:bg-green-700"}
          >
            <Building className="w-4 h-4" />
            رزرو کامل اقامتگاه
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={"p-3 sm:p-6 sm:max-w-xl max-h-[90dvh] overflow-y-auto"}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader
          className={
            "border-b border-deep-ocean/30 pb-3 justify-center items-center"
          }
        >
          <DialogTitle>
            {editingGroup ? "ویرایش رزرو کامل اقامتگاه" : "رزرو کامل اقامتگاه"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="guestName">نام مسافر</Label>
              <Input
                id="guestName"
                name="guestName"
                placeholder="نام مسافر"
                value={formData.guestName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">تلفن تماس</Label>
              <Input
                id="guestPhone"
                name="guestPhone"
                placeholder="09123456789"
                value={formData.guestPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Price Configuration Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomPrice">مبلغ ({priceTypeLabel})</Label>
              <Input
                id="roomPrice"
                name="roomPrice"
                placeholder="0"
                value={formData.roomPrice}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-600">
                {numberToWords(formData.roomPrice || 0)} تومان
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceType">نوع محاسبه قیمت</Label>
              <Select
                value={formData.priceType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priceType: value }))
                }
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="night">به ازای هر شب</SelectItem>
                  <SelectItem value="person">به ازای هر نفر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adults">تعداد نفرات کل</Label>
            <Input
              id="adults"
              name="adults"
              type="number"
              min="1"
              placeholder="1"
              value={formData.adults}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              تعداد نفرات برای کل اقامتگاه:{" "}
              {Number(formData.adults).toLocaleString("fa-IR")} نفر
            </p>
          </div>

          <div className="flex flex-row justify-center gap-4 items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="checkIn">تاریخ ورود</Label>
              <DatePicker
                minDate={todayDate}
                animations={[transition()]}
                monthYearSeparator="|"
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={formData.checkIn}
                onChange={(e) => handleDatePick("in", e)}
                render={<CustomDateInputEnter />}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="checkOut">تاریخ خروج</Label>
              <DatePicker
                animations={[transition()]}
                monthYearSeparator="|"
                minDate={
                  formData.checkIn
                    ? new DateObject({
                        date: formData.checkIn,
                        calendar: persian,
                        locale: persian_fa,
                      }).add(1, "day")
                    : undefined
                }
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={formData.checkOut}
                onChange={(e) => handleDatePick("out", e)}
                render={<CustomDateInputExit />}
                disabled={!formData.checkIn}
              />
            </div>
          </div>

          {/* Available Rooms Info */}
          {formData.checkIn && formData.checkOut && (
            <div className="p-4 border border-deep-ocean/20 bg-blue-50 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-deep-ocean">
                اتاق های موجود برای رزرو: {availableRooms.length} از{" "}
                {rooms.length} اتاق
              </p>
              {availableRooms.length > 0 && (
                <div className="text-xs text-deep-ocean space-y-1">
                  <p>لیست اتاق های قابل رزرو:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {availableRooms.map((room) => {
                      const roomType = roomTypes.find(
                        (type) => room.type === String(type.value).toUpperCase()
                      );
                      return (
                        <span
                          key={room.id}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                        >
                          {room.room_number} ({roomType?.label})
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {availableRooms.length < rooms.length && (
                <p className="text-xs text-orange-600">
                  {rooms.length - availableRooms.length} اتاق در تاریخ انتخابی
                  رزرو شده است
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="discount"> تخفیف کل % </Label>
            <div className="flex gap-1">
              <Input
                id="discount"
                name="discount"
                placeholder="10"
                type={"number"}
                min={0}
                max={100}
                value={formData.discount}
                onChange={handleInputChange}
              />
              <div className="flex justify-center items-center gap-1">
                {[0, 20, 30, 50].map((num) => (
                  <Button
                    key={num}
                    size={"sm"}
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({
                        ...prev,
                        ["discount"]: num,
                      }));
                    }}
                  >
                    % {convertToPersianDigits(num.toString())}
                  </Button>
                ))}
              </div>
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

          <div className="space-y-2">
            <Label htmlFor="addPrice">
              مبلغ اضافه کل ({numberToWords(formData.addPrice || 0)} تومان)
            </Label>
            <Input
              id="addPrice"
              name="addPrice"
              placeholder="0"
              type={"number"}
              min={0}
              value={formData.addPrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addpriceDesc">توضیحات مبلغ اضافه</Label>
            <Textarea
              id="addpriceDesc"
              value={formData.addpriceDesc}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addpriceDesc: e.target.value,
                }))
              }
              rows={2}
              placeholder=" بابت ناهار یا شام "
            />
          </div>

          {formData.checkIn &&
            formData.checkOut &&
            availableRooms.length > 0 &&
            formData.roomPrice > 0 && (
              <div className="p-4 border border-deep-ocean/20 bg-pearl-luster/50 rounded-lg space-y-1">
                <p className="text-sm text-deep-ocean">
                  <strong>
                    تعداد اتاق ها:{" "}
                    {availableRooms.length.toLocaleString("fa-IR")} اتاق
                  </strong>
                </p>
                <p className="text-sm text-deep-ocean">
                  <strong>
                    مدت اقامت: {Number(dateDifference).toLocaleString("fa-IR")}{" "}
                    شب
                  </strong>
                </p>
                <p className="text-sm text-deep-ocean">
                  <strong>
                    تعداد نفرات کل:{" "}
                    {Number(formData.adults).toLocaleString("fa-IR")} نفر
                  </strong>
                </p>
                <p className="text-sm text-deep-ocean">
                  <strong>نوع محاسبه: {priceTypeLabel}</strong>
                </p>
                <p className="text-sm text-deep-ocean">
                  <strong>
                    مبلغ پایه:{" "}
                    {Number(formData.roomPrice).toLocaleString("fa-IR")} تومان
                  </strong>
                </p>
                {formData.discount > 0 && (
                  <p className="text-sm text-deep-ocean">
                    <strong>
                      تخفیف کل: %{" "}
                      {Number(formData.discount).toLocaleString("fa-IR")}{" "}
                      <span className="font-medium">
                        (
                        {Number(
                          totalAmountForAllRooms.discounedAmount
                        ).toLocaleString("fa-IR")}{" "}
                        تومان)
                      </span>
                    </strong>
                  </p>
                )}
                {formData.addPrice > 0 && (
                  <p className="text-sm text-deep-ocean">
                    <strong>
                      مبلغ اضافه کل:{" "}
                      <span className="font-medium">
                        {Number(formData.addPrice).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </strong>
                  </p>
                )}
                <p className="text-base text-deep-ocean font-bold">
                  <strong>
                    مبلغ کل نهایی:{" "}
                    {Number(
                      totalAmountForAllRooms.discountedTotal
                    ).toLocaleString("fa-IR")}{" "}
                    تومان
                  </strong>
                </p>
              </div>
            )}
          <DialogFooter className={"sm:flex-col"}>
            <Button
              type="submit"
              disabled={
                isAdding ||
                availableRooms.length === 0 ||
                formData.roomPrice === 0
              }
              className={
                "disabled:opacity-50 disabled:pointer-events-none w-full bg-green-600 hover:bg-green-700"
              }
            >
              {isAdding
                ? `در حال ${editingGroup ? "ویرایش" : "رزرو"} کامل`
                : `${editingGroup ? "ویرایش" : "رزرو"} کامل `}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setIsWholeLodgeDialogOpen(false);
                resetForm();
              }}
              className="w-full"
            >
              لغو
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
