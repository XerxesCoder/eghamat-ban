"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { reserveStatus, roomTypes } from "@/lib/roomsData";
import { HomeIcon } from "lucide-react";
import { useMemo } from "react";
import { updateReservationStatuses } from "@/lib/jalali";

export default function RoomStats({ rooms, reservations }) {
  const filteredReservations = useMemo(() => {
    const rawData = updateReservationStatuses(reservations);

    return rawData;
  }, [reservations]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "outdated":
        return "bg-red-100 text-red-800";
      case "ended":
        return "bg-orange-100 text-orange-800 animate-pulse";
      case "checked_in":
        return "bg-cyan-100 text-cyan-800 animate-pulse";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className={"shadow-xl"}>
        <CardHeader>
          <CardTitle> اتاق ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.slice(0, 6).map((room) => (
              <div key={room.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <HomeIcon />
                  </div>
                  <div>
                    <p className="font-medium">اتاق {room.room_number} </p>
                  </div>
                </div>
                <Badge className={"bg-deep-ocean"}>
                  {
                    roomTypes.find(
                      (type) => type.value === String(room.type).toLowerCase()
                    )?.label
                  }
                </Badge>
              </div>
            ))}
            {rooms.length > 6 && (
              <Link href="/dashboard/rooms">
                <Button variant="ghost" className="w-full">
                  مشاهده همه اتاق ها ({rooms.length})
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={"shadow-xl"}>
        <CardHeader>
          <CardTitle>رزروهای اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.length > 0 ? (
              filteredReservations.map((reservation) => {
                const room = rooms.find(
                  (r) => String(r.id) === String(reservation.room_id)
                );
                return (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-deep-ocean">
                        {reservation.guest_name} -{" "}
                        <span className="font-normal text-sm">
                          ( اتاق {room.room_number})
                        </span>
                      </p>
                      <p className="text-sm ">
                        <span className="text-lime-600">
                          {reservation.check_in}
                        </span>{" "}
                        -
                        <span className="text-red-600">
                          {reservation.check_out}
                        </span>
                      </p>
                    </div>
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
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">رزروی یافت نشد.</p>
            )}
            {reservations.length > 4 && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/reservation">
                  مشاهده همه رزروها ({reservations.length})
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
