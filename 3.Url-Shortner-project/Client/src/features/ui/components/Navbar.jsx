import { NavLink, Link } from "react-router-dom";
import { Link2, BarChart3, LayoutDashboard, Globe } from "lucide-react";
import { useUrlsQuery } from "../../urls/hooks/useUrlQueries";

export const Navbar = () => {
  const { data: urls = [] } = useUrlsQuery();
  const totalCount = Array.isArray(urls) ? urls.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-2.5 transition shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Snap<span className="text-blue-600">Link</span>
              </span>
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Pro
              </span>
            </div>
            <p className="hidden sm:block text-[11px] font-medium text-slate-400">
              Modern URL Shortener
            </p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Analytics</span>
          </NavLink>
        </nav>

        {/* Status / Quick info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-800">{totalCount}</span>
            <span className="hidden sm:inline">links</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>Online</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
