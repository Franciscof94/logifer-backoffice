import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { refreshToken, isTokenExpired } from "../utils/authUtils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Variable para controlar si hay un refresh en progreso
let isRefreshing = false;
// Cola de peticiones fallidas para reintentarlas cuando tengamos un nuevo token
let failedQueue: { resolve: (token: string) => void; reject: (error: Error | unknown) => void }[] = [];

// Procesa la cola de peticiones fallidas
const processQueue = (error: Error | unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de peticiones
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    
    if (token) {
      // Verificar si el token está expirado
      if (isTokenExpired(token) && config.url !== '/auth/refresh') {
        console.log('Token expirado, intentando refresh antes de la petición');
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Si no hay configuración de la petición o es una petición de refresh, rechazamos
    if (!originalRequest || !originalRequest.url || originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Si la respuesta es 401 (no autorizado) y no hemos intentado hacer refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos haciendo refresh, ponemos la petición en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Marcamos que estamos haciendo refresh y que esta petición ya ha sido reintentada
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentamos refrescar el token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Si tenemos un nuevo token, actualizamos la petición original y la reintentamos
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Procesamos la cola de peticiones pendientes
          processQueue(null, newToken);
          
          return axiosInstance(originalRequest);
        } else {
          // Si el refresh falló, redirigimos al login
          console.error('Token refresh failed, redirecting to login');
          Cookies.remove("token");
          window.location.href = "/ingresar";
          
          // Procesamos la cola con error
          processQueue(new Error('Refresh token failed'));
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // En caso de error en el refresh, redirigimos al login
        console.error('Error during token refresh:', refreshError);
        Cookies.remove("token");
        window.location.href = "/ingresar";
        
        // Procesamos la cola con error
        processQueue(refreshError);
        
        return Promise.reject(refreshError);
      } finally {
        // Marcamos que ya no estamos haciendo refresh
        isRefreshing = false;
      }
    }

    // Para cualquier otro error, lo devolvemos
    return Promise.reject(error);
  }
);

export { axiosInstance };
