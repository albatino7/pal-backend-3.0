import { createBrowserRouter } from "react-router-dom";
import queryClient from "./queryClient";
import urlApi from "../features/urls/api/urlApi";
import { urlKeys } from "../features/urls/hooks/useUrlQueries";

import RootLayout from "../features/ui/layouts/RootLayout";
import DashboardPage from "../features/urls/pages/DashboardPage";
import UrlDetailsPage from "../features/urls/pages/UrlDetailsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import NotFoundPage from "../features/ui/pages/NotFoundPage";
import ErrorPage from "../features/ui/pages/ErrorPage";

/**
 * Data Router Loader utilizing TanStack Query's ensureQueryData
 * This guarantees URL list data is prefetched before page renders,
 * providing instant transitions while keeping client components reactive.
 */
export const urlsLoader = async () => {
  return queryClient.ensureQueryData({
    queryKey: urlKeys.list(),
    queryFn: () => urlApi.getAllUrls(),
  });
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        loader: urlsLoader,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        loader: urlsLoader,
      },
      {
        path: "urls/:code",
        element: <UrlDetailsPage />,
        loader: urlsLoader,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
