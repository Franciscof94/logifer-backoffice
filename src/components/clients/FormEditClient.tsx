import { useEffect, useState } from "react";
import { InputText } from "../customs/InputText";

import { useFormContext } from "react-hook-form";

export const FormEditClient = () => {
  // Get form methods from context - register is used by InputText components
  useFormContext();
  // Note: The InputText component internally uses register from useFormContext
  // We don't need to explicitly use register here as it's handled by InputText
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={`${isMobile ? "px-4" : "px-16"} mt-3 mb-5`}>
      <div
        className={`${isMobile ? "flex flex-col" : "flex"} mt-8 ${
          isMobile ? "gap-y-6" : "gap-x-16"
        }`}
      >
        <div className="flex flex-col flex-1">
          <label className={`${isMobile ? "text-base" : "text-xl"} mb-1`}>
            Nombre y apellido
          </label>
          <InputText
            placeholder="Nombre y apellido"
            type="text"
            color="bg-grey"
            name="nameAndLastname"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className={`${isMobile ? "text-base" : "text-xl"} mb-1`}>
            Email
          </label>
          <InputText
            placeholder="Email"
            type="text"
            color="bg-grey"
            name="email"
          />
        </div>
      </div>
      <div
        className={`${isMobile ? "flex flex-col" : "flex"} mt-8 ${
          isMobile ? "gap-y-6" : "gap-x-16"
        }`}
      >
        <div className="flex flex-col flex-1">
          <label className={`${isMobile ? "text-base" : "text-xl"} mb-1`}>
            Dirección
          </label>
          <InputText
            placeholder="Dirección"
            type="text"
            color="bg-grey"
            name="address"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className={`${isMobile ? "text-base" : "text-xl"} mb-1`}>
            Teléfono
          </label>
          <InputText
            placeholder="Teléfono"
            type="text"
            color="bg-grey"
            name="phone"
          />
        </div>
      </div>
    </div>
  );
};
