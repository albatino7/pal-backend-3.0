import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Copy,
  QrCode,
  Trash2,
  ExternalLink,
  MousePointerClick,
  Calendar,
  Check,
  BarChart2,
} from "lucide-react";
import useClipboard from "../hooks/useClipboard";
import { openQrModal } from "../../ui/slices/uiSlice";

export const UrlCard = ({ item, onDelete, isDeleting }) => {
  const dispatch = useDispatch();
  const { copy, isCopied } = useClipboard();

  const shortCode = item.shortCode;
  const originalUrl = item.orignalUrl || item.originalUrl || "";
  const shortUrl = `http://localhost:3000/${shortCode}`;
  const clicks = item.clicks || 0;

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleOpenQr = () => {
    dispatch(
      openQrModal({
        shortCode,
        shortUrl,
        originalUrl,
      })
    );
  };

  return (
    <div className="group rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-3.5 sm:gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Info */}
        <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
          {/* Header Row: Short code badge + clicks + date */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-mono font-semibold text-blue-700">
              <span className="text-blue-400">/</span>
              {shortCode}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-slate-700">
              <MousePointerClick className="h-3 w-3 text-slate-500" />
              {clicks} {clicks === 1 ? "click" : "clicks"}
            </span>

            {formattedDate && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Short URL link */}
          <div className="flex items-center gap-2 min-w-0">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-sm sm:text-lg font-bold text-slate-900 transition hover:text-blue-600 hover:underline min-w-0 truncate"
              title="Click to visit redirect"
            >
              <span className="truncate">{shortUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-60 group-hover:opacity-100" />
            </a>
          </div>

          {/* Destination URL */}
          <div className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
            <span className="shrink-0 font-medium text-slate-400">Target:</span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate transition hover:text-slate-700 hover:underline min-w-0"
              title={originalUrl}
            >
              {originalUrl}
            </a>
          </div>
        </div>

        {/* Right Actions: Mobile-first 4-column grid, inline flex on desktop */}
        <div className="grid grid-cols-4 gap-1.5 border-t border-slate-100 pt-3 md:flex md:w-auto md:border-t-0 md:pt-0">
          {/* Copy Button */}
          <button
            onClick={() => copy(shortUrl, "Short link")}
            className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            title="Copy link to clipboard"
          >
            {isCopied(shortUrl) ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* QR Code Button */}
          <button
            onClick={handleOpenQr}
            className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            title="Show QR Code"
          >
            <QrCode className="h-3.5 w-3.5 text-slate-500" />
            <span>QR</span>
          </button>

          {/* Details / Analytics Button */}
          <Link
            to={`/urls/${shortCode}`}
            className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            title="Inspect link analytics"
          >
            <BarChart2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Info</span>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(shortCode)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-rose-200/80 bg-white px-2 sm:px-3 py-2 text-xs font-semibold text-rose-600 shadow-2xs transition hover:bg-rose-50 active:scale-95 disabled:opacity-50"
            title="Delete this link"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Del</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
