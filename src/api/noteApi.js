import axiosClient from "./axiosClient";

const noteApi = {
  getNotes: () => axiosClient.get("/user/note"),
  addNote: (data) => axiosClient.post("/user/note", data),
  deleteNote: (id) => axiosClient.delete(`/user/note/${id}`),
};

export default noteApi;
