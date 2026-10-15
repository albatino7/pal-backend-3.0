import { ArrowUpRight } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-10">
        <Link to="/login" className="font-display text-[30px] font-black tracking-[-0.08em]">
          snitch<span className="text-lime">.</span>
        </Link>
        <nav className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.12em] sm:gap-9 sm:text-[11px] sm:tracking-[0.18em]">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
        </nav>
        <Link
          to="/register"
          className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-lime hover:text-ink sm:flex"
        >
          Join the club <ArrowUpRight size={14} />
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/45 sm:px-10">
        <span>© 2025 Snitch Studio</span>
        <span>Dress like you mean it.</span>
      </footer>
    </div>
  );
}
