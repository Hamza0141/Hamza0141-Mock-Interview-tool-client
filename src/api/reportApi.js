import axiosClient from "./axiosClient";


const reportApi = {
  getUserReport: (profile_id) => axiosClient.get(`/user/${profile_id}/report`),
};

export default reportApi