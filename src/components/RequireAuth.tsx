import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PUBLIC_ROUTE } from "../routes/publicRoutes";
import { FC } from "react";

interface Props {
  permissions?: string[];
}

export const RequireAuth: FC<Props> = ({ permissions = [] }) => {
  const auth = useSelector((state: any) => state.authData.auth);
  const location = useLocation();

  if (auth === undefined) {
    return <Outlet />;
  }

  console.log(auth);

  const rol_seleccionado = {
    permisos: ["VIEW_HOME"],
  };

  if (!auth?.user) {
    return (
      <Navigate to={PUBLIC_ROUTE.LOGIN} state={{ from: location }} replace />
    );
  }

  if (permissions.length === 0) {
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
