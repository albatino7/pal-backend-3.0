import UrlShortenerForm from "../components/UrlShortenerForm";
import RecentCreatedCard from "../components/RecentCreatedCard";
import UrlStatsCards from "../components/UrlStatsCards";
import UrlList from "../components/UrlList";
import useUrlShortener from "../hooks/useUrlShortener";
import useUrlFilter from "../hooks/useUrlFilter";
import { Sparkles, Shield, Zap, TrendingUp } from "lucide-react";

export const DashboardPage = () => {
  const { recentlyCreated, clearRecent } = useUrlShortener();
  const { stats } = useUrlFilter();

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 sm:pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 px-4 py-8 sm:px-12 sm:py-16 text-white shadow-xl">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-300" />
            <span>High Performance URL Engine</span>
          </div>

          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Shorten links. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-200 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Track conversions.
            </span>
          </h1>

          <p className="mx-auto mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-base text-blue-100/90 leading-relaxed">
            Create memorable, lightning-fast short links with instant redirection,
            built-in QR code generation, and live click tracking.
          </p>

          <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" /> Fast routing
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-300" /> Safe & verified
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-300" /> Live analytics
            </span>
          </div>
        </div>
      </section>

      {/* URL Shortener Form */}
      <section>
        <UrlShortenerForm />
      </section>

      {/* Just Generated Highlight Card */}
      {recentlyCreated && (
        <section>
          <RecentCreatedCard data={recentlyCreated} onDismiss={clearRecent} />
        </section>
      )}

      {/* Stats Cards */}
      <section>
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-800">
            Overview Metrics
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Live statistics across all links</p>
        </div>
        <UrlStatsCards stats={stats} />
      </section>

      {/* URL List */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-xl shadow-slate-200/30">
        <UrlList />
      </section>
    </div>
  );
};

export default DashboardPage;
