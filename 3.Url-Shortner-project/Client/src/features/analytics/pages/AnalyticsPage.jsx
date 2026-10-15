import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Award,
  ArrowRight,
} from "lucide-react";
import { useUrlsQuery } from "../../urls/hooks/useUrlQueries";
import { UrlStatsCards } from "../../urls/components/UrlStatsCards";
import { useUrlFilter } from "../../urls/hooks/useUrlFilter";

export const AnalyticsPage = () => {
  const { data: urls = [], isLoading } = useUrlsQuery();
  const { stats } = useUrlFilter();

  // Sort by clicks descending
  const sortedUrls = [...urls].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const maxClicks = Math.max(...urls.map((u) => u.clicks || 0), 1);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 sm:pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Performance Analytics
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time link activity, engagement ratios, and click distributions.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <span>Shorten New Link</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Global Stats */}
      <UrlStatsCards stats={stats} />

      {/* Click Distribution Chart & Leaderboard */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Top 5 Visual Distribution */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Click Distribution
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400">Relative performance</span>
          </div>

          {isLoading ? (
            <div className="space-y-4 pt-5 sm:pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : sortedUrls.length === 0 ? (
            <p className="pt-8 text-center text-xs sm:text-sm text-slate-400">
              No URL performance data available yet.
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
              {sortedUrls.slice(0, 7).map((item) => {
                const percentage = Math.round(((item.clicks || 0) / maxClicks) * 100);
                return (
                  <div key={item._id || item.shortCode} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
                        <span className="font-mono font-semibold text-blue-600 shrink-0">
                          /{item.shortCode}
                        </span>
                        <span className="truncate text-slate-400 min-w-0">
                          {item.orignalUrl || item.originalUrl}
                        </span>
                      </div>
                      <span className="shrink-0 font-bold text-slate-800 text-[11px] sm:text-xs">
                        {item.clicks || 0} ({percentage}%)
                      </span>
                    </div>

                    {/* Progress meter bar */}
                    <div className="h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard summary card */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 sm:pb-4">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Top Ranked</h2>
          </div>

          {isLoading ? (
            <div className="pt-4 sm:pt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-11 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : sortedUrls.length === 0 ? (
            <p className="pt-8 text-center text-xs sm:text-sm text-slate-400">
              Generate links to view ranking.
            </p>
          ) : (
            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
              {sortedUrls.slice(0, 5).map((item, index) => (
                <Link
                  key={item._id || item.shortCode}
                  to={`/urls/${item.shortCode}`}
                  className="flex items-center justify-between rounded-xl p-2 transition hover:bg-slate-50 border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <span
                      className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-700"
                          : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : index === 2
                          ? "bg-amber-700/20 text-amber-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-bold text-slate-900 truncate">
                        /{item.shortCode}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                        {item.orignalUrl || item.originalUrl}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-600">
                      {item.clicks || 0}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block">clicks</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
