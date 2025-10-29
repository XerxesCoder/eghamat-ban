"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  Search,
  CalendarIcon,
  X,
  FileText,
  Download,
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
  convertToPersianDigits,
  getJalaliDateDifference,
  persianDate,
  sortByCheckInDateDesc,
  updateReservationStatuses,
} from "@/lib/jalali";
import { deleteReservation } from "@/app/actions/reserve";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { reserveStatus } from "@/lib/roomsData";
import ReserveDialog from "./ReserveDialog";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas-pro";
import ReserveCard from "./ReserveCard";
import {
  getBankNameFromCardNumber,
  getShebaInfo,
  numberToWords,
} from "@persian-tools/persian-tools";
import { Separator } from "@/components/ui/separator";
import ReserveWholeLodgeDialog from "./ReserveWholeLodgeDialog";
import GroupedReserveCard from "./GroupedReserveCard";

export default function ReservationsPage({
  rooms,
  reservations,
  userLodgeInfo,
}) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isWholeLodgeDialogOpen, setIsWholeLodgeDialogOpen] = useState(false);
  const invoiceRef = useRef(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    notes: "",
    status: "pending",
    discount: 0,
    addPrice: 0,
    addpriceDesc: "",
    roomPrice: 0,
  });

  const filteredReservations = useMemo(() => {
    const rawData = updateReservationStatuses(reservations);

    let filtered = rawData;

    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.guest_phone.includes(searchTerm) ||
          res.id == searchTerm
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

    return sortByCheckInDateDesc(filtered);
  }, [rooms, searchTerm, statusFilter, roomFilter, reservations]);

  const groupReservations = useMemo(() => {
    const grouped = [];
    const processedIds = new Set();

    filteredReservations.forEach((reservation) => {
      if (processedIds.has(reservation.id)) return;

      if (reservation.isall) {
        const sameGroup = filteredReservations.filter(
          (r) =>
            r.isall &&
            r.guest_name === reservation.guest_name &&
            r.guest_phone === reservation.guest_phone &&
            r.check_in === reservation.check_in &&
            r.check_out === reservation.check_out &&
            new Date(r.created_at).toDateString() ===
              new Date(reservation.created_at).toDateString()
        );

        // Add all IDs to processed set
        sameGroup.forEach((r) => processedIds.add(r.id));

        if (sameGroup.length > 1) {
          grouped.push({
            ...reservation,
            isGrouped: true,
            groupedReservations: sameGroup,
            room_count: sameGroup.length,
            total_group_price: sameGroup.reduce(
              (sum, r) => sum + (r.discounttotal || r.total_price),
              0
            ),
            price_type: "night",
            total_adults: sameGroup.reduce(
              (sum, r) => sum + Number(r.adults || 0),
              0
            ),
            rooms: sameGroup
              .map((r) =>
                rooms.find((room) => String(room.id) === String(r.room_id))
              )
              .filter(Boolean),
          });
        } else {
          grouped.push(reservation);
        }
      } else {
        grouped.push(reservation);
      }
    });

    return grouped;
  }, [filteredReservations]);

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
      discount: 0,
      addPrice: 0,
      addpriceDesc: "",
      roomPrice: 0,
    });
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
      discount: reservation.discount,
      addPrice: reservation.addprice,
      addpriceDesc: reservation.addpricedesc,
      roomPrice: reservation.roomprice,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditGroup = (groupReservation) => {
    setEditingGroup(groupReservation);
    setIsWholeLodgeDialogOpen(true);
  };

  const handleDelete = async (reservation) => {
    toast.warning(
      `آیا از حذف رزرواسیون ${reservation.guest_name} اطمینان دارید؟`,
      {
        action: {
          label: "حذف",
          onClick: async () => {
            toast.promise(
              await deleteReservation(reservation.id, reservation.room_id),
              {
                loading: `در حال حذف رزرواسیون ${reservation.guest_name}...`,
                success: () => {
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
      }
    );
  };

  const handleDeleteGroup = async (groupReservation) => {
    toast.warning(
      `آیا از حذف رزرو کامل اقامتگاه برای ${groupReservation.guest_name} اطمینان دارید؟ `,
      {
        action: {
          label: "حذف همه",
          onClick: async () => {
            toast.promise(
              Promise.all(
                groupReservation.groupedReservations.map((reservation) =>
                  deleteReservation(reservation.id, reservation.room_id)
                )
              ),
              {
                loading: `در حال حذف ...`,
                success: () => {
                  return `رزرو کامل اقامتگاه ${groupReservation.guest_name} با موفقیت حذف شد `;
                },
                error: "خطا در حذف رزروهای اقامتگاه",
              }
            );
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

  const handlePrintInvoice = (reservation) => {
    setSelectedReservation(reservation);
    setIsInvoiceDialogOpen(true);
  };

  const exportInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        //scale: 1,
        backgroundColor: "#ffffff",
        logging: true,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${
        selectedReservation.id.slice(-6) || "reservation"
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("فاکتور صادر شد");
      setIsInvoiceDialogOpen(false);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const InvoiceDialog = () => {
    if (!selectedReservation) return null;

    const motelData = userLodgeInfo;

    // Check if this is a grouped reservation
    const isGroupedReservation = selectedReservation.isGrouped;

    const checkInDate = selectedReservation.check_in;
    const checkOutDate = selectedReservation.check_out;
    const nights = getJalaliDateDifference(checkInDate, checkOutDate);

    const roomPriceType = isGroupedReservation
      ? selectedReservation.allpricetype
      : rooms.find((r) => String(r.id) === selectedReservation.room_id)
          ?.price_tag === "night"
      ? "شبانه"
      : "نفر";

    const finalPayPrice = isGroupedReservation
      ? selectedReservation.total_group_price
      : selectedReservation?.discounttotal >= 0
      ? selectedReservation.discounttotal
      : selectedReservation.total_price;

    const discountedAmount = isGroupedReservation
      ? selectedReservation.total_group_price - finalPayPrice
      : selectedReservation.discount > 0
      ? selectedReservation.total_price - selectedReservation.discounttotal
      : 0;

    const totalAddPrice = isGroupedReservation
      ? selectedReservation.groupedReservations.reduce(
          (sum, r) => sum + (r.addprice || 0),
          0
        )
      : selectedReservation.addprice || 0;

    const totalAdults = isGroupedReservation
      ? selectedReservation.total_adults
      : selectedReservation.adults;

    const roomCount = isGroupedReservation ? selectedReservation.room_count : 1;
    console.log(selectedReservation);
    return (
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="min-w-full sm:min-w-[650px] max-h-[90vh] overflow-y-auto p-3 no-print">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              پیش فاکتور {isGroupedReservation && "(رزرو کامل)"}
            </DialogTitle>
          </DialogHeader>

          <div
            ref={invoiceRef}
            className="p-2 mx-auto border rounded-md bg-white text-black"
            style={{
              width: "140mm",
              maxHeight: "205mm",
              direction: "rtl",
            }}
          >
            <div className="flex justify-between items-start mb-2 border-b pb-2">
              <div className="text-right">
                <h1 className="text-xl font-bold">
                  اقامتگاه {motelData.motel_name}
                </h1>
                <p className="text-sm mt-1">وب اپلیکشن اقامت بان</p>
              </div>
              <div className="text-left p-1">
                <div>
                  <p className="text-sm">
                    {selectedReservation.id.slice(-6)} #
                  </p>
                  <p className="text-sm">
                    <span>تاریخ:</span> {convertToPersianDigits(persianDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full border border-gray-300 mb-4 p-3 space-y-2 text-sm rounded-md">
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">مهمان:</span>{" "}
                  <span className="font-bold">
                    {selectedReservation.guest_name}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">تلفن:</span>{" "}
                  <span className="font-bold dir-ltr text-left inline-block">
                    {convertToPersianDigits(selectedReservation.guest_phone)}
                  </span>
                </p>
              </div>
              {/*               {isGroupedReservation && (
                <div className="flex justify-between items-center mt-2">
                  <p>
                    <span className="font-semibold">تعداد اتاق‌ها:</span>{" "}
                    <span className="font-bold">
                      {roomCount.toLocaleString("fa-IR")}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">تعداد نفرات کل:</span>{" "}
                    <span className="font-bold">
                      {totalAdults.toLocaleString("fa-IR")}
                    </span>
                  </p>
                </div>
              )} */}
            </div>

            {/* Single Table for both individual and grouped reservations */}
            <table className="w-full text-sm border border-black overflow-hidden">
              <thead>
                <tr className="text-center text-xs border border-black">
                  {[
                    "تاریخ ورود",
                    "تاریخ خروج",
                    "اتاق",
                    "مدت اقامت",
                    "نفرات",
                    "قیمت پایه",
                    "مبلغ کل",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className={`p-2 ${
                        idx !== 0 ? "border-r border-black" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                  <th
                    className="p-2 font-bold border-r border-black"
                    rowSpan="2"
                  >
                    قابل پرداخت
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  {[
                    convertToPersianDigits(checkInDate),
                    convertToPersianDigits(checkOutDate),
                    isGroupedReservation
                      ? "کل اقامتگاه"
                      : rooms.find(
                          (r) => String(r.id) === selectedReservation.room_id
                        )?.room_number,
                    `${nights.toLocaleString("fa-IR")} شب`,
                    `${totalAdults.toLocaleString("fa-IR")} نفر`,
                    `${
                      selectedReservation.roomprice?.toLocaleString("fa-IR") ||
                      "0"
                    }`,
                    isGroupedReservation
                      ? `${selectedReservation.total_group_price.toLocaleString(
                          "fa-IR"
                        )}`
                      : `${selectedReservation.total_price.toLocaleString(
                          "fa-IR"
                        )}`,
                  ].map((cell, idx) => (
                    <td
                      key={idx}
                      className={`p-2 ${
                        idx !== 0 ? "border-r border-black" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                  <td
                    className="p-2 font-bold border-r border-black"
                    rowSpan="2"
                  >
                    {finalPayPrice.toLocaleString("fa-IR")} تومان
                  </td>
                </tr>
                <tr className="text-center">
                  <td
                    colSpan={7}
                    className="p-2 border-t border-black text-right"
                  >
                    {selectedReservation.discount > 0 && (
                      <div className="flex justify-center flex-col">
                        <p className="font-medium">
                          تخفیف: %{" "}
                          {Number(selectedReservation.discount).toLocaleString(
                            "fa-IR"
                          )}{" "}
                          <span className="text-xs">
                            ({discountedAmount.toLocaleString("fa-IR")} تومان)
                          </span>
                        </p>
                      </div>
                    )}
                    {totalAddPrice > 0 && (
                      <div className="flex justify-center flex-col">
                        <p className="font-medium">
                          مبلغ اضافه: {totalAddPrice.toLocaleString("fa-IR")}{" "}
                          تومان{" "}
                          {selectedReservation.addpricedesc && (
                            <span className="text-xs">
                              ({selectedReservation.addpricedesc})
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    <span className="text-xs">
                      تمامی قیمت ها به تومان می‌باشد
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-sm mt-3  p-2 rounded-md border">
              {isGroupedReservation && (
                <p className="fon mb-2t-bold">
                  این فاکتور مربوط به رزرو کامل اقامتگاه می‌باشد
                </p>
              )}
              <p>
                {roomPriceType !== "شبانه"
                  ? "مبلغ بر اساس تعداد شب‌های اقامت، تعداد نفرات و قیمت پایه هر نفر در هر شب محاسبه شده است."
                  : "مبلغ بر اساس تعداد شب‌های اقامت و قیمت پایه هر شب محاسبه شده است."}
              </p>

              {motelData.invoicenote && (
                <p className="font-bold mt-1">{motelData.invoicenote}</p>
              )}

              <div className="flex justify-around mt-2 items-center">
                <p className="space-x-1">
                  <span className="text-xs">ساعت ورود:</span>
                  <span className="font-semibold">
                    {convertToPersianDigits(motelData.motel_checkin)}
                  </span>
                </p>
                <p className="space-x-1">
                  <span className="text-xs">ساعت تخلیه:</span>
                  <span className="font-semibold">
                    {convertToPersianDigits(motelData.motel_checkout)}
                  </span>
                </p>
              </div>
            </div>

            {(motelData.motel_card || motelData.motel_iban) && (
              <div className="mt-3 gap-4">
                <div className="border border-gray-300 rounded-md p-3">
                  {motelData.motel_card && (
                    <p className="flex justify-between items-center">
                      <span className="text-xs">
                        شماره کارت (
                        {getBankNameFromCardNumber(motelData.motel_card)}):
                      </span>
                      <span>
                        {convertToPersianDigits(motelData.motel_card)}
                      </span>
                    </p>
                  )}

                  {motelData.motel_iban && (
                    <p className="flex justify-between items-center mt-2">
                      <span className="text-xs">
                        شماره شبا (
                        {getShebaInfo("IR" + motelData.motel_iban).persianName}
                        ):
                      </span>
                      <span>
                        {convertToPersianDigits(motelData.motel_iban)}
                      </span>
                    </p>
                  )}
                  <Separator />
                  <p className="text-sm mt-2">
                    <span className="font-bold">
                      {finalPayPrice.toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="text-xs text-muted-foreground mr-1">
                      ({numberToWords(finalPayPrice)} تومان)
                    </span>
                  </p>

                  {motelData.motel_card_name && (
                    <p className="text-right mt-2 text-sm">
                      {motelData.motel_card_name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center text-sm mt-6 border-t pt-4">
              <p className="font-medium">از اعتماد شما سپاسگزاریم</p>
              {motelData.motel_phone && (
                <p className="mt-1">
                  پشتیبانی: {convertToPersianDigits(motelData.motel_phone)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="no-print">
            <Button onClick={exportInvoice} className="gap-2">
              <Download className="w-4 h-4" />
              ذخیره فاکتور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  useEffect(() => {
    const searchParam = searchParams.get("reserve");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={item}
      >
        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            سامانه رزرواسیون
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 mt-1"
          >
            مدیریت رزرواسیون اقامتکاه
          </motion.p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
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
          <ReserveWholeLodgeDialog
            isWholeLodgeDialogOpen={isWholeLodgeDialogOpen}
            setIsWholeLodgeDialogOpen={setIsWholeLodgeDialogOpen}
            reservations={reservations}
            rooms={rooms}
            withButton={true}
            setEditingGroup={setEditingGroup}
            editingGroup={editingGroup}
          />
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="جستجو بر اساس نام یا تلفن"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute cursor-pointer left-3  top-1/2 transform -translate-y-1/2 text-deep-ocean hover:text-deep-ocean/80 focus:outline-none"
                      >
                        <X className="w-4 h-4" />{" "}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه وضعیت ها</SelectItem>
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {groupReservations.map((reservation, index) => {
            if (reservation.isGrouped) {
              return (
                <motion.div
                  key={`group-${reservation.id}`}
                  variants={item}
                  custom={index}
                >
                  <GroupedReserveCard
                    groupReservation={reservation}
                    handleDelete={handleDeleteGroup}
                    handleEdit={handleEdit}
                    handlePrintInvoice={handlePrintInvoice}
                    handleEditGroup={handleEditGroup}
                  />
                </motion.div>
              );
            }

            return (
              <motion.div key={reservation.id} variants={item} custom={index}>
                <ReserveCard
                  rooms={rooms}
                  reservation={reservation}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  handlePrintInvoice={handlePrintInvoice}
                />
              </motion.div>
            );
          })}

          {filteredReservations.length > 0 && <InvoiceDialog />}
          {filteredReservations.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2  xl:col-span-3"
            >
              <Card>
                <CardContent className="text-center">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    رزروی پیدا نشد
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {reservations.length === 0 &&
                      "اولین رزرو خود را ایجاد کنید"}
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
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
