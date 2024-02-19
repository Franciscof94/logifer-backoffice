import { axiosInstance } from "../../axios/axios";

const AuthService = {
  postLogin: async (user: { email: string; password: string }) => {
    const { data } = await axiosInstance.post("/auth/login", user);
    return data;
  },
};

export { AuthService as default };
