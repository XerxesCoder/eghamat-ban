import moment from "moment-jalaali";

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
