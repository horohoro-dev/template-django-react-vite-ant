import { Navigate, Outlet } from "react-router-dom";
import { useBoundStore } from "@/stores";

/**
 * 認証が必要なルートを保護するコンポーネント
 *
 * 未認証の場合は /login にリダイレクトする
 */
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
