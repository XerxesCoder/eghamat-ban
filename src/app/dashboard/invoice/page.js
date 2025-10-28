"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getBankNameFromCardNumber,
  getShebaInfo,
  isShebaValid,
  numberToWords,
  verifyCardNumber,
} from "@persian-tools/persian-tools";
import { convertToPersianDigits, getJalaliDateDifference } from "@/lib/jalali";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import transition from "react-element-popper/animations/transition";
import {
  CalendarDays,
  Download,
  Copy,
  RefreshCcw,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getUserLodge } from "@/app/actions/lodge";

// Helper for copy-to-clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export default function InvoicePage() {
  const invoiceRef = useRef(null);
  const [isGettingInfo, setisGettingInfo] = useState(false);

  const getUserLodgeInfo = async () => {
    setisGettingInfo(true);
    try {
      const lodgeData = await getUserLodge();
      if (lodgeData.success) {
        const motelData = lodgeData.data[0];
        console.log(motelData);
        setMotel({
          motel_name: motelData.motel_name,
          motel_card: motelData.motel_card,
          motel_iban: motelData.motel_iban,
          motel_card_name: motelData.motel_card_name,
          motel_phone: motelData.motel_phone,
        });
      } else {
        console.log("Failed to fetch lodge data:", lodgeData);
      }
    } catch (error) {
      console.error("Error fetching lodge info:", error);
    } finally {
      setisGettingInfo(false);
    }
  };

  const [reservation, setReservation] = useState({
    id:
      "RES" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
    guest_name: "",
    guest_phone: "",
    check_in: "",
    check_out: "",
    adults: 1,
    discount: 0,
    description: "",
  });

  const [room, setRoom] = useState({
    room_number: "101",
    price: 1000000,
    price_type: "night", // "night" or "person"
  });

  const [motel, setMotel] = useState({
    motel_name: "اقامتگاه نمونه",
    motel_card: "",
    motel_iban: "",
    motel_card_name: "",
    motel_phone: "",
  });

  const [additionalPrices, setAdditionalPrices] = useState([]);

  const [issueDate, setIssueDate] = useState(
    new DateObject({
      calendar: persian,
      locale: persian_fa,
      format: "YYYY/M/D",
    })
  );

  const [errors, setErrors] = useState({});

  const nights =
    reservation.check_in && reservation.check_out
      ? getJalaliDateDifference(reservation.check_in, reservation.check_out)
      : 1;

  // Calculate price based on price type
  const basePrice = room.price;
  let totalPrice = 0;

  if (room.price_type === "night") {
    totalPrice = basePrice * nights;
  } else if (room.price_type === "person") {
    totalPrice = basePrice * nights * reservation.adults;
  }

  // Calculate additional prices total
  const additionalTotal = additionalPrices.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const subtotal = totalPrice + additionalTotal;

  const discountAmount =
    reservation.discount > 0
      ? Math.round((subtotal * reservation.discount) / 100)
      : 0;

  const finalPrice = subtotal - discountAmount;

  const todayDate = new DateObject({
    calendar: persian,
    locale: persian_fa,
    format: "YYYY/M/D",
  });

  const handleDatePick = (state, value) => {
    const chosenDate = value?.format("YYYY/M/D");
    if (state === "in") {
      setReservation((prev) => ({
        ...prev,
        check_in: String(chosenDate),
        check_out: "",
      }));
    } else if (state === "out") {
      setReservation((prev) => ({
        ...prev,
        check_out: String(chosenDate),
      }));
    } else if (state === "issue") {
      setIssueDate(value);
    }
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]:
        name === "adults" || name === "discount"
          ? Math.max(0, Number(value))
          : value,
    }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [name]: name === "price" ? Math.max(0, Number(value)) : value,
    }));
  };

  const handlePriceTypeChange = (value) => {
    setRoom((prev) => ({
      ...prev,
      price_type: value,
    }));
  };

  const handleMotelChange = (e) => {
    const { name, value } = e.target;
    setMotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAdditionalPrice = () => {
    setAdditionalPrices((prev) => [
      ...prev,
      { id: Date.now(), description: "", price: 0 },
    ]);
  };

  const updateAdditionalPrice = (id, field, value) => {
    setAdditionalPrices((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "price" ? Number(value) || 0 : value }
          : item
      )
    );
  };

  const removeAdditionalPrice = (id) => {
    setAdditionalPrices((prev) => prev.filter((item) => item.id !== id));
  };

  const validate = () => {
    let errs = {};
    if (!reservation.guest_name.trim())
      errs.guest_name = "نام مهمان الزامی است";
    if (!reservation.guest_phone.match(/^09\d{9}$/))
      errs.guest_phone = "شماره موبایل معتبر وارد کنید";
    if (!reservation.check_in) errs.check_in = "تاریخ ورود الزامی است";
    if (!reservation.check_out) errs.check_out = "تاریخ خروج الزامی است";
    if (room.price < 10000) errs.price = "قیمت اتاق باید بیشتر از ۱۰,۰۰۰ باشد";

    if (motel.motel_card) {
      if (!motel.motel_card.match(/^\d{16}$/))
        errs.motel_card = "شماره کارت باید ۱۶ رقم باشد";
      else if (!verifyCardNumber(motel.motel_card))
        errs.motel_card = "شماره کارت معتبر نیست";
    }

    if (motel.motel_iban) {
      if (!motel.motel_iban.match(/^\d{24}$/))
        errs.motel_iban = "شبا باید ۲۴ رقم باشد";
      else if (!isShebaValid(motel.motel_iban))
        errs.motel_iban = "شبا معتبر نیست";
    }

    if (motel.motel_card_name) {
      if (!motel.motel_card_name.trim())
        errs.motel_card_name = "نام صاحب حساب الزامی است";
    }

    if (motel.motel_phone) {
      if (!motel.motel_phone.match(/^09\d{9}$/))
        errs.motel_phone = "شماره موبایل معتبر وارد کنید";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const exportInvoice = async () => {
    if (!validate()) return;
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: "#fff",
        scale: 2,
        useCORS: true,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${reservation.id.slice(-6)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("خطا در ذخیره فاکتور");
    }
  };

  useEffect(() => {
    getUserLodgeInfo();
  }, []);

  const resetForm = () => {
    setReservation({
      id:
        "RES" +
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0"),
      guest_name: "",
      guest_phone: "",
      check_in: "",
      check_out: "",
      adults: 1,
      discount: 0,
      description: "",
    });
    setRoom({ room_number: "101", price: 1000000, price_type: "night" });
    setMotel({
      motel_name: "اقامتگاه نمونه",
      motel_card: "",
      motel_iban: "",
      motel_card_name: "",
      motel_phone: "",
    });
    setAdditionalPrices([]);
    setIssueDate(todayDate);
    setErrors({});
  };

  const CustomDateInput = ({
    openCalendar,
    value,
    disabled = false,
    placeholder = "انتخاب تاریخ",
  }) => (
    <Button
      variant="outline"
      onClick={openCalendar}
      disabled={disabled}
      className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}
      type="button"
    >
      <CalendarDays className="w-4 h-4" />
      <span className="text-sm truncate">{value || placeholder}</span>
    </Button>
  );

  return (
    <motion.div
      className="py-20 sm:py-14 px-4 sm:px-6 w-full min-h-screen container mx-auto max-w-7xl"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
      >
        <div>
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            صدور فاکتور
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-1 text-sm sm:text-base"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            صدور فاکتور با اطلاعات دلخواه
          </motion.p>
        </div>
        <div
          className="flex flex-wrap gap-2 mt-4 sm:mt-0"
          style={{ direction: "ltr" }}
        >
          <Button
            onClick={resetForm}
            variant="outline"
            className="gap-2"
            type="button"
          >
            <RefreshCcw className="w-4 h-4" />
            ریست فرم
          </Button>
          <Button
            onClick={exportInvoice}
            className={"bg-blue-600 text-white hover:bg-blue-700"}
            type="button"
          >
            <Download className="w-4 h-4" />
            ذخیره فاکتور
          </Button>
        </div>
      </motion.div>

      {/* Wrapper */}
      <motion.div
        className="flex flex-col xl:flex-row gap-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Forms */}
        <motion.div
          className="flex-1 max-w-4xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="space-y-8 py-8">
              {/* اطلاعات رزرو */}
              <div className="space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ۱
                  </span>
                  اطلاعات رزرو
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="guest_name">نام مهمان</Label>
                    <Input
                      id="guest_name"
                      name="guest_name"
                      placeholder="نام مهمان"
                      value={reservation.guest_name}
                      onChange={handleReservationChange}
                      autoFocus
                    />
                    {errors.guest_name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.guest_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="guest_phone">تلفن مهمان</Label>
                    <Input
                      id="guest_phone"
                      name="guest_phone"
                      placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                      value={reservation.guest_phone}
                      onChange={handleReservationChange}
                      inputMode="numeric"
                    />
                    {errors.guest_phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.guest_phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="room_number">اتاق</Label>
                    <Input
                      id="room_number"
                      name="room_number"
                      value={room.room_number}
                      onChange={handleRoomChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="price">قیمت (تومان)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={room.price}
                      onChange={handleRoomChange}
                    />
                    {errors.price && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label>نوع قیمت گذاری</Label>
                    <Select
                      value={room.price_type}
                      onValueChange={handlePriceTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="نوع قیمت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="night">قیمت هر شب</SelectItem>
                        <SelectItem value="person">
                          قیمت هر نفر در شب
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>تاریخ صدور</Label>
                    <DatePicker
                      animations={[transition()]}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={issueDate}
                      onChange={(e) => handleDatePick("issue", e)}
                      render={<CustomDateInput placeholder="تاریخ صدور" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>تاریخ ورود</Label>
                    <DatePicker
                      animations={[transition()]}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={reservation.check_in}
                      onChange={(e) => handleDatePick("in", e)}
                      render={<CustomDateInput placeholder="تاریخ ورود" />}
                    />
                    {errors.check_in && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.check_in}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>تاریخ خروج</Label>
                    <DatePicker
                      animations={[transition()]}
                      minDate={
                        reservation.check_in
                          ? new DateObject({
                              date: reservation.check_in,
                              calendar: persian,
                              locale: persian_fa,
                            }).add(1, "day")
                          : undefined
                      }
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={reservation.check_out}
                      onChange={(e) => handleDatePick("out", e)}
                      render={
                        <CustomDateInput
                          disabled={!reservation.check_in}
                          placeholder="تاریخ خروج"
                        />
                      }
                    />
                    {errors.check_out && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.check_out}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2  gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="adults">تعداد نفرات</Label>
                    <Input
                      id="adults"
                      name="adults"
                      type="number"
                      min="1"
                      value={reservation.adults}
                      onChange={handleReservationChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="discount">تخفیف (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={reservation.discount}
                      onChange={handleReservationChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">توضیحات رزرو</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="توضیحات مربوط به رزرو..."
                    value={reservation.description}
                    onChange={handleReservationChange}
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mt-2 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">قیمت پایه:</span>
                        <span>{basePrice.toLocaleString("fa-IR")} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">مدت اقامت:</span>
                        <span>{nights.toLocaleString("fa-IR")} شب</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع محاسبه:</span>
                        <span>
                          {room.price_type === "night"
                            ? "قیمت هر شب"
                            : "قیمت هر نفر در شب"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">مبلغ اقامت:</span>
                        <span>{totalPrice.toLocaleString("fa-IR")} تومان</span>
                      </div>
                      {additionalTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">خدمات اضافی:</span>
                          <span>
                            +{additionalTotal.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}
                      {reservation.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>تخفیف:</span>
                          <span>
                            -{discountAmount.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>قابل پرداخت:</span>
                        <span>{finalPrice.toLocaleString("fa-IR")} تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* خدمات اضافی */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span className="bg-green-100 text-green-600 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ۲
                    </span>
                    خدمات اضافی
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdditionalPrice}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن خدمت
                  </Button>
                </div>

                <AnimatePresence>
                  {additionalPrices.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="md:col-span-3">
                        <Label>توضیحات خدمت</Label>
                        <Input
                          placeholder="مثال: ناهار، شام، صبحانه، خدمات لاندری و..."
                          value={item.description}
                          onChange={(e) =>
                            updateAdditionalPrice(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>مبلغ (تومان)</Label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateAdditionalPrice(
                              item.id,
                              "price",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAdditionalPrice(item.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Separator />

              {/* اطلاعات اقامتگاه */}
              <div className="space-y-4">
                <div className="w-full flex justify-between items-center">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ۳
                    </span>
                    اطلاعات اقامتگاه
                  </h3>
                  <Button
                    disabled={isGettingInfo}
                    size={"sm"}
                    onClick={() => getUserLodgeInfo()}
                  >
                    اقامتگاه من
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="motel_name">نام اقامتگاه</Label>
                    <Input
                      id="motel_name"
                      name="motel_name"
                      value={motel.motel_name}
                      onChange={handleMotelChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="motel_phone">تلفن پشتیبانی</Label>
                    <Input
                      id="motel_phone"
                      name="motel_phone"
                      value={motel.motel_phone}
                      onChange={handleMotelChange}
                      inputMode="numeric"
                    />
                    {errors.motel_phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.motel_phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="motel_card">کارت</Label>
                    <Input
                      id="motel_card"
                      name="motel_card"
                      value={motel.motel_card}
                      onChange={handleMotelChange}
                      maxLength={16}
                      inputMode="numeric"
                      placeholder="xxxxxxxxxxxxxxxx"
                    />
                    <AnimatePresence>
                      {errors.motel_card && (
                        <motion.p
                          className="text-xs text-red-500 mt-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          {errors.motel_card}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="motel_iban">شبا</Label>
                    <Input
                      id="motel_iban"
                      name="motel_iban"
                      value={motel.motel_iban}
                      onChange={handleMotelChange}
                      maxLength={24}
                      inputMode="text"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <AnimatePresence>
                      {errors.motel_iban && (
                        <motion.p
                          className="text-xs text-red-500 mt-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          {errors.motel_iban}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="motel_card_name">صاحب حساب</Label>
                    <Input
                      id="motel_card_name"
                      name="motel_card_name"
                      value={motel.motel_card_name}
                      onChange={handleMotelChange}
                    />
                    {errors.motel_card_name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.motel_card_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoice Preview */}
        <motion.div
          className="flex flex-col items-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            ref={invoiceRef}
            className="p-6 mx-auto border border-gray-300 rounded-lg bg-white text-black shadow-sm"
            style={{
              width: "140mm",
              minHeight: "205mm",
              direction: "rtl",
            }}
            variants={fadeIn}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-4">
              <div className="text-right">
                <h1 className="text-xl font-bold text-black">
                  اقامتگاه {motel.motel_name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  وب اپلیکشن اقامت بان (eghamatban.ir)
                </p>
              </div>
              <div className="text-left p-1 bg-gray-100 rounded-md px-3 py-2">
                <p className="text-sm font-medium text-black">
                  شماره: {reservation.id.slice(-6)}
                </p>
                <p className="text-sm text-black">
                  تاریخ: {convertToPersianDigits(issueDate.format("YYYY/M/D"))}
                </p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="w-full border border-gray-300 mb-4 p-4 space-y-2 text-sm rounded-lg">
              <div className="flex justify-between">
                <p className="text-black">
                  <span className="font-semibold">مهمان:</span>{" "}
                  <span className="font-bold">{reservation.guest_name}</span>
                </p>
                <p className="text-black">
                  <span className="font-semibold">تلفن:</span>{" "}
                  <span className="font-bold dir-ltr text-left inline-block">
                    {convertToPersianDigits(reservation.guest_phone)}
                  </span>
                </p>
              </div>
              {reservation.description && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="text-black">
                    <span className="font-semibold">توضیحات:</span>{" "}
                    {reservation.description}
                  </p>
                </div>
              )}
            </div>

            {/* Main Table */}
            <table className="w-full text-sm border border-gray-300 overflow-hidden mb-4">
              <thead>
                <tr className="text-center text-xs border-b border-gray-300 bg-gray-100">
                  {[
                    "ورود",
                    "خروج",
                    "اتاق",
                    "مدت",
                    "نفرات",
                    "قیمت پایه",
                    "مبلغ کل",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className={`p-2 font-medium text-black ${
                        idx !== 0 ? "border-r border-gray-300" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                  <th
                    className="p-2 font-bold border-r border-gray-300 bg-gray-200 text-black"
                    rowSpan="2"
                  >
                    قابل پرداخت
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  {[
                    convertToPersianDigits(reservation.check_in),
                    convertToPersianDigits(reservation.check_out),
                    room.room_number,
                    `${nights.toLocaleString("fa-IR")} شب`,
                    `${reservation.adults.toLocaleString("fa-IR")} نفر`,
                    `${room.price.toLocaleString("fa-IR")}`,
                    `${totalPrice.toLocaleString("fa-IR")}`,
                  ].map((cell, idx) => (
                    <td
                      key={idx}
                      className={`p-2 text-black ${
                        idx !== 0 ? "border-r border-gray-300" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                  <td
                    className="p-2 font-bold border-r border-gray-300 bg-gray-200 text-black"
                    rowSpan={
                      additionalPrices.length > 0
                        ? 3 + additionalPrices.length
                        : 3
                    }
                  >
                    {finalPrice.toLocaleString("fa-IR")}
                    <span className="text-xs font-normal block">تومان</span>
                  </td>
                </tr>

                {/* Additional Services */}
                {additionalPrices.map((service, index) => (
                  <tr
                    key={service.id}
                    className="text-center border-t border-gray-200"
                  >
                    <td
                      colSpan={7}
                      className="p-2 text-black text-right pr-4 border-r border-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-600">
                          خدمات اضافی:{" "}
                          <span className="text-sm text-black font-bold">
                            {service.description}
                          </span>
                        </p>

                        <span className="font-medium">
                          +{Number(service.price).toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Summary Row */}
                <tr className="text-center border-t border-gray-300">
                  <td colSpan={7} className="p-2 text-black text-right">
                    <div className="flex justify-center flex-col">
                      {reservation.discount > 0 && (
                        <span className="font-medium text-black">
                          تخفیف: {reservation.discount.toLocaleString("fa-IR")}%
                          ({discountAmount.toLocaleString("fa-IR")} تومان)
                        </span>
                      )}
                      <span className="text-xs text-gray-600 mt-1">
                        تمام قیمتها به تومان میباشد
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Payment Info */}
            {(motel.motel_card || motel.motel_iban) && (
              <div className="mt-4">
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="space-y-2">
                    {motel.motel_card && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          کارت ({getBankNameFromCardNumber(motel.motel_card)})
                        </span>
                        <span className="font-mono text-black">
                          {convertToPersianDigits(motel.motel_card)}
                        </span>
                      </div>
                    )}

                    {motel.motel_iban && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          شبا (
                          {getShebaInfo("IR" + motel.motel_iban)?.persianName})
                        </span>
                        <span className="font-mono text-black">
                          {convertToPersianDigits(
                            motel.motel_iban.replace("IR", "")
                          )}
                        </span>
                      </div>
                    )}

                    <Separator className="bg-gray-300" />

                    <p className="text-sm text-black">
                      <span className="font-bold">
                        {finalPrice.toLocaleString("fa-IR")} تومان
                      </span>
                      <span className="text-xs text-gray-600 mr-1">
                        ({numberToWords(finalPrice)} تومان)
                      </span>
                    </p>

                    {motel.motel_card_name && (
                      <p className="text-sm font-medium text-black">
                        {motel.motel_card_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm mt-6 border-t border-gray-300 pt-4">
              <p className="font-medium text-black">از اعتماد شما سپاسگزاریم</p>
              {motel.motel_phone && (
                <p className="mt-1 text-gray-600">
                  پشتیبانی: {convertToPersianDigits(motel.motel_phone)}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
