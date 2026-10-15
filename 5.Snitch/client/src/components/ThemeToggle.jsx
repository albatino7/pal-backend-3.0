import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle({ variant = "compact", className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === "menu-row") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex w-full items-center justify-between px-4 py-3 rounded-lg border border-black/10 bg-black/5 transition hover:bg-black/10 ${className}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-ink">
          {isDark ? (
            <Sun size={16} className="text-lime" />
          ) : (
            <Moon size={16} className="text-ink/70" />
          )}
          <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
        </span>

        {/* Sliding toggle switch pill */}
        <span
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isDark ? "bg-lime" : "bg-black/20"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isDark ? "translate-x-5 !bg-ink" : "translate-x-0"
            }`}
          />
        </span>
      </button>
    );
  }

  // Default compact pill for desktop header
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition hover:border-ink hover:bg-ink hover:text-paper ${
        isDark ? "text-lime border-lime/30" : "text-ink/75"
      } ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <>
          <Sun size={14} className="text-lime animate-spin-slow" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon size={14} />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
