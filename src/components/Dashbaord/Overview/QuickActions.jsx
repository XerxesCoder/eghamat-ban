"use client";

import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Calendar,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  const router = useRouter();

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [exportData, setExportData] = useState("");
  const exportTextAreaRef = useRef(null);
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
              <Calendar className="h-5 w-5 mb-1" />
              <span>رزرو جدید</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            //onClick={handleExport}
          >
            <Download className="h-5 w-5 mb-1" />
            <span>دانلود دیتا</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center shadow-lg"
            asChild
          >
            <Link href="/dashboard/lodge">
              <Upload className="h-5 w-5 mb-1" />
              <span>اقامتگاه</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
