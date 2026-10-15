import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  QrCode,
  MousePointerClick,
  Calendar,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useUrlsQuery } from "../hooks/useUrlQueries";
import useClipboard from "../hooks/useClipboard";
import { useDispatch } from "react-redux";
import { openQrModal } from "../../ui/slices/uiSlice";

export const UrlDetailsPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { copy, isCopied } = useClipboard();

  const { data: urls = [], isLoading, refetch } = useUrlsQuery();

  const item = urls.find((u) => u.shortCode === code);
  const shortUrl = `http://localhost:3000/${code}`;

  const handleTestRedirect = () => {
    window.open(shortUrl, "_blank", "noopener,noreferrer");
    // After redirecting via server, refetch in 1.2 seconds to update click count
    setTimeout(() => {
      refetch();
    }, 1200);
  };

  const handleOpenQr = () => {
    if (!item) return;
    dispatch(
      openQrModal({
        shortCode: code,
        shortUrl,
        originalUrl: item.orignalUrl || item.originalUrl,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>Loading URL details...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Short Link Not Found</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          We could not find a shortened link matching code{" "}
          <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-blue-600">
            /{code}
          </code>
          . It may have been deleted.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const originalUrl = item.orignalUrl || item.originalUrl || "";
  const createdDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently created";

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 pb-12 sm:pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>

      {/* Main detail card */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 sm:pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-700">
                /{item.shortCode}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </div>
            <h1 className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Link Details & Diagnostics
            </h1>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenQr}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </button>
            <button
              onClick={() => copy(shortUrl, "Short URL")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              {isCopied(shortUrl) ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* URLs Overview */}
        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200/70">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Shortened URL (Public)
            </p>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-base sm:text-lg font-bold text-blue-600 hover:underline truncate min-w-0"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleTestRedirect}
                className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs ring-1 ring-slate-200 hover:bg-slate-50 w-full sm:w-auto"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Test Click
              </button>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200/70">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
              Original Destination URL
            </p>
            <div className="mt-1 flex items-center justify-between gap-2 min-w-0">
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-slate-800 hover:text-blue-600 hover:underline truncate min-w-0"
              >
                {originalUrl}
              </a>
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-slate-400 hover:text-slate-600 p-1"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Analytics Breakdown */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <MousePointerClick className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Total Clicks
              </span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {item.clicks || 0}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">
              Increments on every visit
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Created
              </span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold text-slate-800">
              {createdDate}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">
              Registered in database
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Routing Status
              </span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold text-emerald-600">
              302 Found (OK)
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">
              Direct HTTP server redirect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlDetailsPage;
