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
import { CalendarDays, Plus } from "lucide-react";
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
import {
  addNewReserve,
  deleteReservation,
  editReservation,
} from "@/app/actions/reserve";
import { toast } from "sonner";

export default function ReserveDialog({
  setEditingReservation,
  editingReservation,
  isAddDialogOpen,
  setIsAddDialogOpen,
  formData,
  setFormData,
  resetForm,
  reservations,
  rooms,
  withButton,
}) {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);

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

  const calculateTotalAmount = (
    roomId,
    checkIn,
    checkOut,
    adults,
    discount
  ) => {
    const room = rooms.find((r) => String(r.id) === String(roomId));
    if (!room || !checkIn || !checkOut) return 0;
    const roomPrice = formData.roomPrice;

    const nights =
      room.price_tag === "night"
        ? dateDifference
        : Number(adults) * dateDifference;

    const total = nights * roomPrice + formData.addPrice;
    const discounedAmount = (total * discount) / 100;
    const discountedTotal = total - discounedAmount;

    return {
      total: total,
      discountedTotal: Math.round(discountedTotal),
      discounedAmount: discounedAmount,
    };
  };

  const roomPrice = useMemo(() => {
    const room = rooms.find((room) => room.id == formData.roomId);
    if (!room)
      return {
        price: 0,
        type: "-",
      };

    return {
      price: room.price_per_night,
      type: room.price_tag == "person" ? "به ازای هر نفر" : "به ازای هر شب",
    };
  }, [formData.roomId]);

  const totalAmount = useMemo(() => {
    const calcute = calculateTotalAmount(
      formData.roomId,
      formData.checkIn,
      formData.checkOut,
      formData.adults,
      formData.discount
    );

    return {
      total: calcute.total,
      discountedTotal: calcute.discountedTotal,
      discounedAmount: calcute.discounedAmount,
    };
  }, [
    formData.roomId,
    formData.checkIn,
    formData.checkOut,
    formData.adults,
    formData.discount,
    formData.addPrice,
  ]);

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
    if (formData.guestName === "") {
      toast.warning("لطفا نام مهمان را وارد کنید");
      return;
    }
    if (formData.guestPhone === "") {
      toast.warning("لطفا شماره تلفن را وارد کنید");
      return;
    }
    if (formData.roomId === "") {
      toast.warning("لطفا یک اتاق انتخاب کنید");
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

    const phoneRegex = /^(0|\+98|0098)9[0-9]{9}$/;
    if (!phoneRegex.test(formData.guestPhone)) {
      toast.warning("لطفا شماره تلفن معتبر وارد کنید (مثال: 09123456789)");
      return;
    }
    if (!editingReservation) {
      if (!checkRoomAvailability(formData, reservations)) {
        return;
      }
    }
    /*     if (!validateReservationDates(formData.checkIn, formData.checkOut)) {
      return;
    } */
    setIsAddingOrEditing(true);
    try {
      const reservationData = {
        roomId: formData.roomId,
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        checkIn: convertToEnglishDigits(formData.checkIn),
        checkOut: convertToEnglishDigits(formData.checkOut),
        adults: Number(formData.adults),
        notes: formData.notes,
        status: formData.status,
        totalAmount: totalAmount.total,
        addPrice: formData.addPrice,
        addpricedesc: formData.addpriceDesc,
        discount: formData.discount,
        discounttotal: totalAmount.discountedTotal,
        isAll: false,
        roomPrice: formData.roomPrice,
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
        }
      } else {
        toast.loading("درحال افزودن اطلاعات");
        const addReserve = await addNewReserve(reservationData);
        if (addReserve.success) {
          toast.dismiss();
          toast.success("با موفقیت افزوده شد");
          resetForm();
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

  const handleDelete = async (reservation) => {
    toast.warning(
      `آیا از حذف رزرواسیون ${reservation.guest_name} اطمینان دارید؟`,
      {
        action: {
          label: "حذف",
          onClick: async () => {
            toast.promise(await deleteReservation(reservation.id), {
              loading: `در حال حذف رزرواسیون ${reservation.guest_name}...`,
              success: () => {
                return `رزرواسیون ${reservation.guest_name} با موفقیت حذف شد`;
              },
              error: "خطا در حذف رزرواسیون",
            });
          },
        },
        cancel: {
          label: "انصراف",
          onClick: () => {},
        },
        duration: 10000,
      }
    );
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

  useEffect(() => {
    if (!editingReservation) {
      setFormData((prev) => ({
        ...prev,
        roomPrice: roomPrice?.price,
      }));
    }
  }, [formData.roomId]);

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      {withButton && (
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              resetForm();
              setEditingReservation(null);
            }}
            className={"bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"}
          >
            <Plus className="w-4 h-4 " />
            رزرو جدید
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
            {editingReservation ? "ویرایش رزرو" : "رزرو جدید"}
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
                //required
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
                //required
              />
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-4">
            <div className="space-y-2 w-full sm:w-48">
              <Label htmlFor="roomId">اتاق</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, roomId: value }))
                }
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="انتخاب اتاق" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => {
                    const isMaintenance = room.status === "MAINTENANCE";
                    const roomType = roomTypes.find(
                      (type) => room.type === String(type.value).toUpperCase()
                    );
                    return (
                      <SelectItem
                        key={room.id}
                        value={room.id}
                        disabled={isMaintenance}
                        className={
                          isMaintenance
                            ? "opacity-50 pointer-events-none text-red-800"
                            : "cursor-pointer"
                        }
                      >
                        {room.room_number} -{" "}
                        {!isMaintenance ? roomType?.label : "تعمیرات"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className=" space-y-2 w-full sm:max-w-[90%]">
              <Label htmlFor="adults">نفرات</Label>
              <Select
                value={formData.adults}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, adults: value }))
                }
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    {
                      length: formData.roomId
                        ? rooms.find(
                            (room) => String(room.id) == String(formData.roomId)
                          ).capacity
                        : 6,
                    },
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num.toLocaleString("fa-IR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.roomId && (
            <div className="space-y-2">
              <Label htmlFor="roomPrice">مبلغ ({roomPrice.type})</Label>
              <Input
                id="roomPrice"
                name="roomPrice"
                placeholder="0"
                value={formData.roomPrice}
                onChange={handleInputChange}
                //required
              />
              <p>{numberToWords(formData.roomPrice)} تومان</p>
            </div>
          )}

          <div className="flex flex-row justify-center gap-4  items-center">
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

          <div className="space-y-2">
            <Label htmlFor="discount"> تخفیف % </Label>
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
              <div className="flex  justify-center items-center gap-1">
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
              مبلغ اضافه ({numberToWords(formData.addPrice || 0)} تومان)
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
            <p></p>
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
              rows={3}
              placeholder=" بابت ناهار یا شام "
            />
          </div>

          {formData.roomId &&
            formData.checkIn &&
            formData.checkOut &&
            formData.adults && (
              <div className="p-4 border border-deep-ocean/20 bg-pearl-luster/50 rounded-lg space-y-1">
                <p className="text-sm text-deep-ocean">
                  <strong>
                    {" "}
                    هزینه اقامت هر{" "}
                    {rooms.find((r) => String(r.id) == formData.roomId)
                      .price_tag == "night"
                      ? "شب"
                      : "نفر"}
                    : {Number(formData.roomPrice).toLocaleString("fa-IR")} تومان
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
                    تعداد نفرات:{" "}
                    {Number(formData.adults).toLocaleString("fa-IR")} نفر
                  </strong>
                </p>
                {formData.discount > 0 && (
                  <p className="text-sm text-deep-ocean">
                    <strong>
                      تخفیف: %{" "}
                      {Number(formData.discount).toLocaleString("fa-IR")}{" "}
                      <span className="font-medium">
                        (
                        {Number(totalAmount.discounedAmount).toLocaleString(
                          "fa-IR"
                        )}{" "}
                        تومان)
                      </span>
                    </strong>
                  </p>
                )}
                {formData.addPrice > 0 && (
                  <p className="text-sm text-deep-ocean">
                    <strong>
                      مبلغ اضافه:{" "}
                      <span className="font-medium">
                        {Number(formData.addPrice).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </strong>
                  </p>
                )}
                <p className="text-base text-deep-ocean font-bold">
                  <strong>
                    مبلغ کل:{" "}
                    {Number(totalAmount.discountedTotal).toLocaleString(
                      "fa-IR"
                    )}{" "}
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

          <DialogFooter className={"sm:flex-col"}>
            <Button
              type="submit"
              disabled={isAddingOrEditing}
              className={
                "disabled:opacity-50 disabled:pointer-events-none w-full"
              }
            >
              {editingReservation ? "ویرایش" : "ایجاد"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsAddDialogOpen(false)}
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
