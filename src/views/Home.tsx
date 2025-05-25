import { Link } from "react-router-dom";
import { Button } from "../components/customs/Button";
import { useState, useEffect } from "react";

export const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  console.log('ENTRRRRRO')
  return (
    <div>
      <div className="flex flex-col justify-center items-center p-4">
        <h1 className={`text-center ${isMobile ? 'py-8 text-3xl' : 'py-14 text-5xl'} font-semibold`}>
          Bienvenido al backoffice de Logifer
        </h1>
        <div className={`${isMobile ? 'w-full' : ''}`}>
          <Link to="/nuevo-pedido" className={`${isMobile ? 'w-full block' : ''}`}>
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo pedido"
              size={isMobile ? "lg" : "xl"}
              weight=""
              width={isMobile ? "100%" : "250px"}
            />
          </Link>
        </div>
        <div className={`${isMobile ? 'py-4 w-full' : 'py-8'}`}>
          <Link to="/nuevo-cliente" className={`${isMobile ? 'w-full block' : ''}`}>
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo cliente"
              size={isMobile ? "lg" : "xl"}
              weight=""
              width={isMobile ? "100%" : "250px"}
            />
          </Link>
        </div>
        <div className={`${isMobile ? 'w-full' : ''}`}>
          <Link to="/nuevo-producto" className={`${isMobile ? 'w-full block' : ''}`}>
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo producto"
              size={isMobile ? "lg" : "xl"}
              weight=""
              width={isMobile ? "100%" : "250px"}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};