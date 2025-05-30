import axios from "axios";
import { useAuthStore } from "../store/authStore";
import AuthService from "../services/auth/authService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();

      console.log('refreshToken', refreshToken);
      if (refreshToken) {
        try {
          const data = await AuthService.refreshToken(refreshToken);
          console.log('DATWASAAS', data.data.accessToken);
          const newAccessToken = data.data.accessToken || data.access_token;
          const newRefreshToken = data.data.refreshToken || data.refresh_token;

          if (newAccessToken) {
            setAuth({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken || refreshToken,
              user: null, // Si tienes user, actualízalo aquí
            });
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(error.config);
          }
        } catch {
          clearAuth();
          window.location.href = "/ingresar";
        }
      } else {
        clearAuth();
        window.location.href = "/ingresar";
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
