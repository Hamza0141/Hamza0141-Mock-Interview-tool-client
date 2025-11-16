// src/features/tickets/ticketSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ticketApi from "../../api/ticketApi";

// GET all tickets (user sees their own; admin sees all)
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ticketApi.getTickets();
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to fetch tickets");
      }
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

// GET single ticket + messages
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const res = await ticketApi.getTicketById(ticketId);
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to fetch ticket");
      }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

// POST create ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async ({ subject, message, priority = "medium" }, { rejectWithValue }) => {
    try {
      const res = await ticketApi.createTicket({ subject, message, priority });
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to create ticket");
      }
      // backend returns data: { ticket_id, subject, priority, status }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

// POST add message
export const addTicketMessage = createAsyncThunk(
  "tickets/addTicketMessage",
  async ({ ticketId, message }, { rejectWithValue }) => {
    try {
      const res = await ticketApi.addMessage(ticketId, { message });
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to add message");
      }
      // re-fetch ticket detail after adding message
      const detailRes = await ticketApi.getTicketById(ticketId);
      return detailRes.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

// PATCH update status (admin only)
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const res = await ticketApi.updateStatus(ticketId, { status });
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to update status");
      }
      // return minimal info
      return { ticketId, status };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

const initialState = {
  list: [],
  listStatus: "idle",
  listError: null,

  detail: null,
  detailStatus: "idle",
  detailError: null,

  createStatus: "idle",
  createError: null,

  messageStatus: "idle",
  messageError: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    resetTicketsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchTickets
      .addCase(fetchTickets.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load tickets";
      })

      // fetchTicketById
      .addCase(fetchTicketById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload || null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load ticket";
      })

      // createTicket
      .addCase(createTicket.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        const newTicket = action.payload;
        if (newTicket) {
          state.list = [newTicket, ...state.list];
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create ticket";
      })

      // addTicketMessage
      .addCase(addTicketMessage.pending, (state) => {
        state.messageStatus = "loading";
        state.messageError = null;
      })
      .addCase(addTicketMessage.fulfilled, (state, action) => {
        state.messageStatus = "succeeded";
        state.detail = action.payload || state.detail;
      })
      .addCase(addTicketMessage.rejected, (state, action) => {
        state.messageStatus = "failed";
        state.messageError = action.payload || "Failed to send message";
      })

      // updateTicketStatus
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const { ticketId, status } = action.payload || {};
        // update list
        state.list = state.list.map((t) =>
          t.ticket_id === ticketId || t.id === ticketId ? { ...t, status } : t
        );
        // update detail
        if (state.detail && state.detail.ticket_id === ticketId) {
          state.detail.status = status;
        }
      });
  },
});

export const { resetTicketsState } = ticketsSlice.actions;
export default ticketsSlice.reducer;
