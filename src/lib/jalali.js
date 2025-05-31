import moment from "moment-jalaali";
import { toast } from "sonner";

export const persianDate = moment().format("jYYYY/jM/jD");
export const persianDateWithTime = moment().format("jYYYY/jM/jD HH:mm:ss");

export function getJalaliDateDifference(startDate, endDate) {
  const mStart = moment(startDate, "jYYYY/jMM/jDD");
  const mEnd = moment(endDate, "jYYYY/jMM/jDD");

  return mEnd.diff(mStart, "days");
}

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

export const checkRoomAvailability = (newReservation, existingReservations) => {
  const newCheckIn = moment(newReservation.checkIn, "jYYYY-jMM-jDD");
  const newCheckOut = moment(newReservation.checkOut, "jYYYY-jMM-jDD");

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
  const currentDate = moment(persianDate, "jYYYY-jMM-jDD");
  const checkInDate = moment(checkIn, "jYYYY-jMM-jDD");
  const checkOutDate = moment(checkOut, "jYYYY-jMM-jDD");

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
    if (["ENDED", "OUTDATED", "CHECKED_IN"].includes(reservation.status)) {
      return reservation;
    }

    // Parse dates
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
    }

    return reservation;
  });
};

export function getDetailedTodayMovements(reservations) {
  const today = moment().format("jYYYY/jM/jD");

  const result = {
    checkingIn: {
      count: 0,
      reservations: [],
      guests: 0,
    },
    checkingOut: {
      count: 0,
      reservations: [],
      guests: 0,
    },
  };

  reservations.forEach((reservation) => {
    const adults = reservation.adults || 1;

    if (reservation.check_in === today) {
      result.checkingIn.count++;
      result.checkingIn.guests += adults;
      result.checkingIn.reservations.push(reservation);
    }

    if (reservation.check_out === today) {
      result.checkingOut.count++;
      result.checkingOut.guests += adults;
      result.checkingOut.reservations.push(reservation);
    }
  });

  return result;
}
