import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../slices/uiSlice";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2 sm:max-w-md pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-100 shadow-emerald-950/50"
                : isError
                ? "border-rose-500/30 bg-rose-950/90 text-rose-100 shadow-rose-950/50"
                : "border-blue-500/30 bg-slate-900/90 text-slate-100 shadow-slate-950/50"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />}
              {isError && <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />}
            </div>

            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
