import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import noteReducer from "../features/notes/noteSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    user: userReducer,
  },
});
