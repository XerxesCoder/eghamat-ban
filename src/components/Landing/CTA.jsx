import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-aqua-spark to-lime-zest w-full">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-deep-ocean">
              <span className="block">۱۴ روز رایگان امتحان کنید</span>
            </h2>
            <p className="max-w-[600px] text-deep-ocean/80 md:text-xl/relaxed">
              بدون نیاز به کارت بانکی. همین امروز مدیریت هوشمند را شروع کنید
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="bg-deep-ocean text-white hover:bg-deep-ocean/90 hover:scale-105 transition-all shadow-lg h-12 px-8">
              شروع دوره آزمایشی رایگان
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-deep-ocean text-deep-ocean bg-white/80 hover:bg-white h-12 px-6"
            >
              تماس با پشتیبانی
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
