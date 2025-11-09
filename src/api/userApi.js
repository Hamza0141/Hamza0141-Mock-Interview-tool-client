import axiosClient from "./axiosClient";

const userApi = {
  getUserById: () => axiosClient.get("/user/getuserbyId"),
  updateUser: (data) => axiosClient.put("/user/update", data),
  changePassword: (data) => axiosClient.post("/user/passwordchange", data),
  uploadImage: (formData) =>
    axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default userApi;
