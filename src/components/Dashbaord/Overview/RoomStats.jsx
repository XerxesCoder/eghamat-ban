"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function RoomStats() {
  const rooms = [
    {
      id: "1",
      number: "101",
      type: "single",
      price: 89,
      status: "available",
      amenities: ["WiFi", "TV", "AC"],
      maxOccupancy: 2,
      description: "Comfortable single room with queen bed",
    },
    {
      id: "2",
      number: "102",
      type: "double",
      price: 129,
      status: "occupied",
      amenities: ["WiFi", "TV", "AC", "Mini Fridge"],
      maxOccupancy: 4,
      description: "Spacious double room with two queen beds",
    },
    {
      id: "3",
      number: "201",
      type: "suite",
      price: 199,
      status: "available",
      amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Microwave", "Sofa"],
      maxOccupancy: 6,
      description: "Luxury suite with separate living area",
    },
    {
      id: "4",
      number: "202",
      type: "family",
      price: 159,
      status: "maintenance",
      amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Bunk Beds"],
      maxOccupancy: 6,
      description: "Family room with bunk beds for children",
    },
  ];

  const recentReservations = [];
  const reservations = [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className={'shadow-xl'}>
        <CardHeader>
          <CardTitle>وضعیت اتاق ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.slice(0, 6).map((room) => (
              <div key={room.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {room.number}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)}{" "}
                      اتاق
                    </p>
                    <p className="text-sm text-gray-500">${room.price}/night</p>
                  </div>
                </div>
                <Badge
                  variant={
                    room.status === "available"
                      ? "default"
                      : room.status === "occupied"
                      ? "destructive"
                      : room.status === "maintenance"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {room.status}
                </Badge>
              </div>
            ))}
            {rooms.length > 6 && (
              <Link href="/rooms">
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
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => {
                const room = rooms.find((r) => r.id === reservation.roomId);
                return (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{reservation.guestName}</p>
                      <p className="text-sm text-gray-500">
                        Room {room?.number} •{" "}
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        reservation.status === "confirmed"
                          ? "default"
                          : reservation.status === "checked-in"
                          ? "secondary"
                          : reservation.status === "checked-out"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">رزروی یافت نشد.</p>
            )}
            {reservations.length > 5 && (
              <Link href="/reservations">
                <Button variant="ghost" className="w-full">
                  View All Reservations ({reservations.length})
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
