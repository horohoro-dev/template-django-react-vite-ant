import Axios, { type AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_VERSION = "v0";

export const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
});

// Custom instance for orval
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstance({
    ...config,
  }).then(({ data }) => data);

  return promise;
};
