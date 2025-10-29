import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function PersianTimeInput({ value, onChange }) {
  return (
    <DatePicker
      disableDayPicker
      format="HH"
      value={value}
      locale={persian_fa}
      onChange={(date) => {
        console.log(date?.format("HH:mm"));
      }}
      plugins={[<TimePicker hideSeconds />]}
    />
  );
}
