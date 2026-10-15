import { useDispatch } from "react-redux";
import { Sparkles, Copy, QrCode, ExternalLink, Check, X } from "lucide-react";
import useClipboard from "../hooks/useClipboard";
import { openQrModal } from "../../ui/slices/uiSlice";

export const RecentCreatedCard = ({ data, onDismiss }) => {
  const dispatch = useDispatch();
  const { copy, isCopied } = useClipboard();

  if (!data) return null;

  const shortCode = data.shortCode;
  const originalUrl = data.orignalUrl || data.originalUrl;
  const shortUrl = `http://localhost:3000/${shortCode}`;

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
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-6 text-white shadow-xl ring-1 ring-slate-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/20 blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            Just Generated
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 sm:mt-4 flex flex-col gap-3.5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Your Short Link</p>
          <div className="mt-1 flex items-center gap-2 min-w-0">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 font-mono text-base sm:text-xl font-bold text-blue-400 hover:text-blue-300 transition min-w-0 truncate"
            >
              <span className="truncate">{shortUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
            </a>
          </div>

          <p className="mt-1.5 truncate text-xs text-slate-400 min-w-0">
            <span className="text-slate-500 font-medium">Target:</span> {originalUrl}
          </p>
        </div>

        {/* Quick action buttons: full width responsive button row on mobile */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => copy(shortUrl, "Short URL")}
            className="flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-95"
          >
            {isCopied(shortUrl) ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenQr}
            className="flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-700 bg-slate-800/80 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:bg-slate-700 active:scale-95"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentCreatedCard;
