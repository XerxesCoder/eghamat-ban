"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, Phone, Edit, Trash2, FileText } from "lucide-react";
import { reserveStatus, roomTypes } from "@/lib/roomsData";
import { getStatusColor } from "@/lib/badgeColors";
import { convertToPersianDigits } from "@/lib/jalali";
export default function ReserveCard({
  reservation,
  rooms,
  handleDelete,
  handleEdit,
  handlePrintInvoice,
}) {
  const room = rooms.find((r) => String(r.id) === String(reservation.room_id));
  const finalPayPrice =
    reservation?.discounttotal !== null && reservation.discounttotal >= 0
      ? reservation.discounttotal
      : reservation.total_price;
  const roomTypeLabel = roomTypes.find(
    (type) => room.type == String(type.value).toUpperCase()
  ).label;
  return (
    <Card className={"gap-0 py-3"}>
      <CardContent className="p-4 ">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {reservation.guest_name}
              </h3>
              <p className="text-gray-600">
                اتاق {room?.room_number} - {roomTypeLabel}
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
                    res.value === String(reservation.status).toLowerCase()
                )?.label
              }
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center  gap-4 text-sm">
          <div className="flex flex-col  items-start justify-center gap-4 enter text-sm w-full">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{convertToPersianDigits(reservation.guest_phone)}</span>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <User className="w-4 h-4 text-gray-400" />
              <span>
                {Number(reservation.adults).toLocaleString("fa-IR", {
                  useGrouping: false,
                })}{" "}
                نفر
              </span>
            </div>
          </div>

          <div className="flex flex-col  items-end justify-center gap-4 enter text-sm w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={"bg-lime-200 text-lime-900"}>
                  {convertToPersianDigits(reservation.check_in)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>تاریخ ورود</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={"bg-red-200 text-red-900"}>
                  {convertToPersianDigits(reservation.check_out)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>تاریخ خروج</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {reservation.special_requests !== "" && (
          <div className="mt-4">
            <span className="text-gray-500 text-xs">یادداشت: </span>
            <span className="text-sm">{reservation.special_requests}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className=" px-4">
        <div className="w-full border-t pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 mb-1">هزینه اقامت</span>
              <p className="text-lg font-bold text-deep-ocean">
                {Number(finalPayPrice).toLocaleString("fa-IR")}
                <span className="text-sm mr-1">تومان</span>
              </p>
              {reservation.discount > 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  تخفیف{" "}
                  {Number(reservation.discount).toLocaleString("fa-IR", {
                    useGrouping: false,
                  })}{" "}
                  درصد
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrintInvoice(reservation)}
                    className="h-9 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>دریافت فاکتور</p>
                </TooltipContent>
              </Tooltip>

              {String(reservation.status) !== "OUTDATED" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(reservation)}
                      className="h-9 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ویرایش رزرو</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(reservation)}
                    className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>حذف رزرو</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
