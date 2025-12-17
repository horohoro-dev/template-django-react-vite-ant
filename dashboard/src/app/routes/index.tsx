import { Flex, Spin } from "antd";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { ROUTES_PATHS } from "@/routes/paths";

const PostListPage = lazy(
  () => import("@/features/posts/components/PostListPage"),
);
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage"));

const PageLoading: React.FC = () => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Spin size="large" />
  </Flex>
);

const SuspenseWrapper: React.FC = () => (
  <Suspense fallback={<PageLoading />}>
    <Outlet />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES_PATHS.POSTS} replace />,
          },
          {
            element: <SuspenseWrapper />,
            children: [
              {
                path: ROUTES_PATHS.POSTS,
                element: <PostListPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
