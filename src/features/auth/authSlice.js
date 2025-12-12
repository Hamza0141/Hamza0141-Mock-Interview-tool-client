// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

// =============== Thunks ===============

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return res.data;
    } catch (err) {
      console.error("❌ Register error:", err.response?.data);
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyEmail(data);
      return res.data;
    } catch (err) {
      console.error("❌ verifyEmail error:", err.response?.data || err.message);
      return rejectWithValue(err.message || "Verification failed");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      const user = res.data.data.user;
      localStorage.setItem("user_data", JSON.stringify(user));
      return { user };
    } catch (err) {
      console.error("❌ Login error:", err.message);
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// Get profile (normal use)
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getProfile();
      return res.data?.data;
    } catch (err) {
      console.error("❌ Get profile error:", err.response?.data || err.message);
      const status = err?.response?.status ?? null;
      return rejectWithValue(status);
    }
  }
);

// 🔍 Session check – uses getProfile
export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getProfile();
      // ✅ your backend: { userData: { ... } }
      const user = res?.data?.userData;

      if (!user || !user.profile_id) {
        throw new Error("Invalid session response");
      }

      return user;
    } catch (err) {
      const status = err?.response?.status;
      console.error("❌ checkSession error:", err.response || err.message);

      // Treat these as NOT AUTHENTICATED
      if (
        status === 401 ||
        status === 403 ||
        status === 400 ||
        status === 0 ||
        status === undefined
      ) {
        return rejectWithValue("UNAUTHENTICATED");
      }

      return rejectWithValue(err.message || "Session check failed");
    }
  }
);

const hasStoredUser = !!localStorage.getItem("user_data");

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (err) {
      console.error("❌ Logout error:", err.response?.data || err.message);
      return rejectWithValue("Logout failed");
    }
  }
);

// =============== Slice ===============

const storedUser = JSON.parse(localStorage.getItem("user_data") || "null");

const initialState = {
  user: JSON.parse(localStorage.getItem("user_data")) || null,
  isAuthenticated: hasStoredUser,
  status: "idle",
  error: null,
  message: null,
  sessionStatus: hasStoredUser ? "unknown" : "invalid", // "unknown" until we run checkSession
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.message = null;
      state.sessionStatus = "invalid";
      localStorage.removeItem("user_data");
    },
  },
  extraReducers: (builder) => {
    builder
      // ------- Register -------
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ------- Verify Email -------
      .addCase(verifyEmail.pending, (state) => {
        state.status = "verifying";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "verified";
        state.isAuthenticated = true;
        state.sessionStatus = "valid";
        state.user = action.payload?.data?.user || null;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.sessionStatus = "invalid";
        state.error = action.payload;
      })

      // ------- Login -------
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionStatus = "valid";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.sessionStatus = "invalid";
      })

      // ------- Get Profile (explicit fetch) -------
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionStatus = "valid";
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        const status = action.payload;
        // ❗ Only hard-logout on explicit auth errors
        if (status === 401 || status === 403 || status === "no-user") {
          state.user = null;
          state.isAuthenticated = false;
          state.sessionStatus = "invalid";
          localStorage.removeItem("user_data");
        } else {
          state.sessionStatus = "error"; // e.g., network/500
        }
      })

      // ------- Session Check -------
      .addCase(checkSession.pending, (state) => {
        state.sessionStatus = "checking";
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionStatus = "valid";
        state.error = null;
        localStorage.setItem("user_data", JSON.stringify(action.payload));
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionStatus = "invalid";
        state.error = action.payload || "Session invalid";
        localStorage.removeItem("user_data");
      })
      // ------- Logout -------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.sessionStatus = "invalid";
        localStorage.removeItem("user_data");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
