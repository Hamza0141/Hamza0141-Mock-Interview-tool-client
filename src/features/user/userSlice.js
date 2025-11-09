import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

// Load from localStorage on startup
const storedUser = localStorage.getItem("user_data");

// 🧩 Fetch user by ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.getUserById();
      console.log("✅ getUserById:", res.data.userData);
      localStorage.setItem("user_data", JSON.stringify(res.data.userData)); // store persistently
      return res.data.userData;
    } catch (err) {
      console.error("❌ getUserById error:", err.response?.data || err.message);
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

// 🧩 Update user info
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (data, { rejectWithValue }) => {
    try {
      const res = await userApi.updateUser(data);
      localStorage.setItem("user_data", JSON.stringify(res.data.data)); // keep in sync
      return res.data.data;
    } catch (err) {
      return rejectWithValue("Failed to update user info");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null, // 🔥 restore on page load
    status: "idle",
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user_data", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user_data");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
