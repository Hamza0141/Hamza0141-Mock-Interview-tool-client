import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

// 🧩 Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return res.data; // backend sends { status, message, ... }
    } catch (err) {
      console.error("❌ Register error:", err.response?.data);
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

// 🧩 Verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyEmail(data);
      return res.data; // backend sets cookie & returns { success, message, data: { user } }
    } catch (err) {
      console.error("❌ verifyEmail error:", err.response?.data || err.message);
      return rejectWithValue(err.message || "Verification failed");
    }
  }
);

// Login (backend sets HttpOnly cookie)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      const user = res.data.data.user;

      // Store in localStorage
      localStorage.setItem("user_data", JSON.stringify(user));

      return { user };
    } catch (err) {
      console.log(err);
      console.error("❌ Login error:", err.message);
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// 🧩 Get user profile (verifies cookie server-side)
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getProfile(); // backend reads cookie internally
      return res.data?.data;
    } catch (err) {
      console.error("❌ Get profile error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Unable to fetch profile"
      );
    }
  }
);

// Logout (clears cookie server-side)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout(); // clears cookie on backend
      return true;
    } catch (err) {
      console.error("❌ Logout error:", err.response?.data || err.message);
      return rejectWithValue("Logout failed");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user_data")) || null,
  isAuthenticated: !!localStorage.getItem("user_data"),
  status: "idle",
  error: null,
  message: null,
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
      localStorage.removeItem("user_data"); // always clear
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
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

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.status = "verifying";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "verified";
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        // ✅ Same cleanup here
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        localStorage.removeItem("user_data");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
