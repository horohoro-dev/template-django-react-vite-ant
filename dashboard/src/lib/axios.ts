import Axios, { type AxiosError, type AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_VERSION = "v0";

export const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor - Add JWT token to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await Axios.post(
            `${API_BASE_URL}/api/${API_VERSION}/token/refresh/`,
            {
              refresh: refreshToken,
            },
          );
          const { access } = response.data;
          localStorage.setItem("access_token", access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Custom instance for orval
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstance({
    ...config,
  }).then(({ data }) => data);

  return promise;
};
