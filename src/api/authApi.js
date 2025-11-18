import axiosClient from "./axiosClient";

const authApi = {
  register: (data) => axiosClient.post("/user/create", data),
  verifyEmail: (data) => axiosClient.post("user/verify-email", data),
  login: (data) => axiosClient.post("/auth/login", data),
  getProfile: () => axiosClient.get("/user/profile"),
  logout: () => axiosClient.post("/user/logout"),
};

export default authApi;
