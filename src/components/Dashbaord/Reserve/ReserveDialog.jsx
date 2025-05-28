"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { roomTypes } from "@/lib/roomsData";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import transition from "react-element-popper/animations/transition";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  checkRoomAvailability,
  getJalaliDateDifference,
  validateReservationDates,
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
  const router = useRouter();

  const dateDifference = useMemo(() => {
    if (formData.checkIn == formData.checkOut) return 1;
    return getJalaliDateDifference(formData.checkIn, formData.checkOut);
  }, [formData.checkIn, formData.checkOut]);
  const calculateTotalAmount = (roomId, checkIn, checkOut, adults) => {
    const room = rooms.find((r) => String(r.id) === String(roomId));
    if (!room || !checkIn || !checkOut) return 0;
    const roomPrice = room.price_per_night;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    if (!editingReservation) {
      if (!checkRoomAvailability(formData, reservations)) {
        return;
      }
    }
    if (!validateReservationDates(formData.checkIn, formData.checkOut)) {
      return;
    }
    setIsAddingOrEditing(true);
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
        adults: Number(formData.adults),
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingReservation ? "ویرایش رزرو" : "رزرو جدید"}
          </DialogTitle>
          <DialogDescription>
            {editingReservation ? "ویرایش اطلاعات رزرو" : "ایجاد رزرو جدید"}
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
                    {Number(
                      rooms.find((r) => String(r.id) === formData.roomId)
                        ?.price_per_night
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
              className={"disabled:opacity-50 disabled:pointer-events-none"}
            >
              {editingReservation ? "ویرایش" : "ایجاد"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
