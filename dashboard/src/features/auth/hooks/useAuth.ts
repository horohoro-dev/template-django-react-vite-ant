import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, axiosInstance } from "@/lib/axios";
import { ROUTES_PATHS } from "@/routes/paths";
import { useBoundStore } from "@/stores";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Zustand統合ストアから認証関連の状態とアクションを取得
  const login = useBoundStore((state) => state.login);
  const logout = useBoundStore((state) => state.logout);
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get JWT token
      const tokenResponse = await axiosInstance.post(
        `${API_BASE_URL}/api/token/`,
        credentials,
      );
      const { access, refresh } = tokenResponse.data;

      // Set token temporarily to fetch user info
      localStorage.setItem("access_token", access);

      // Get user info
      const userResponse = await axiosInstance.get(
        `${API_BASE_URL}/api/dashboard/users/me/`,
      );
      const user = userResponse.data;

      // Store auth info
      login(access, refresh, user);
      navigate(ROUTES_PATHS.POSTS);
    } catch (_err) {
      setError("Invalid email or password");
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES_PATHS.LOGIN);
  };

  return {
    isLoading,
    error,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
