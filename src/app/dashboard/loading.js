export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screenpy-14 px-6 space-y-6">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-aqua-spark border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-aqua-spark rounded-full" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium text-deep-ocean">
          در حال بارگذاری...
        </h2>
        <p className="text-sm text-slate-500">لطفا شکیبا باشید</p>
      </div>
    </div>
  );
}
