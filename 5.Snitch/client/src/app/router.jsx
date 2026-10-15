import { lazy, Suspense } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import { store } from "./store";
import { restoreSession } from "../features/auth/authSlice";
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";

// Route-level code-splitting
const AuthPage = lazy(() => import("../features/auth/pages/AuthPage"));
const HomePage = lazy(() => import("../features/store/pages/HomePage"));
const ProductsPage = lazy(() => import("../features/products/pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("../features/products/pages/ProductDetailPage"));
const SellerDashboardPage = lazy(() => import("../features/products/pages/SellerDashboardPage"));
const CartPage = lazy(() => import("../features/cart/pages/CartPage"));
const OrdersPage = lazy(() => import("../features/cart/pages/OrdersPage"));

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-7 animate-spin rounded-full border-2 border-black/15 border-t-ink" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/45">
          Loading...
        </span>
      </div>
    </div>
  );
}

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
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthPage mode="login" />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthPage mode="register" />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    loader: requireSession,
    HydrateFallback: SessionLoading,
    element: <ProtectedLayout />,
    children: [
      { index: true, loader: () => redirect("/home") },
      {
        path: "home",
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: "products/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: "seller/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SellerDashboardPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrdersPage />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", loader: () => redirect("/home") },
]);
