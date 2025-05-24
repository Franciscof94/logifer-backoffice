import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

import { Logo } from "../assets";
import { RxHamburgerMenu } from "react-icons/rx";
import { setShowNavbar } from "../store/slices/navbarSlice";
import { login } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { PRIVATE_ROUTE } from "../routes";
import { RootState } from "@/store/store";

const getTitleFromPath = (pathname: string) => {
  switch (pathname) {
    case '/nuevo-pedido':
      return 'Nuevo pedido';
    case '/nuevo-cliente':
      return 'Nuevo cliente';
    case '/nuevo-producto':
      return 'Nuevo producto';
    case '/pedidos':
      return 'Pedidos';
    case '/clientes':
      return 'Clientes';
    case '/productos':
      return 'Productos';
    case '/reportes':
      return 'Reportes';
    default:
      return 'Inicio';
  }
};

export const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const auth = useSelector((state: RootState) => state.authData.auth);
  const { isOpen } = useSelector((state: RootState) => state.navbarData);
  const isLogged = auth?.user;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const cookies = Cookies.get("token");
    if (cookies) {
      const { accessToken, refreshToken } = JSON.parse(cookies);
      const { user }: any = jwtDecode(accessToken);
      dispatch(login({ accessToken, user, refreshToken }));
    } else {
      dispatch(login({}));
    }
  }, [dispatch]);

  const toggleMenu = () => {
    dispatch(setShowNavbar(!isOpen));
  };

  return (
    <div className="bg-blue">
      <div className={`flex items-center justify-between px-4 ${isMobile ? 'h-16' : 'h-16'}`}>
        <div className="flex items-center gap-x-4">
          <img 
            src={Logo} 
            className={`${isMobile ? 'w-[40px]' : 'w-[60px]'}`} 
            alt="logo-logifer" 
          />
          {isLogged && (
            <h1 className={`text-white font-semibold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {getTitleFromPath(pathname)}
            </h1>
          )}
        </div>
        {isLogged && (
          <button
            className="cursor-pointer"
            onClick={toggleMenu}
          >
            <RxHamburgerMenu 
              color="white" 
              size={isMobile ? 24 : 32} 
            />
          </button>
        )}
      </div>
    </div>
  );
};