export const CardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>
          <div className="h-6 w-3/4 rounded-md bg-slate-200" />
          <div className="h-4 w-1/2 rounded-md bg-slate-100" />
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <div className="h-9 w-20 rounded-xl bg-slate-200" />
          <div className="h-9 w-20 rounded-xl bg-slate-200" />
          <div className="h-9 w-9 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
        >
          <div className="h-4 w-16 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-24 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
