import { Link2Off, SearchX } from "lucide-react";

export const EmptyState = ({ isSearch = false, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {isSearch ? <SearchX className="h-7 w-7 text-slate-500" /> : <Link2Off className="h-7 w-7 text-slate-500" />}
      </div>

      <h3 className="text-lg font-semibold text-slate-800">
        {isSearch ? "No matching links found" : "No links generated yet"}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        {isSearch
          ? "Try adjusting your search query or reset filters to see all available URLs."
          : "Paste a long destination URL into the generator above to create your first trackable short link!"}
      </p>

      {isSearch && onReset && (
        <button
          onClick={onReset}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
