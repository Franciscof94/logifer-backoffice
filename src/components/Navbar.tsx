import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaAngleRight, FaChartBar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setShowNavbar } from "../store/slices/navbarSlice";
import { logout } from "../store/slices/authSlice";
import { MdOutlinePersonAdd, MdLogout } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { FaFileCirclePlus, FaFileLines } from "react-icons/fa6";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { SiBuffer } from "react-icons/si";

const links = [
  {
    name: "Nuevo pedido",
    link: "/nuevo-pedido",
    icon: <FaFileCirclePlus color="white" size={30} />,
  },
  {
    name: "Nuevo cliente",
    link: "/nuevo-cliente",
    icon: <MdOutlinePersonAdd color="white" size={30} />,
  },
  {
    name: "Nuevo producto",
    link: "/nuevo-producto",
    icon: <BsFillPatchPlusFill color="white" size={30} />,
  },
  {
    name: "Pedidos",
    link: "/pedidos",
    icon: <FaFileLines color="white" size={30} />,
  },
  {
    name: "Clientes",
    link: "/clientes",
    icon: <IoMdPerson color="white" size={30} />,
  },
  {
    name: "Productos",
    link: "/productos",
    icon: <SiBuffer color="white" size={30} />,
  },
  {
    name: "Reportes",
    link: "/reportes",
    icon: <FaChartBar color="white" size={30} />,
  },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  const { isOpen } = useSelector((state: any) => state.navbarData);
  const navbarRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        dispatch(setShowNavbar(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      className={`bg-blue top-[35px] mx-4  h-[720px]  absolute ${
        isOpen ? "navbar-expanded" : "navbar-collapsed rounded-[23px]"
      } navbar-transition`}
    >
      <ul
        className={isOpen ? "px-7 mt-10" : "flex flex-col items-center mt-10"}
      >
        {links.map((ctLink, index) => {
          const isActive = pathname === ctLink.link;
          return (
            <li className="text-white font-semibold py-3 relative" key={index}>
              <NavLink
                to={ctLink.link}
                onClick={() => {
                  dispatch(setShowNavbar(false));
                }}
                className={({ isActive }) =>
                  isActive
                    ? `text-xl ${!isOpen ? "flex justify-end" : ""}`
                    : `text-lg font-light text-grey-50 ${
                        !isOpen ? "flex justify-end" : ""
                      }`
                }
              >
                {isOpen ? (
                  ctLink.name
                ) : (
                  <div
                    className={
                      isActive
                        ? "bg-[#ededed42] w-12 h-12 rounded-[12px] flex justify-center items-center"
                        : ""
                    }
                  >
                    {ctLink.icon}
                  </div>
                )}
              </NavLink>
              {pathname === ctLink.link && isOpen && (
                <FaAngleRight className="absolute left-[-19px] top-1/2 transform -translate-y-1/2" />
              )}
              {isOpen && <hr className="border-white opacity-25" />}
            </li>
          );
        })}
      </ul>
      <div className="flex h-36 justify-center items-end text-lg font-normal text-[#D0312D] mt-14">
        {isOpen ? (
          <p
            className="cursor-pointer"
            onClick={() => {
              dispatch(logout());
              dispatch(setShowNavbar(false));
            }}
          >
            {" "}
            Cerrar sesión
          </p>
        ) : (
          <div
            onClick={() => {
              dispatch(logout());
              dispatch(setShowNavbar(false));
            }}
          >
            <MdLogout color={isOpen ? "white" : "#D0312D"} size={32} />
          </div>
        )}
      </div>
    </div>
  );
};
