import { Link2, MousePointerClick, TrendingUp, Award } from "lucide-react";

export const UrlStatsCards = ({ stats }) => {
  const { totalUrls = 0, totalClicks = 0, averageClicks = 0, topUrl = null } = stats || {};

  const cards = [
    {
      title: "Total Links",
      value: totalUrls.toLocaleString(),
      subtitle: "Active shortened links",
      icon: Link2,
      color: "text-blue-600 bg-blue-50 ring-blue-100",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      subtitle: "Visitor click count",
      icon: MousePointerClick,
      color: "text-emerald-600 bg-emerald-50 ring-emerald-100",
    },
    {
      title: "Avg. Clicks",
      value: `${averageClicks}`,
      subtitle: "Per short URL",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 ring-indigo-100",
    },
    {
      title: "Top Link",
      value: topUrl ? `${topUrl.clicks} clicks` : "0 clicks",
      subtitle: topUrl ? `/${topUrl.shortCode}` : "No clicks yet",
      icon: Award,
      color: "text-amber-600 bg-amber-50 ring-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs transition hover:shadow-md"
          >
            <div className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ring-1 ${card.color}`}>
              <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
                {card.title}
              </p>
              <h3 className="truncate text-base sm:text-xl font-bold text-slate-800">
                {card.value}
              </h3>
              <p className="truncate text-[10px] sm:text-xs text-slate-500">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UrlStatsCards;
