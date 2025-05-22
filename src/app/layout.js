import { Vazirmatn } from "next/font/google";
import "./globals.css";

const Vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
});

export const metadata = {
  title: "اقامت بان",
  description: "مدریت ساده و سریع برای اقامتگاه‌ها",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body className={`${Vazir.variable}`}>{children}</body>
    </html>
  );
}
