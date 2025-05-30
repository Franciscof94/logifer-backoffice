import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductsService from "../../services/products/productsService";
import { toast } from "react-toastify";
import { IProduct } from "../../interfaces";

interface UpdateProductParams {
  id: string | number; // Acepta ambos tipos
  data: Omit<IProduct, "id">;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductParams) =>
      ProductsService.patchProduct(String(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado correctamente");
    },
    onError: (error: unknown) => {
      console.log("Error al actualizar el producto:", error);
      toast.error("Error al actualizar el producto");
    },
  });
};
