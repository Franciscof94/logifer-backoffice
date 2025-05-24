import { Suspense, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { cn } from "../../lib/utils";

const Dashboard = () => {
  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Efecto para actualizar el estado cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-full overflow-hidden">
      <Sidebar />
      <Suspense fallback={<></>}>
        <div className={cn(
          "flex-1 overflow-auto bg-gray-100",
          isMobile ? "w-full" : "ml-[70px]"
        )}>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default Dashboard;