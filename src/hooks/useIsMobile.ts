import { useState, useEffect } from 'react';

/**
 * Custom hook para detectar si la vista actual es de móvil.
 * @param {number} breakpoint - El punto de quiebre en píxeles para considerar móvil (por defecto 640px).
 * @returns {boolean} True si el ancho de la ventana es menor que el breakpoint, False en caso contrario.
 */
export const useIsMobile = (breakpoint: number = 640): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar al montar el componente
    checkDevice();

    // Agregar listener para cambios en el tamaño de la ventana
    window.addEventListener('resize', checkDevice);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [breakpoint]); // Re-ejecutar el efecto si el breakpoint cambia

  return isMobile;
}; 