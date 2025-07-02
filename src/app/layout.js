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
  metadataBase: new URL("https://eghamatban.ir"),

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
    "مدیریت اقامتگاه",
    "نرم افزار هتل",
    "سیستم رزرواسیون آنلاین",
    "مدیریت مهمانسرا",
    "برنامه هتلداری",
    "نرم افزار ایرانی",
    "سامانه مدیریت اقامتگاه",
    "یکپارچه‌سازی هتلداری",
    "مدیریت اتاق‌ها",
    "برنامه رزرواسیون",
    "نرم افزار رایگان هتل",
    "سامانه اقامتگاه",
    "مدیریت مالی اقامتگاه",
    "تقویم اتاق‌ها",
    "گزارش‌ گیری هوشمند",
  ],
  openGraph: {
    title: "اقامت بان",
    description: "مدیریت هوشمند اقامتگاه‌ها",
    url: "https://eghamatban.ir",
    siteName: "اقامت بان",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://eghamatban.ir/opengraph-image.png",
        width: 800,
        height: 400,
        alt: "اقامت بان - مدیریت هوشمند اقامتگاه‌ها",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اقامت بان",
    description: "مدیریت هوشمند اقامتگاه‌ها",
    url: "https://eghamatban.ir",
    images: ["https://eghamatban.ir/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nocache: false,
    noimageindex: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    bingBot: {
      index: true,
      follow: true,
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
