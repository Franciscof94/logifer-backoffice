import { axiosInstance } from "../../axios/axios";

const ReportsService = {
  getReportsBySales: async (yearId: number): Promise<number[]> => {
    const { data } = await axiosInstance.get(`/orders/report-sales/${yearId}`);
    return data;
  },
  getReportsByProducts: async (
    productId: number,
    yearId: number,
    monthId: number
  ): Promise<number[]> => {
    const { data } = await axiosInstance.get(
      `/orders/report-products/${productId}/${yearId}/${monthId}`
    );
    return data;
  },
};

export { ReportsService as default };
