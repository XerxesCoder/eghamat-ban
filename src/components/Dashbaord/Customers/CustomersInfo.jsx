"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import moment from "moment-jalaali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Mail,
  Calendar,
  DollarSign,
  Download,
  User,
  TrendingUp,
  Star,
  X,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLodgeData } from "../DashbaordProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertToPersianDigits,
  updateReservationStatuses,
} from "@/lib/jalali";
import { reserveStatus } from "@/lib/roomsData";
import { getStatusColor } from "@/lib/badgeColors";
import { toast } from "sonner";

moment.loadPersian({ dialect: "persian-modern" });

const CustomersPage = () => {
  const { reservations } = useLodgeData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastVisit");
  const [expandedCardId, setExpandedCardId] = useState(null);
  const customers = useMemo(() => {
    const customerMap = {};
    const updatedRes = updateReservationStatuses(reservations);
    updatedRes.forEach((reservation) => {
      const phone = reservation.guest_phone;

      if (!customerMap[phone]) {
        customerMap[phone] = {
          id: reservation.id,
          phone,
          name: reservation.guest_name,
          totalBookings: 0,
          totalSpent: 0,
          lastVisit: reservation.check_in,
          firstVisit: reservation.check_in,
          averageBookingValue: 0,
          status: "new",
          reservations: [],
        };
      }

      const customer = customerMap[phone];
      customer.reservations.push(reservation);
      customer.totalBookings++;

      customer.totalSpent += reservation.total_price;

      const checkInDate = moment(reservation.check_in, "jYYYY/jM/jD");
      const lastVisitDate = moment(customer.lastVisit, "jYYYY/jM/jD");
      const firstVisitDate = moment(customer.firstVisit, "jYYYY/jM/jD");

      if (checkInDate.isAfter(lastVisitDate)) {
        customer.lastVisit = reservation.check_in;
      }
      if (checkInDate.isBefore(firstVisitDate)) {
        customer.firstVisit = reservation.check_in;
      }

      if (checkInDate.isSame(lastVisitDate)) {
        customer.name = reservation.guest_name;
      }
    });

    return Object.values(customerMap).map((customer) => {
      customer.averageBookingValue =
        customer.totalBookings > 0
          ? customer.totalSpent / customer.totalBookings
          : 0;

      if (
        Number(customer.totalSpent) >= 10000000 ||
        customer.totalBookings >= 5
      ) {
        customer.status = "vip";
      } else if (customer.totalBookings > 1) {
        customer.status = "returning";
      } else {
        customer.status = "new";
      }

      return customer;
    });
  }, [reservations]);

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === statusFilter
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "bookings":
          return b.totalBookings - a.totalBookings;
        case "spent":
          return b.totalSpent - a.totalSpent;
        case "lastVisit":
          return (
            moment(b.lastVisit, "jYYYY/jM/jD").valueOf() -
            moment(a.lastVisit, "jYYYY/jM/jD").valueOf()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, statusFilter, sortBy]);

  const exportCustomerData = () => {
    let csv = "گزارش مشتریان\n\n";
    csv +=
      "تلفن,نام,تعداد رزروها,مجموع هزینه,میانگین ارزش رزرو,اولین بازدید,آخرین بازدید,وضعیت\n";

    filteredCustomers.forEach((customer) => {
      csv += `${customer.phone},"${customer.name}",${customer.totalBookings},${
        customer.totalSpent
      },${customer.averageBookingValue.toFixed(2)},${customer.firstVisit},${
        customer.lastVisit
      },${
        customer.status === "new"
          ? "جدید"
          : customer.status === "returning"
          ? "دائمی"
          : "ویژه"
      }\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `گزارش-مشتریان-${moment().format("jYYYY-jMM-jDD")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.dismiss();
    toast.success("خروجی موفق", {
      description: "گزارش مشتریان با فرمت CSV دانلود شد.",
    });
  };

  const getUserStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "returning":
        return "bg-green-100 text-green-800";
      case "vip":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <UserPlus className="w-3 h-3" />;
      case "returning":
        return <TrendingUp className="w-3 h-3" />;
      case "vip":
        return <Star className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const totalCustomers = customers.length;
  const newCustomers = customers.filter((c) => c.status === "new").length;
  const returningCustomers = customers.filter(
    (c) => c.status === "returning"
  ).length;
  const vipCustomers = customers.filter((c) => c.status === "vip").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageCustomerValue =
    totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            مدیریت مشتریان
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            مدیریت پایگاه داده مشتریان و پیگیری روابط مهمانان
          </motion.p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={exportCustomerData}>
            <Download className="w-4 h-4 ml-2" />
            خروجی مشتریان
          </Button>
        </div>
      </motion.div>
      {/* Filters and Search */}
      <motion.div variants={item}>
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو بر اساس نام یا تلفن..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 pl-8"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] text-sm text-right">
                    <SelectValue placeholder="همه وضعیت‌ها" />
                  </SelectTrigger>
                  <SelectContent className="text-right" dir="rtl">
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="new">جدید</SelectItem>
                    <SelectItem value="returning">دائمی</SelectItem>
                    <SelectItem value="vip">ویژه</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] text-sm text-right">
                    <SelectValue placeholder="مرتب‌سازی بر اساس" />
                  </SelectTrigger>
                  <SelectContent className="text-right" dir="rtl">
                    <SelectItem value="lastVisit">آخرین بازدید</SelectItem>
                    <SelectItem value="name">نام</SelectItem>
                    <SelectItem value="bookings">تعداد رزروها</SelectItem>
                    <SelectItem value="spent">مجموع هزینه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Customer Statistics */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "تعداد مشتریان",
            value: totalCustomers,
            icon: <Users className="h-4 w-4 text-blue-600" />,
            subtitle: "شماره تلفن‌های منحصر به فرد",
            format: (val) => val.toLocaleString("fa-IR"),
          },
          {
            title: "مشتریان ویژه",
            value: vipCustomers,
            icon: <Star className="h-4 w-4 text-purple-600" />,
            subtitle: `${
              totalCustomers > 0
                ? Math.round((vipCustomers / totalCustomers) * 100)
                : 0
            }% از کل`,
            format: (val) => val.toLocaleString("fa-IR"),
          },
          {
            title: "مشتریان دائمی",
            value: returningCustomers,
            icon: <TrendingUp className="h-4 w-4 text-green-600" />,
            subtitle: `${
              totalCustomers > 0
                ? Math.round((returningCustomers / totalCustomers) * 100)
                : 0
            }% از کل`,
            format: (val) => val.toLocaleString("fa-IR"),
          },
          {
            title: "مشتریان جدید",
            value: newCustomers,
            icon: <UserPlus className="h-4 w-4 text-blue-600" />,
            subtitle: `${
              totalCustomers > 0
                ? Math.round((newCustomers / totalCustomers) * 100)
                : 0
            }% از کل`,
            format: (val) => `${val.toLocaleString("fa-IR")}`,
          },
        ].map((metric, i) => (
          <motion.div key={i} variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.format(metric.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* Customer List */}

      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {filteredCustomers.map((customer) => {
          const visibleReservations =
            expandedCardId == customer.id
              ? customer.reservations
              : customer.reservations.slice(0, 3);

          return (
            <motion.div key={customer.phone} variants={item}>
              <Card
                className={`py-0 ${
                  expandedCardId === customer.id ? "" : "h-[400px]"
                } overflow-hidden transition-all duration-300`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold text-lg">
                          {customer.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "flex items-center gap-1 text-white",
                        getUserStatusColor(customer.status)
                      )}
                    >
                      {getStatusIcon(customer.status)}
                      {customer.status === "new"
                        ? "جدید"
                        : customer.status === "returning"
                        ? "دائمی"
                        : "ویژه"}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-right">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        آخرین بازدید:{" "}
                        {convertToPersianDigits(
                          moment(customer.lastVisit, "jYYYY/jM/jD").format(
                            "jYYYY/jMM/jDD"
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>
                        {customer.totalBookings.toLocaleString("fa-IR")} رزرو
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>
                        مجموع: {customer.totalSpent.toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-4 border-t border-gray-200 text-sm text-right space-y-1">
                    <div>
                      <span className="text-gray-600">مشتری از: </span>
                      <span className="font-medium">
                        {convertToPersianDigits(
                          moment(customer.firstVisit, "jYYYY/jM/jD").format(
                            "jYYYY/jMM/jDD"
                          )
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        میانگین ارزش رزروها:{" "}
                      </span>
                      <span className="font-semibold">
                        {customer.averageBookingValue.toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </div>
                  </div>

                  {/* Recent Reservations */}
                  {customer.reservations.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 text-right">
                        رزروهای اخیر:
                      </h4>
                      <div className="space-y-1 text-right">
                        {visibleReservations
                          .sort(
                            (a, b) =>
                              moment(a.check_in, "jYYYY/jM/jD").valueOf() -
                              moment(b.check_in, "jYYYY/jM/jD").valueOf()
                          )
                          .map((reservation, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-xs text-gray-600"
                            >
                              <span>
                                {convertToPersianDigits(
                                  moment(
                                    reservation.check_in,
                                    "jYYYY/jM/jD"
                                  ).format("jYYYY/jMM/jDD")
                                )}
                              </span>
                              <span
                                className={cn(
                                  getStatusColor(reservation.status),
                                  "bg-transparent"
                                )}
                              >
                                {
                                  reserveStatus.find(
                                    (status) =>
                                      status.value ==
                                      String(reservation.status).toLowerCase()
                                  ).label
                                }
                              </span>
                              <span>
                                {reservation.total_price.toLocaleString(
                                  "fa-IR"
                                )}{" "}
                                تومان
                              </span>
                            </div>
                          ))}

                        {customer.reservations.length > 3 && (
                          <button
                            onClick={() =>
                              setExpandedCardId(
                                expandedCardId === customer.id
                                  ? null
                                  : customer.id
                              )
                            }
                            className="text-xs text-blue-500 hover:underline mt-1"
                          >
                            {expandedCardId === customer.id
                              ? "بستن لیست رزروها"
                              : `+${
                                  customer.reservations.length - 3
                                } رزرو بیشتر`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      {filteredCustomers.length === 0 && (
        <motion.div variants={item}>
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                مشتری یافت نشد
              </h3>
              <p className="text-gray-600 mb-4">
                {customers.length === 0
                  ? "داده مشتریان پس از ثبت رزروها در اینجا نمایش داده می‌شود."
                  : "معیارهای جستجو یا فیلتر خود را تغییر دهید."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomersPage;
