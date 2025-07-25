"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Plus,
  X,
  Save,
  Download,
} from "lucide-react";
import { createOrUpdateMotel, getUserDataJson } from "@/app/actions/lodge";
import { toast } from "sonner";
import { convertToPersianDigits } from "@/lib/jalali";
import {
  verifyCardNumber,
  getBankNameFromCardNumber,
  isShebaValid,
  getShebaInfo,
} from "@persian-tools/persian-tools";

export default function LodgeInfo({ userLodgeInfo }) {
  const [motelData, setMotelData] = useState({
    name: userLodgeInfo?.motel_name || "",
    address: userLodgeInfo?.motel_address || "",
    card: userLodgeInfo?.motel_card || "",
    iban: userLodgeInfo?.motel_iban || "",
    phone: userLodgeInfo?.motel_phone || "",
    amenities: userLodgeInfo?.motel_amenities
      ? JSON.parse(userLodgeInfo?.motel_amenities)
      : [],
    checkInTime: userLodgeInfo?.motel_checkin || "14:00",
    checkOutTime: userLodgeInfo?.motel_checkout || "12:00",
    cardName: userLodgeInfo?.motel_card_name || "",
  });
  const [newAmenity, setNewAmenity] = useState("");

  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (field === "phone" || field === "card" || field === "iban") {
      setMotelData((prev) => ({ ...prev, [field]: onlyNumbers }));
    } else {
      setMotelData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !motelData.amenities.includes(newAmenity.trim())) {
      setMotelData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setMotelData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (motelData.card && !verifyCardNumber(motelData.card)) {
        toast.warning("کارت بانکی وارد شده معتبر نمی باشد");
        return;
      }
      if (motelData.iban && !isShebaValid(motelData.iban)) {
        toast.warning("شماره شبا وارد شده معتبر نمی باشد");
        return;
      }

      toast.dismiss();
      toast.loading("در حال ذخیره ...");
      const data = await createOrUpdateMotel(motelData);
      if (data.success) {
        toast.dismiss();
        toast.success("اطلاعات با موفقیت ذخیره شد");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  async function downloadUserDataAsJson() {
    try {
      setSaving(true);
      toast.dismiss();
      toast.loading("در حال دانلود ...");
      const data = await getUserDataJson();

      if (data?.error) {
        toast.dismiss();
        toast.error("خطا در دانلود اطلاعات");
        console.error(data.error);
        return;
      }
      const jsonString = JSON.stringify(data.data, null, 2);

      const blob = new Blob([jsonString], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_data.json";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("اطلاعات با موفقیت دانلود شد");
    } catch (err) {
      console.error("Error downloading data:", err);
      toast.dismiss();
      toast.error("خطا در دانلود اطلاعات");
    } finally {
      setSaving(false);
    }
  }

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
      className="py-20 sm:py-14 px-6 w-full min-h-screen space-y-6  container mx-auto"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-0"
        variants={item}
      >
        <div>
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            اطلاعات اقامتگاه
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            اطلاعات اقامتگاه خود را وارد کنید تا مشتریان بتوانند به راحتی با شما
            تماس بگیرند.
          </motion.p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            className={"bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"}
            onClick={() => handleSave()}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "در حال ذخیره" : "ذخیره تغییرات"}
          </Button>
          <Button
            variant={"outline"}
            onClick={() => downloadUserDataAsJson()}
            disabled={saving}
          >
            <Download className="w-4 h-4 mr-2" />
            دانلود اطلاعات
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              اطلاعات اصلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-5">
              <div className={"w-full space-y-2"}>
                <Label htmlFor="name">نام اقامتگاه</Label>
                <Input
                  id="name"
                  value={motelData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="نام را وارد کنید"
                  className={"w-full"}
                />
              </div>
              <div className={"w-full  space-y-2"}>
                <Label htmlFor="phone">تلفن تماس</Label>
                <Input
                  id="phone"
                  value={motelData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="09123456789"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-5">
              <div className={"w-full  space-y-2"}>
                <Label htmlFor="card">شماره کارت</Label>
                <Input
                  id="card"
                  value={motelData.card}
                  maxLength={16}
                  onChange={(e) => handleInputChange("card", e.target.value)}
                  placeholder="شماره کارت جهت درج در فاکتور"
                />
              </div>
              <div className={"w-full  space-y-2"}>
                <Label htmlFor="iban">شماره شبا</Label>
                <Input
                  id="iban"
                  value={motelData.iban}
                  onChange={(e) => handleInputChange("iban", e.target.value)}
                  placeholder=" شماره شبا جهت درج در فاکتور بدون IR"
                />
              </div>
            </div>
            <div className={"w-full  space-y-2"}>
              <Label htmlFor="cardName">نام صاحب کارت </Label>
              <Input
                id="cardName"
                value={motelData.cardName}
                onChange={(e) => handleInputChange("cardName", e.target.value)}
                placeholder="نام صاحب کارت جهت درج در فاکتور"
              />
            </div>
            <div className={"w-full  space-y-2"}>
              <Label htmlFor="address">آدرس</Label>
              <Textarea
                id="address"
                value={motelData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="آدرس کامل اقامتگاه را وارد کنید"
                rows={3}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-5">
              <div className={"  space-y-2"}>
                <Label htmlFor="checkInTime">ساعت ورود</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={motelData.checkInTime}
                  onChange={(e) =>
                    handleInputChange("checkInTime", e.target.value)
                  }
                />
              </div>

              <div className={" space-y-2"}>
                <Label htmlFor="checkOutTime">ساعت خروج</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={motelData.checkOutTime}
                  onChange={(e) =>
                    handleInputChange("checkOutTime", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>امکانات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="استخر یا وای فای یا ..."
                onKeyPress={(e) => e.key === "Enter" && addAmenity()}
              />
              <Button
                onClick={addAmenity}
                size="sm"
                className={"bg-lime-zest text-deep-ocean hover:bg-lime-zest/70"}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {motelData.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {amenity}
                  <button
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {motelData.amenities.length === 0 && (
              <p className="text-muted-foreground text-sm">
                هنوز امکاناتی اضافه نشده است.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item}>
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">
              {motelData.name || "نام اقامتگاه"}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 ml-2" />
                <span>{motelData.address || "آدرس"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 ml-2" />
                <span>
                  {convertToPersianDigits(motelData.phone) || "تلفن تماس"}
                </span>
              </div>
            </div>

            {motelData.description && (
              <p className="mt-4 text-blue-50">{motelData.description}</p>
            )}

            {motelData.amenities.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">امکانات:</h4>
                <div className="flex flex-wrap gap-2">
                  {motelData.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="bg-deep-ocean/80 text-white"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-deep-ocean">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 ml-2" />
                  <span>
                    زمان ورود: {convertToPersianDigits(motelData.checkInTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 ml-2" />
                  <span>
                    زمان خروج: {convertToPersianDigits(motelData.checkOutTime)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
