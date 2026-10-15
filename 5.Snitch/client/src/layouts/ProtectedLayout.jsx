import {
  ArrowUpRight,
  Heart,
  House,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useLogout } from "../features/auth/hooks/useLogout";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useCart } from "../features/cart/hooks/useCart";
import ThemeToggle from "../components/ThemeToggle";

const baseNavItems = [
  { to: "/home", label: "Home", icon: House },
  { to: "/products", label: "Shop", icon: Shirt },
  { to: "/cart", label: "Your bag", icon: ShoppingBag },
  { to: "/orders", label: "My Orders", icon: Package },
];

export default function ProtectedLayout() {
  const authUser = useSelector((state) => state.auth.user);
  const { user } = useCurrentUser();
  const { totalItems } = useCart();
  const logout = useLogout();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeUser = user || authUser;
  const isSeller = activeUser?.role === "seller";

  const navItems = useMemo(
    () =>
      isSeller
        ? [...baseNavItems, { to: "/seller/dashboard", label: "Seller Hub", icon: Sparkles }]
        : baseNavItems,
    [isSeller]
  );

  // Close mobile drawer automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-paper text-ink transition-colors duration-200">
      <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link
            to="/home"
            className="font-display text-[28px] sm:text-[30px] font-black tracking-[-0.08em] select-none"
          >
            snitch<span className="text-lime">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "bg-ink text-paper shadow-sm"
                      : "text-ink/65 hover:bg-black/5 hover:text-ink"
                  }`
                }
              >
                <Icon size={14} strokeWidth={1.8} />
                {label}
                {to === "/cart" && totalItems > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-lime text-[9px] font-black text-ink">
                    {totalItems}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Desktop & Mobile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Theme Switcher */}
            <div className="hidden sm:block">
              <ThemeToggle variant="compact" />
            </div>

            {/* Desktop User Info */}
            <div className="hidden text-right lg:block">
              <span className="block text-[8px] uppercase tracking-[0.18em] text-ink/45">
                {isSeller ? "Merchant Account" : "Good to see you"}
              </span>
              <span className="flex items-center justify-end gap-1.5 max-w-36 truncate text-xs font-bold text-ink">
                {activeUser?.name}
                {isSeller && (
                  <span className="bg-lime text-ink px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider rounded-xs">
                    Seller
                  </span>
                )}
              </span>
            </div>

            {/* Desktop Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              <LogOut size={13} />
              <span>Log out</span>
            </button>

            {/* Mobile Direct Bag Shortcut with Live Counter */}
            <Link
              to="/cart"
              className="relative flex md:hidden size-10 items-center justify-center rounded-full border border-black/10 text-ink hover:bg-black/5 transition"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={17} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-lime text-[8px] font-black text-ink shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="flex md:hidden size-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Toggle Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] bg-paper/98 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl animate-fade-in">
            {/* User Profile Bar */}
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 block">
                  Logged in as
                </span>
                <span className="font-bold text-sm text-ink flex items-center gap-2 mt-0.5">
                  {activeUser?.name || "Member"}
                  {isSeller && (
                    <span className="bg-lime text-ink px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-xs">
                      Seller
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Dark / Light Mode Switch in Menu */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 block mb-2">
                Display Mode
              </span>
              <ThemeToggle variant="menu-row" />
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 block mb-2">
                Navigation
              </span>
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      isActive
                        ? "bg-ink text-paper shadow-sm"
                        : "text-ink/80 hover:bg-black/5 hover:text-ink"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} strokeWidth={2} />
                    {label}
                  </span>
                  {to === "/cart" && totalItems > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-black text-ink">
                      {totalItems}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile Logout Button */}
            <div className="border-t border-black/10 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          </div>
        )}
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

