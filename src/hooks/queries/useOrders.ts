import { useQuery } from "@tanstack/react-query";
import { ordersEndpoints } from "../../api/endpoints/orders";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const useOrders = (page: number, size: number = 9) => {
  const filters = useSelector((state: RootState) => state.filtersData.filtersOrders);
  console.log("useOrders hook called with:", { page, size, filters });
  
  return useQuery({
    queryKey: ["orders", page, size, filters],
    queryFn: async () => {
      console.log("queryFn executing for page:", page, "with filters:", filters);
      try {
        console.log("Before API call");
        const data = await ordersEndpoints.getOrders({ page, size, filters });
        console.log("API Response Data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error al cargar los pedidos");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!page && !!size,
    staleTime: 1000 * 60 * 1,
  });
};

export const useOrdersByClient = (clientId: string) => {
  return useQuery({
    queryKey: ["ordersByClient", clientId],
    queryFn: () => ordersEndpoints.getOrdersByClient(clientId),
    enabled: !!clientId,
  });
};
