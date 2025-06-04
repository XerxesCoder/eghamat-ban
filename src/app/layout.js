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
  description: "مدیریت هوشمند اقامتگاه‌ها",
  category: "webapp",
  creator: "Xerxes Coder",
  keywords: [
    "سیستم مدیریت اقامتگاه",
    "نرم افزار مدیریت مهمانسرا",
    "برنامه مدیریت هتل و مسافرخانه",
    "نرم افزار رزرواسیون اقامتگاه",
    "سامانه مدیریت هتل",

    "مدیریت آنلاین رزرواسیون",
    "نرم افزار مالی هتل",
    "سیستم مدیریت مشتریان هتل",
    "برنامه مدیریت اتاق‌های هتل",
    "تقویم رزرواسیون آنلاین",

    "افزایش درآمد هتل",
    "کاهش خطاهای دستی",
    "مدیریت آسان اقامتگاه",
    "گزارش‌گیری هوشمند هتل",
    "سیستم یکپارچه مدیریت هتل",

    "نرم افزار رایگان مدیریت هتل",
    "سیستم مدیریت اقامتگاه بدون هزینه",
    "برنامه مدیریت مهمانپذیر رایگان",
    "سامانه هتل داری رایگان",
    "نرم افزار مدیریت مسافرخانه رایگان",

    "بهترین نرم افزار مدیریت هتل ایرانی",
    "سیستم مدیریت آنلاین رزرواسیون هتل",
    "برنامه مدیریت مالی مهمانسرا",
    "نرم افزار مدیریت اقامتگاه با تقویم",
    "سیستم گزارش‌گیری هتل آنلاین",
    "جایگزین سیستم هتلینگ",
    "بهتر از اکسل برای مدیریت هتل",
    "نرم افزار مدیریت هتل ارزان",
    "دانلود نرم افزار مدیریت هتل",
    "ثبت نام سیستم مدیریت اقامتگاه",
    "راه اندازی سامانه رزرواسیون",
  ],
  openGraph: {
    title: "اقامت بان",
    description: "مدیریت هوشمند اقامتگاه‌ها",
    //url: 'https://nextjs.org',
    siteName: "اقامت بان",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "اقامت بان",
    description: "مدیریت هوشمند اقامتگاه‌ها",
    //url: 'https://nextjs.org',
    /*       siteId: '1467726470533754880',
      creator: '@nextjs',
      creatorId: '1467726470533754880',
      images: ['https://nextjs.org/og.png'], // Must be an absolute UR */ L,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={persianClerk} afterSignOutUrl="/">
      <html lang="fa-IR" dir="rtl">
        <body className={`${Vazir.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
