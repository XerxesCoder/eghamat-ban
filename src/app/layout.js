import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { persianClerk } from "@/lib/clerkLocal";

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
    <ClerkProvider localization={persianClerk}>
      <html lang="fa-IR" dir="rtl">
        <body className={`${Vazir.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
