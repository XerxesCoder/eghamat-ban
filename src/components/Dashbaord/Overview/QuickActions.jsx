"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Upload, CalendarDays, Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  return (
    <Card className="mt-4 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">عملیات سریع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            asChild
          >
            <Link href="/dashboard/rooms">
              <PlusCircle className="h-5 w-5 mb-1" />
              <span>اضافه کردن اتاق</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            asChild
          >
            <Link href="/dashboard/reservation">
              <CalendarDays className="h-5 w-5 mb-1" />
              <span>رزرو جدید</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            asChild
          >
            <Link href="/dashboard/calendar">
              <Calendar className="h-5 w-5 mb-1" />
              <span>تقویم سکونت</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            asChild
          >
            <Link href="/dashboard/lodge">
              <Hotel className="h-5 w-5 mb-1" />
              <span>اقامتگاه</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
