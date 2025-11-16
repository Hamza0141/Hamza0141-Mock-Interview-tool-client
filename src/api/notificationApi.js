
import axiosClient from "./axiosClient";

const notificationApi = {
  getAll: () => axiosClient.get("/user/notifications"),
  markOneRead: (notificationId) =>
    axiosClient.patch(`/user/notifications/${notificationId}/read`),
  markAllRead: () => axiosClient.patch("/user/notifications/read-all"),
};

export default notificationApi;
