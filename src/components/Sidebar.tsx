import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShowNavbar } from "../store/slices/navbarSlice";
import { logout } from "../store/slices/authSlice";
import { MdOutlinePersonAdd, MdLogout } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { FaFileCirclePlus, FaFileLines, FaChartBar } from "react-icons/fa6";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { SiBuffer } from "react-icons/si";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { cn } from "../lib/utils";
import { RootState } from "@/store/store";

const links = [
  {
    name: "Nuevo pedido",
    link: "/nuevo-pedido",
    icon: <FaFileCirclePlus size={24} />,
  },
  {
    name: "Nuevo cliente",
    link: "/nuevo-cliente",
    icon: <MdOutlinePersonAdd size={24} />,
  },
  {
    name: "Nuevo producto",
    link: "/nuevo-producto",
    icon: <BsFillPatchPlusFill size={24} />,
  },
  {
    name: "Pedidos",
    link: "/pedidos",
    icon: <FaFileLines size={24} />,
  },
  {
    name: "Clientes",
    link: "/clientes",
    icon: <IoMdPerson size={24} />,
  },
  {
    name: "Productos",
    link: "/productos",
    icon: <SiBuffer size={24} />,
  },
  {
    name: "Reportes",
    link: "/reportes",
    icon: <FaChartBar size={24} />,
  },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { isOpen } = useSelector((state: RootState) => state.navbarData);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setShowNavbar(false));
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 py-4">
          {links.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => dispatch(setShowNavbar(false))}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "transparent",
                  !isOpen && !isMobile ? "justify-center" : ""
                )
              }
            >
              <span className={cn(
                "transition-colors",
                pathname === item.link ? "text-[#3342B1]" : "text-gray-500"
              )}>
                {item.icon}
              </span>
              {(isOpen || isMobile) && (
                <span className={cn(
                  "text-sm font-medium",
                  pathname === item.link ? "text-[#3342B1]" : ""
                )}>
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:text-red-900"
        >
          <MdLogout size={24} />
          {(isOpen || isMobile) && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => dispatch(setShowNavbar(open))}>
        <SheetContent side="left" className="w-[240px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg font-semibold text-[#3342B1]">
              Menú
            </SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-hidden">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      "fixed left-0 z-40 border-r bg-white transition-all duration-300 overflow-hidden",
      isMobile ? "" : "top-[4rem] h-[calc(100vh-4rem)]", // Modified height and top
      isOpen ? "w-[240px]" : "w-[70px]"
    )}>
      <NavContent />
    </aside>
  );
};