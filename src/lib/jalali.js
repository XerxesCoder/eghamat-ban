import moment from "moment-jalaali";
import { toast } from "sonner";

export const persianDate = moment().format("jYYYY/jM/jD");
export const persianDateWithTime = moment().format("jYYYY/jM/jD HH:mm:ss");

/*
  ??? Date Formats
*/
export const fullPersianDate = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  dateStyle: "full",
  timeStyle: "short",
}).format();

export const persianTodayNumber = new Intl.DateTimeFormat(
  "fa-IR-u-ca-persian",
  { day: "numeric" }
).format();
export const persianTodayName = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
}).format();
export const persianMonthName = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "short",
}).format();
export const persianMonthNumber = new Intl.DateTimeFormat(
  "fa-IR-u-ca-persian",
  {
    month: "numeric",
  }
).format();
export const persianYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
}).format();

export const persianTime = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  timeStyle: "full",
}).format();

export function convertToPersianDigits(input) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return input.replace(/\d/g, (d) => persianDigits[d]);
}

export const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const weekDays = ["ی", "د", "س", "چ", "پ", "ج", "ش"];

export const convertToEnglishDigits = (str) => {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

export const checkRoomAvailability = (newReservation, existingReservations) => {
  const newCheckIn = moment(
    convertToEnglishDigits(newReservation.checkIn),
    "jYYYY/jMM/jDD"
  );

  const newCheckOut = moment(
    convertToEnglishDigits(newReservation.checkOut),
    "jYYYY/jMM/jDD"
  );

  if (!newCheckIn.isValid() || !newCheckOut.isValid()) {
    toast.warning("فرمت تاریخ وارد شده نامعتبر است");
    return false;
  }

  if (newCheckOut.isSameOrBefore(newCheckIn)) {
    toast.warning("تاریخ خروج باید بعد از تاریخ ورود باشد");
    return false;
  }

  for (const reservation of existingReservations) {
    if (reservation.room_id === newReservation.roomId) {
      const existingCheckIn = moment(reservation.check_in, "jYYYY-jMM-jDD");
      const existingCheckOut = moment(reservation.check_out, "jYYYY-jMM-jDD");

      if (
        (newCheckIn.isSameOrAfter(existingCheckIn) &&
          newCheckIn.isBefore(existingCheckOut)) ||
        (newCheckOut.isAfter(existingCheckIn) &&
          newCheckOut.isSameOrBefore(existingCheckOut)) ||
        (newCheckIn.isBefore(existingCheckIn) &&
          newCheckOut.isAfter(existingCheckOut))
      ) {
        toast.warning(`اتاق در تاریخ مورد نظر شما رزرو شده است `, {
          description: `${reservation.guest_name} - ${reservation.check_in} تا ${reservation.check_out}`,
        });
        return false;
      }
    }
  }

  return true;
};

export const validateReservationDates = (checkIn, checkOut) => {
  const currentDate = moment(persianDate, "jYYYY/jMM/jDD");
  const checkInDate = moment(convertToEnglishDigits(checkIn), "jYYYY/jMM/jDD");
  const checkOutDate = moment(
    convertToEnglishDigits(checkOut),
    "jYYYY/jMM/jDD"
  );

  if (!checkInDate.isValid() || !checkOutDate.isValid()) {
    toast.warning("فرمت تاریخ وارد شده نامعتبر است");
    return false;
  }

  if (checkInDate.isBefore(currentDate, "day")) {
    toast.warning("تاریخ ورود نباید قبل از تاریخ امروز باشد");
    return false;
  }

  if (checkOutDate.isSameOrBefore(checkInDate, "day")) {
    toast.warning("تاریخ خروج باید بعد از تاریخ ورود باشد");
    return false;
  }

  if (checkOutDate.diff(checkInDate, "days") < 1) {
    toast.warning("حداقل مدت اقامت باید یک روز باشد");
    return false;
  }

  return true;
};

export function getJalaliDateDifference(startDate, endDate) {
  const mStart = moment(convertToEnglishDigits(startDate), "jYYYY/jMM/jDD");
  const mEnd = moment(convertToEnglishDigits(endDate), "jYYYY/jMM/jDD");

  return mEnd.diff(mStart, "days");
}

export const generateMonthlyAvailability = (
  jYearMonth,
  reservations,
  roomIds
) => {
  const monthStart = moment(jYearMonth, "jYYYY/jMM").startOf("jMonth");
  const monthEnd = moment(jYearMonth, "jYYYY/jMM").endOf("jMonth");
  const daysInMonth = monthStart.daysInMonth();

  const availability = {};
  roomIds.forEach((roomId) => {
    availability[roomId] = {
      room_id: roomId,
      available_days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      occupied_days: [],
      partially_occupied_days: [],
      reservations: [],
    };
  });

  // Process each reservation
  reservations.forEach((reservation) => {
    const roomId = reservation.room_id;

    if (roomIds.includes(roomId)) {
      const checkIn = moment(reservation.check_in, "jYYYY/jMM/jDD");
      const checkOut = moment(reservation.check_out, "jYYYY/jMM/jDD");

      // Skip if reservation doesn't overlap with this month at all
      if (
        checkOut.isBefore(monthStart, "day") ||
        checkIn.isAfter(monthEnd, "day")
      ) {
        return;
      }

      // Determine which days in this month are occupied by this reservation
      const occupiedDays = [];
      const startDay = checkIn.isBefore(monthStart) ? 1 : checkIn.jDate();
      const endDay = checkOut.isAfter(monthEnd)
        ? daysInMonth
        : checkOut.jDate();

      // Mark each occupied day
      for (let day = startDay; day <= endDay; day++) {
        // Don't count check-out day as occupied (unless it's past midnight)
        if (day < endDay || (day === endDay && checkOut.hour() > 12)) {
          occupiedDays.push(day);
        }
      }

      // Update the room's availability
      availability[roomId].occupied_days = [
        ...new Set([...availability[roomId].occupied_days, ...occupiedDays]),
      ];
      availability[roomId].available_days = availability[
        roomId
      ].available_days.filter((d) => !occupiedDays.includes(d));

      // Add reservation info
      availability[roomId].reservations.push({
        id: reservation.id,
        guest_name: reservation.guest_name,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        occupied_days: occupiedDays,
      });
    }
  });

  return {
    month: jYearMonth,
    days_in_month: daysInMonth,
    rooms: Object.values(availability),
  };
};

export const updateReservationStatuses = (reservations) => {
  const today = moment().format("jYYYY/jM/jD");
  const todayMoment = moment(today, "jYYYY/jM/jD");

  return reservations.map((reservation) => {
    const checkInDate = moment(reservation.check_in, "jYYYY/jMM/jDD").format(
      "jYYYY/jM/jD"
    );
    const checkOutDate = moment(reservation.check_out, "jYYYY/jMM/jDD").format(
      "jYYYY/jM/jD"
    );
    const checkInMoment = moment(checkInDate, "jYYYY/jM/jD");
    const checkOutMoment = moment(checkOutDate, "jYYYY/jM/jD");

    if (checkInMoment.isSame(todayMoment, "day")) {
      return {
        ...reservation,
        status: "CHECKED_IN",
        updated_at: new Date().toISOString(),
      };
    } else if (checkOutMoment.isSame(todayMoment, "day")) {
      return {
        ...reservation,
        status: "ENDED",
        updated_at: new Date().toISOString(),
      };
    } else if (checkOutMoment.isBefore(todayMoment, "day")) {
      return {
        ...reservation,
        status: "OUTDATED",
        updated_at: new Date().toISOString(),
      };
    } else if (
      todayMoment.isAfter(checkInMoment, "day") &&
      todayMoment.isBefore(checkOutMoment, "day")
    ) {
      return {
        ...reservation,
        status: "STAY",
        updated_at: new Date().toISOString(),
      };
    }

    return reservation;
  });
};

export function getDetailedTodayMovements(reservations) {
  const today = moment().format("jYYYY/jM/jD");

  const result = {
    checkingIn: {
      guestCount: 0,
      roomCount: 0,
      reservations: [],
      rooms: [],
    },
    checkingOut: {
      guestCount: 0,
      roomCount: 0,
      reservations: [],
      rooms: [],
    },
    staying: {
      guestCount: 0,
      roomCount: 0,
      reservations: [],
      rooms: [],
    },
  };

  const updateCategory = (category, reservation) => {
    const adults = reservation.adults || 1;
    const roomId = reservation.room_id;

    category.guestCount += adults;
    category.reservations.push(reservation);
    if (!category.rooms.includes(roomId)) {
      category.rooms.push(roomId);
      category.roomCount++;
    }
  };

  reservations.forEach((reservation) => {
    const checkIn = reservation.check_in;
    const checkOut = reservation.check_out;
    const mCheckIn = moment(checkIn, "jYYYY/jM/jD");
    const mCheckOut = moment(checkOut, "jYYYY/jM/jD");
    const mToday = moment(today, "jYYYY/jM/jD");

    if (checkIn === today) {
      updateCategory(result.checkingIn, reservation);
    }
    if (checkOut === today) {
      updateCategory(result.checkingOut, reservation);
    }
    if (mToday.isAfter(mCheckIn) && mToday.isBefore(mCheckOut)) {
      updateCategory(result.staying, reservation);
    }
  });

  return result;
}
export function sortByCheckInDateDesc(data) {
  function parseJalaliDate(dateStr) {
    const normalized = dateStr.replace(/[\/\-]/g, "/");

    const m = moment(dateStr, "jYYYY/jM/jD", "fa");
    if (!m.isValid()) {
      console.warn(`Invalid date format: ${dateStr}`);
      return moment.invalid();
    }
    return m;
  }
  return [...data].sort((a, b) => {
    const dateA = parseJalaliDate(a.check_in);
    const dateB = parseJalaliDate(b.check_in);

    if (dateA.isAfter(dateB)) return -1;
    if (dateA.isBefore(dateB)) return 1;
    return 0;
  });
}
