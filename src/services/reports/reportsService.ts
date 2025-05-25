import { axiosInstance } from "../../axios/axios";

const ReportsService = {
  getReportsBySales: async (yearId: number): Promise<number[]> => {
    const response = await axiosInstance.get(`/orders/report-sales/${yearId}`);
    
    if (response.data && response.data.data) {
      console.log('Usando nueva estructura de respuesta', response.data.data);
      return response.data.data;
    }
    
    console.log('Usando estructura antigua de respuesta', response.data);
    return response.data;
  },
  getReportsByProducts: async (
    productId: number,
    yearId: number,
    monthId: number
  ): Promise<number[]> => {
    const response = await axiosInstance.get(
      `/orders/report-products/${productId}/${yearId}/${monthId}`
    );
    
    if (response.data && response.data.data) {
      console.log('Usando nueva estructura de respuesta para productos', response.data.data);
      return response.data.data;
    }
    
    console.log('Usando estructura antigua de respuesta para productos', response.data);
    return response.data;
  },
};

export { ReportsService as default };
