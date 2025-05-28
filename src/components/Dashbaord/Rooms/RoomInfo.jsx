"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Search, Edit, Trash2, Bed, Grid3X3, List } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { roomAmenities, roomAvailability, roomTypes } from "@/lib/roomsData";
import { addNewRoom, deleteRoom, editRoom } from "@/app/actions/rooms";
import { useRouter } from "next/navigation";
import { persianDate } from "@/lib/jalali";

export default function RoomsPage({ rooms }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    number: "",
    type: "single",
    price: "",
    maxOccupancy: "",
    amenities: [],
    priceTag: "night",
  });

  const filteredRooms = useMemo(() => {
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

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (room) => String(room.type).toLowerCase() === typeFilter
      );
    }

    return filtered;
  }, [rooms, searchTerm, typeFilter]);

  const resetForm = () => {
    setFormData({
      number: "",
      type: "single",
      price: "",
      maxOccupancy: "",
      amenities: [],
      priceTag: "night",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsAddingRoom(true);
    try {
      const roomData = {
        number: formData.number,
        type: formData.type,
        capacity: Number(formData.maxOccupancy),
        price: Number(formData.price),
        amenities: formData.amenities,
        priceTag: formData.priceTag,
      };

      if (editingRoom) {
        toast.loading(`در حال بروزرسانی اتاق ${editingRoom.room_number}...`);
        const editRes = await editRoom(roomData, editingRoom.id);
        if (editRes.success) {
          toast.dismiss();
          toast.success("اتاق ویرایش شد", {
            description: `اتاق ${formData.number} با موفقیت ویرایش شد`,
          });
        }
        setIsAddDialogOpen(false);
        setEditingRoom(null);
        resetForm();
        router.refresh();
      } else {
        toast.loading("در حال اضافه کردن اتاق جدید...");
        const response = await addNewRoom(roomData);
        if (response.success) {
          toast.dismiss();
          toast.success("اتاق اضافه شد", {
            description: `اتاق ${formData.number} با موفقیت اضافه شد`,
          });
          setIsAddDialogOpen(false);
          setEditingRoom(null);
          resetForm();
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("خطا در ثبت اطلاعات اتاق");
    } finally {
      setIsAddingRoom(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      number: room.room_number,
      type: String(room.type).toLowerCase(),
      price: room.price_per_night.toString(),
      maxOccupancy: room.capacity.toString(),
      amenities: room.amenities,
      priceTag: room.price_tag,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (room) => {
    toast(`آیا از حذف اتاق ${room.room_number} اطمینان دارید؟`, {
      action: {
        label: "حذف",
        onClick: async () => {
          toast.promise(await deleteRoom(room.id), {
            loading: `در حال حذف اتاق ${room.room_number}...`,
            success: () => {
              router.refresh();
              return `اتاق ${room.room_number} با موفقیت حذف شد`;
            },
            error: "خطا در حذف اتاق",
          });
        },
      },
      cancel: {
        label: "انصراف",
        onClick: () => {},
      },
      duration: 10000,
    });
  };
  const handleAmenityChange = (amenity, checked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت اتاق ها</h1>
          <p className="text-gray-600 mt-1">اتاق های اقامتگاه را مدیریت کنید</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingRoom(null);
              }}
              className={"bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"}
            >
              <Plus className="w-4 h-4 mr-2" />
              اضافه کردن اتاق جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "ویرایش اتاق" : "اضافه کردن اتاق جدید"}
              </DialogTitle>
              <DialogDescription>
                {editingRoom
                  ? "بروز کردن اطلاعات اتاق"
                  : "اضافه کردن اطلاعات اتاق جدید"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">اسم یا شماره اتاق</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceTag">نحوه قیمت گذاری</Label>
                  <Select
                    value={formData.priceTag}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, priceTag: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"night"}>به ازای هر شب</SelectItem>
                      <SelectItem value={"person"}>بر اساس هر نفر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">نرخ (تومان)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع اتاق</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type, id) => {
                        return (
                          <SelectItem key={id} value={type.value}>
                            {type.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOccupancy">ظرفیت</Label>
                  <Input
                    id="maxOccupancy"
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxOccupancy: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>امکانات</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {roomAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity, checked)
                        }
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  لغو
                </Button>
                <Button
                  disabled={isAddingRoom}
                  className={
                    "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70 disabled:opacity-50 disabled:pointer-events-none"
                  }
                  type="submit"
                >
                  {editingRoom ? "ویرایش" : "اضافه کردن"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                {roomTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`${
                  viewMode == "grid" &&
                  "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70 rounded-l-none"
                } `}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list" &&
                  "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"
                } rounded-r-none`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    اتاق {room.room_number}
                  </CardTitle>
                  <Badge className={`bg-deep-ocean text-white`}>
                    {
                      roomTypes.find(
                        (type) => room.type == String(type.value).toUpperCase()
                      ).label
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">نرخ:</span>
                  <span className="font-medium">
                    {Number(room.price_per_night).toLocaleString("fa-IR")} /{" "}
                    {room.price_tag == "night" ? "شب" : "نفر"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ظرفیت:</span>
                  <span className="font-medium">{room.capacity} مهمان</span>
                </div>

                {room.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">امکانات:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 5).map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs text-deep-ocean"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 5} بیشتر
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(room)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    ویرایش
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(room)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                      اتاق
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                      نوع
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                      نرخ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                      ظرفیت
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900">
                          اتاق {room.room_number}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="capitalize">
                          {
                            roomTypes.find(
                              (type) =>
                                room.type == String(type.value).toUpperCase()
                            ).label
                          }
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-mono">
                        {Number(room.price_per_night).toLocaleString("fa-IR")}{" "}
                        تومان / {room.price_tag == "night" ? "شب" : "نفر"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        {room.capacity} نفر
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(room)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(room)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              اتاقی پیدا نشد
            </h3>
            <p className="text-gray-600 mb-4">
              {rooms.length === 0
                ? "اولیت اتاق اقامتگاهت رو اضافه کن"
                : "پارامترهای جستجوی خود را تغییر بده"}
            </p>
            {rooms.length === 0 && (
              <Button
                className={
                  "bg-aqua-spark text-deep-ocean hover:bg-aqua-spark/70"
                }
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                اولین اتاق را اضافه کن
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
