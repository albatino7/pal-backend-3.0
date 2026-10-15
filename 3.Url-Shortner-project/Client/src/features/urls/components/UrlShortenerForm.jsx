import { Link2, Sparkles, Clipboard, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import useUrlShortener from "../hooks/useUrlShortener";

export const UrlShortenerForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    handlePaste,
  } = useUrlShortener();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl shadow-slate-200/40 sm:rounded-3xl sm:p-8">
      {/* Decorative gradient blur */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative">
        {/* Form header */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-blue-700">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Fast & Free Link Shortening
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shorten a long link
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Paste your destination URL below to generate a compact, trackable link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
            {/* Input field */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-3.5 top-3.5 sm:left-4 sm:top-4 text-slate-400">
                <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <input
                {...register("url", {
                  required: "Please enter a destination URL",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,63})([/\w .-]*)*\/?(\?.*)?(#.*)?$/i,
                    message: "Please enter a valid web URL (e.g. https://example.com)",
                  },
                })}
                type="url"
                placeholder="https://example.com/very/long/destination/path..."
                disabled={isLoading}
                className={`w-full rounded-xl sm:rounded-2xl border py-3 sm:py-3.5 pl-10 pr-20 sm:pl-12 sm:pr-24 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition ${
                  errors.url
                    ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-300 bg-slate-50/50 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />

              {/* Paste button inside input */}
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="absolute right-2 top-2 sm:right-3 sm:top-2.5 flex items-center gap-1 rounded-lg sm:rounded-xl bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-600 shadow-xs ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              >
                <Clipboard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Paste</span>
              </button>
            </div>

            {/* Submit button - Full width on mobile, inline on desktop */}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 sm:h-13 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 sm:px-7 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95 hover:shadow-blue-500/35 active:scale-98 disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Validation Error Message */}
          {errors.url && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 animate-in fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.url.message}</span>
            </div>
          )}

          {/* Tips */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-x-6 text-[11px] sm:text-xs text-slate-400">
            <span>✨ Automatic protocol prefixing (`https://`)</span>
            <span>⚡ Instant redirect resolution</span>
            <span>📊 Live click tracking enabled</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UrlShortenerForm;
