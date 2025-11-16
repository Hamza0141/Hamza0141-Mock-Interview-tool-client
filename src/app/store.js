import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import noteReducer from "../features/notes/noteSlice";
import userReducer from "../features/user/userSlice";
import reportReducer from "../features/report/reportSlice";
import speechReducer from "../features/speech/speechSlice";
import ticketReducer from "../features/tickets/ticketSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    user: userReducer,
    report: reportReducer,
    speech: speechReducer,
    tickets: ticketReducer,
    notifications: notificationsReducer,
  },
});
