import axiosClient from "./axiosClient";

const feedbackApi = {
  submit: (payload) => axiosClient.post("/user/feedback", payload),
  getMyFeedback: () => axiosClient.get("/user/feedback"),
};

export default feedbackApi;
