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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Edit,
  Trash2,
  BadgeCheck,
  Construction,
  Users,
  DollarSign,
  Home,
  Star,
  BedSingle,
} from "lucide-react";
import { roomStatusTypes, roomTypes } from "@/lib/roomsData";

export default function RoomCard({ room, handleDelete, handleEdit }) {
  const roomStatus = roomStatusTypes.find(
    (status) => room.status == status.value
  );
  const roomType = roomTypes.find(
    (type) => room.type == String(type.value).toUpperCase()
  );
  const isAvailable = room.status === "AVAILABLE";

  return (
    <Card >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isAvailable ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <BedSingle
                className={`w-5 h-5 ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                اتاق {room.room_number}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{roomType?.label}</p>
            </div>
          </div>

          <Badge
            className={`${
              isAvailable
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            } flex items-center space-x-1`}
          >
            {isAvailable ? (
              <BadgeCheck className="w-3 h-3" />
            ) : (
              <Construction className="w-3 h-3" />
            )}
            <span>{roomStatus?.label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 " />
            <div>
              <div className="text-xs font-medium">نرخ</div>
              <p className="text-sm font-semibold text-deep-ocean">
                {Number(room.price_per_night).toLocaleString("fa-IR")}{" "}
                <span className="text-xs">
                  / {room.price_tag == "night" ? "شب" : "نفر"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <div>
              <div className="text-xs text-gray-500 font-medium">ظرفیت</div>
              <p className="text-sm font-semibold text-gray-900">
                {Number(room.capacity).toLocaleString("fa-IR", {
                  useGrouping: false,
                })}{" "}
                مهمان
              </p>
            </div>
          </div>
        </div>

        {room.amenities.length > 0 && (
          <div className="border-t pt-2">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">امکانات</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                >
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 4 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 cursor-help"
                    >
                      +{room.amenities.length - 4} بیشتر
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-medium mb-1">سایر امکانات:</p>
                      <div className="text-xs space-y-1">
                        {room.amenities.slice(4).map((amenity) => (
                          <div key={amenity}>• {amenity}</div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex space-x-2 pt-4 border-t w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(room)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(room)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
