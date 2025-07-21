import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-20 sm:py-14 px-6 space-y-6">
      <Image src="/assets/logo.png" alt="اقامت بان" width={150} height={150} className="rounded-2xl" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium text-deep-ocean">
          صحفه مورد نظر پیدا نشد
        </h2>
        <div className="flex space-x-4 mt-5">
          <Button>
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
          <Button variant={"secondary"}>
            <Link href="/dashboard">بازگشت به داشبورد </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
