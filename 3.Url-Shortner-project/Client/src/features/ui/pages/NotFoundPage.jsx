import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <FileQuestion className="h-8 w-8" />
      </div>

      <span className="mt-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
        404 ERROR
      </span>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
