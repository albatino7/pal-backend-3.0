import { Link2, ShieldCheck, Zap } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 sm:py-8 text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:gap-4 px-4 text-center sm:text-left sm:flex-row sm:px-6">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Link2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              SnapLink Pro
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400">
            • React 19 • Redux Toolkit • TanStack Query
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Reliable
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Instant Redirects
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
