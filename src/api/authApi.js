import axiosClient from "./axiosClient";

const authApi = {
  me: () => axiosClient.get("/user/me"),
  register: (data) => axiosClient.post("/user/create", data),
  verifyEmail: (data) => axiosClient.post("/user/verify-email", data),
  login: (data) => axiosClient.post("/auth/login", data),
  getProfile: () => axiosClient.get("/user/getuserbyId"),
  logout: () => axiosClient.post("/user/logout"),
};

export default authApi;
