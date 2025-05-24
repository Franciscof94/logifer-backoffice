import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useFormContext } from 'react-hook-form';
import { CustomSheet } from '../customs/CustomSheet';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  height?: number;
}

export const DiscountSheet = ({ open, setOpen }: Props) => {
  const { register, setValue, watch } = useFormContext();
  const currentDiscount = watch('discount') || 0;
  const [discount, setDiscount] = useState<string>(currentDiscount.toString());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleApply = () => {
    // Si está vacío o no es un número válido, usar 0
    const numericValue = discount === '' ? 0 : parseFloat(discount);
    
    // Asegurar que el valor esté entre 0 y 100
    const validDiscount = Math.min(Math.max(0, numericValue), 100);
    setValue('discount', validDiscount);
    setOpen(false);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir campo vacío
    if (value === '') {
      setDiscount('');
      return;
    }

    const numericValue = parseFloat(value);
    // Validar que sea un número y esté entre 0 y 100
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
      setDiscount(value);
    }
  };

  const content = (
    <>
      <div className="py">
        <div className="space-y-2">
          <label htmlFor="discount" className="text-sm font-medium text-gray-700 block">
            Porcentaje de descuento
          </label>
          <input
            id="discount"
            type="number"
            value={discount}
            onChange={handleDiscountChange}
            className="w-full p-2.5 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#3342B1] focus:border-transparent text-base"
            min="0"
            max="100"
            placeholder="Ingrese el porcentaje"
          />
          <div className="text-xs text-gray-500">
            El valor debe estar entre 0 y 100
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-3 w-full mt-4">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3342B1] rounded-[6px] hover:bg-[#2A3690]"
        >
          Aplicar
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <CustomSheet
        open={open}
        onOpenChange={setOpen}
        title="Aplicar descuento"
        description="Descuento para todos los productos"
      >
        {content}
      </CustomSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && setOpen(false)}>
      <DialogContent className="sm:max-w-[425px] bg-white" style={{
        borderRadius: 6
      }}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-medium text-gray-900">
            Aplicar descuento
          </DialogTitle>
          <div className="text-sm text-gray-500">Descuento para todos los productos</div>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};