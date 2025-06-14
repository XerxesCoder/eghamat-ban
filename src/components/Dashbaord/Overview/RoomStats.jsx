"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { reserveStatus, roomStatusTypes, roomTypes } from "@/lib/roomsData";
import { BadgeCheck, CalendarFold, Construction, DoorOpen } from "lucide-react";
import { useMemo } from "react";
import {
  convertToPersianDigits,
  sortByCheckInDateDesc,
  updateReservationStatuses,
} from "@/lib/jalali";

import { useRouter } from "next/navigation";
import { getStatusColor } from "@/lib/badgeColors";

export default function RoomStats({ rooms, reservations }) {
  const filteredReservations = useMemo(() => {
    const rawData = updateReservationStatuses(reservations);

    return sortByCheckInDateDesc(rawData);
  }, [reservations]);

  const router = useRouter();

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
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>اتاق ها</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-2" variants={container}>
              {rooms.length > 0 ? (
                rooms.slice(0, 5).map((room) => (
                  <motion.div
                    key={room.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-sky-glint/50 transition-all ease-in-out p-3 rounded-md"
                    variants={item}
                    onClick={() =>
                      router.push(`/dashboard/rooms?room=${room.room_number}`)
                    }
                  >
                    <div className="flex items-center space-x-2 ">
                      <DoorOpen />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">
                          اتاق {room.room_number} |{" "}
                          <span className="text-xs text-gray-600">
                            {
                              roomTypes.find(
                                (type) =>
                                  room.type == String(type.value).toUpperCase()
                              )?.label
                            }
                          </span>
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        room.status == "AVAILABLE"
                          ? "text-deep-ocean bg-lime-zest"
                          : "text-pearl-luster bg-red-500"
                      }`}
                    >
                      {room.status == "AVAILABLE" ? (
                        <BadgeCheck />
                      ) : (
                        <Construction />
                      )}
                      {
                        roomStatusTypes.find(
                          (status) => room.status == status.value
                        ).label
                      }
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-gray-500 text-center py-4"
                  variants={item}
                >
                  اتاقی یافت نشد.
                </motion.p>
              )}

              {rooms.length > 5 && (
                <motion.div variants={item}>
                  <Link href="/dashboard/rooms">
                    <Button variant="ghost" className="w-full">
                      مشاهده همه اتاق ها ({rooms.length})
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>رزروهای اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-2" variants={container}>
              {reservations.length > 0 ? (
                filteredReservations.slice(0, 5).map((reservation) => {
                  const room = rooms.find(
                    (r) => String(r.id) === String(reservation.room_id)
                  );
                  const reserveStats = reserveStatus.find(
                    (res) =>
                      res.value === String(reservation.status).toLowerCase()
                  )?.label;

                  return (
                    <motion.div
                      key={reservation.id}
                      className="flex items-center justify-between cursor-pointer hover:bg-sky-glint/50 transition-all ease-in-out px-2 py-1 rounded-md"
                      variants={item}
                      onClick={() =>
                        router.push(
                          `/dashboard/reservation?reserve=${reservation.guest_name}`
                        )
                      }
                    >
                      <div className="flex justify-center items-center gap-2">
                        <CalendarFold />
                        <div>
                          <p className="font-medium text-deep-ocean text-xs sm:text-sm">
                            {reservation.guest_name} |{" "}
                            <span className="font-normal text-xs sm:text-sm">
                              اتاق {room?.room_number}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-xs sm:text-sm text-lime-600">
                              {convertToPersianDigits(reservation.check_in)}
                            </span>{" "}
                            -
                            <span className="text-xs sm:text-sm  text-red-600">
                              {convertToPersianDigits(reservation.check_out)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={getStatusColor(
                          String(reservation.status).toLowerCase()
                        )}
                      >
                        {reserveStats}
                      </Badge>
                    </motion.div>
                  );
                })
              ) : (
                <motion.p
                  className="text-gray-500 text-center py-4"
                  variants={item}
                >
                  رزروی یافت نشد.
                </motion.p>
              )}

              {reservations.length > 5 && (
                <motion.div variants={item}>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/reservation">
                      مشاهده همه رزروها ({reservations.length})
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
