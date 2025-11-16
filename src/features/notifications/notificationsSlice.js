// src/features/notifications/notificationsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationApi from "../../api/notificationApi";

// Normalize server response into a flat array
function normalizeList(resData) {
  if (!resData) return [];
console.log(resData);
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.notifications)) return resData.notifications;
  if (resData.data && Array.isArray(resData.data.notifications))
    return resData.data.notifications;
  return [];
}

function computeUnreadCount(items) {
  return items?.filter((n) => !n.is_read)?.length || 0;
}

/**
 * GET /api/user/notifications
 */
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.getAll();
      if (!res.data) return [];
      const list = normalizeList(res.data);
      return list;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load notifications"
      );
    }
  }
);

/**
 * PATCH /api/user/notifications/:id/read
 */
export const markNotificationRead = createAsyncThunk(
  "notifications/markOneRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationApi.markOneRead(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to mark as read"
      );
    }
  }
);

/**
 * PATCH /api/user/notifications/read-all
 */
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllRead();
      return true;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to mark all read"
      );
    }
  }
);

const initialState = {
  items: [], // array of notifications
  unreadCount: 0,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  markStatus: "idle", // for single mark
  markAllStatus: "idle", // for mark all
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // optional manual reset
    resetNotificationsState: () => initialState,
  },
  extraReducers: (builder) => {
    // ---- fetchNotifications ----
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
        state.unreadCount = computeUnreadCount(state.items);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch notifications";
      });

    // ---- markNotificationRead ----
    builder
      .addCase(markNotificationRead.pending, (state) => {
        state.markStatus = "loading";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markStatus = "succeeded";
        const id = action.payload;
        state.items = state.items.map((n) =>
          n.notification_id === id ? { ...n, is_read: 1 } : n
        );
        state.unreadCount = computeUnreadCount(state.items);
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.markStatus = "failed";
        state.error = action.payload || "Failed to update notification";
      });

    // ---- markAllNotificationsRead ----
    builder
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markAllStatus = "loading";
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.markAllStatus = "succeeded";
        state.items = state.items.map((n) => ({ ...n, is_read: 1 }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.markAllStatus = "failed";
        state.error = action.payload || "Failed to mark all as read";
      });
  },
});

export const { resetNotificationsState } = notificationsSlice.actions;
export default notificationsSlice.reducer;
