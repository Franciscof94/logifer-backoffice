import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PUBLIC_ROUTE } from "../routes/publicRoutes";
import { FC } from "react";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";

interface Props {
  permissions?: string[];
}

export const RequireAuth: FC<Props> = ({ permissions = [] }) => {
  const auth = useSelector((state: RootState) => state.authData.auth);
  const location = useLocation();
  const { accessToken, user } = useAuthStore();

  console.log('Estado de autenticación:', auth);

  const tokenCookie = Cookies.get("token");
  const hasTokenInCookies = !!tokenCookie;
  console.log('Token en cookies:', tokenCookie);

  if (auth === undefined) {
    console.log('Auth is undefined, checking cookies...');
    if (hasTokenInCookies) {
      console.log('Token found in cookies, allowing access');
      return <Outlet />;
    }
    return <div>Cargando...</div>;
  }

  const rol_seleccionado = {
    permisos: ["VIEW_HOME"],
  };

  const isAuthenticated = !!accessToken || !!user || hasTokenInCookies;

  if (!isAuthenticated) {
    console.log('No authentication found, redirecting to login');
    return (
      <Navigate to={PUBLIC_ROUTE.LOGIN} state={{ from: location }} replace />
    );
  }

  if (permissions.length === 0) {
    console.log('No permissions required, allowing access');
    return <Outlet />;
  }

  return permissions.every((ctPermiso: string) =>
    rol_seleccionado.permisos.includes(ctPermiso)
  ) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate
      to={PUBLIC_ROUTE.UNAUTHORIZED}
      state={{ from: location }}
      replace
    />
  ) : (
    <Navigate to={PUBLIC_ROUTE.LOGIN} state={{ from: location }} replace />
  );
};
