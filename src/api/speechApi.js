import axiosClient from "./axiosClient";

const speechApi = {
  getSpeechEvaluation: (speech_id) => axiosClient.get(`/user/speech/${speech_id}`),
};

export default speechApi;
