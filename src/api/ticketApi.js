// src/api/ticketApi.js
import axiosClient from "./axiosClient";

const ticketApi = {
  getTickets: () => axiosClient.get("/user/tickets"),
  getTicketById: (ticketId) => axiosClient.get(`/user/tickets/${ticketId}`),
  createTicket: (payload) => axiosClient.post("/user/tickets", payload),
  addMessage: (ticketId, payload) =>
    axiosClient.post(`/user/tickets/${ticketId}/messages`, payload),
  updateStatus: (ticketId, payload) =>
    axiosClient.patch(`/user/tickets/${ticketId}/status`, payload),
};

export default ticketApi;
