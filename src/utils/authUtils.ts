import Cookies from "js-cookie";
import { store } from "../store/store";
import { login } from "../store/slices/authSlice";

/**
 * Refresca el token de acceso utilizando el refresh token
 * @returns {Promise<string|null>} El nuevo token de acceso o null si falla
 */
export async function refreshToken(): Promise<string | null> {
  try {
    // Obtén el refresh token desde el store (o cookies si lo prefieres)
    const state = store.getState();
    const currentAuthData = state.authData?.auth;
    const currentRefreshToken = currentAuthData?.refreshToken || Cookies.get("refreshToken");

    if (!currentRefreshToken) {
      console.error('No refresh token found');
      return null;
    }

    // Llama al endpoint con el refresh token como Bearer
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentRefreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Error refreshing token:', response.status, response.statusText);
      if (response.status === 401 || response.status === 403) {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        store.dispatch(login({}));
      }
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken || data.access_token;
    const newRefreshToken = data.refreshToken || data.refresh_token;

    if (newAccessToken) {
      Cookies.set("token", newAccessToken, { expires: 7 });
      if (newRefreshToken) {
        Cookies.set("refreshToken", newRefreshToken, { expires: 30 });
      }

      // Actualiza el store
      store.dispatch(login({
        ...(currentAuthData || {}),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || currentRefreshToken,
      }));

      console.log('Token refreshed successfully');
      return newAccessToken;
    } else {
      console.error('Refresh endpoint did not return an access token');
      return null;
    }
  } catch (error) {
    console.error('Network or other error during token refresh:', error);
    return null;
  }
}

/**
 * Comprueba si el token está expirado
 * @param {string} token - El token JWT
 * @returns {boolean} true si está expirado, false si es válido
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Decodifica el token JWT (formato: header.payload.signature)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Comprueba si el token tiene fecha de expiración
    if (!decodedPayload.exp) {
      return false;
    }
    
    // Convierte a milisegundos y compara con la hora actual
    const expirationTime = decodedPayload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Si hay un error, asumimos que el token no es válido
  }
}
