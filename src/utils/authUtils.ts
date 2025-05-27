import Cookies from "js-cookie";
import { store } from "../store/store";
import { login } from "../store/slices/authSlice";

/**
 * Refresca el token de acceso utilizando el refresh token
 * @returns {Promise<string|null>} El nuevo token de acceso o null si falla
 */
export async function refreshToken(): Promise<string | null> {
  try {
    // Obtiene el refreshToken del estado de Redux
    const state = store.getState();
    const auth = state.authData?.auth;
    const refreshToken = auth?.refreshToken;

    if (!refreshToken) {
      console.error('No refresh token found in store');
      return null;
    }

    // Crea una instancia de axios independiente para evitar ciclos infinitos
    // con los interceptores de la instancia principal
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Error refreshing token:', response.statusText);
      // Limpia los tokens y la autenticación
      Cookies.remove("token");
      store.dispatch(login({}));
      return null;
    }

    const data = await response.json();
    
    if (data.accessToken || data.access_token) {
      const newAccessToken = data.accessToken || data.access_token;
      
      // Actualiza la cookie
      Cookies.set("token", newAccessToken, { expires: 7 });
      
      // Actualiza el estado de Redux
      store.dispatch(login({
        ...auth,
        accessToken: newAccessToken
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
