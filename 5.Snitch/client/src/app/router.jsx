import { createBrowserRouter, redirect } from "react-router-dom";
import { store } from "./store";
import { restoreSession } from "../features/auth/authSlice";
import AuthPage from "../features/auth/pages/AuthPage";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import CartPage from "../features/cart/pages/CartPage";
import OrdersPage from "../features/cart/pages/OrdersPage";
import HomePage from "../features/store/pages/HomePage";
import ProductsPage from "../features/products/pages/ProductsPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import SellerDashboardPage from "../features/products/pages/SellerDashboardPage";

function SessionLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/55">
        Checking your session...
      </p>
    </div>
  );
}

async function requireSession() {
  const { auth } = store.getState();

  if (!auth.initialized) {
    await store.dispatch(restoreSession());
  }

  if (!store.getState().auth.accessToken) {
    throw redirect("/login");
  }

  return null;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <AuthPage mode="login" /> },
      { path: "/register", element: <AuthPage mode="register" /> },
    ],
  },
  {
    path: "/",
    loader: requireSession,
    HydrateFallback: SessionLoading,
    element: <ProtectedLayout />,
    children: [
      { index: true, loader: () => redirect("/home") },
      { path: "home", element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "seller/dashboard", element: <SellerDashboardPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
  { path: "*", loader: () => redirect("/home") },
]);
