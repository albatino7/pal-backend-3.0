import {
  ArrowUpRight,
  Heart,
  House,
  LogOut,
  ShoppingBag,
  Shirt,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLogout } from "../features/auth/hooks/useLogout";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";

const navItems = [
  { to: "/home", label: "Home", icon: House },
  { to: "/products", label: "Shop", icon: Shirt },
  { to: "/cart", label: "Your bag", icon: ShoppingBag },
];

export default function ProtectedLayout() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-black/[0.07] bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-10">
          <Link to="/home" className="font-display text-[30px] font-black tracking-[-0.08em]">
            snitch<span className="text-lime">.</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                    isActive ? "bg-ink text-white" : "text-ink/60 hover:bg-black/5 hover:text-ink"
                  }`
                }
              >
                <Icon size={14} strokeWidth={1.8} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-ink/45">
                Good to see you
              </span>
              <span className="block max-w-36 truncate text-xs font-bold">
                {user?.name || authUser?.name}
              </span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition hover:border-ink hover:bg-ink hover:text-white"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
        <nav className="flex justify-around border-t border-black/[0.06] px-3 py-2 md:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="mobile-nav-link">
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto min-h-[calc(100vh-77px)] max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12">
        <Outlet />
      </main>
      <footer className="flex items-center justify-center gap-2 border-t border-black/[0.07] py-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/45">
        <Heart size={12} /> Made for your everyday.
        <ArrowUpRight size={12} />
      </footer>
    </div>
  );
}
