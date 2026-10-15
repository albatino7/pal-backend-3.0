import { useRouteError, Link } from "react-router-dom";
import { AlertOctagon, RotateCw, Home } from "lucide-react";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error("Router boundary caught error:", error);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertOctagon className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Something went wrong
      </h1>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {error?.statusText || error?.message || "An unexpected error occurred in the application."}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <RotateCw className="h-4 w-4" />
          Reload Application
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
