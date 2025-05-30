import { axiosInstance } from "../../axios/axios";

const AuthService = {
  postLogin: async (user: { email: string; password: string }) => {
    const { data } = await axiosInstance.post("/auth/login", user);
    return data;
  },
  refreshToken: async (refreshToken: string) => {
    const { data } = await axiosInstance.get("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return data;
  },
};

export { AuthService as default };
