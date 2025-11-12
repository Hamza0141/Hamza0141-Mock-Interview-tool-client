
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportApi from "../../api/reportApi";


export const fetchUserReport = createAsyncThunk(
  "report/fetchUserReport",
  async (profile_id, { rejectWithValue }) => {
    try {
      const res = await reportApi.getUserReport(profile_id);
      console.log(res);
      if (!res.data?.success)
        return rejectWithValue(res.data?.message || "Failed to load");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

const initialState = {
  data: null, // { performanceComparison, recent }
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    resetReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || null;
      })
      .addCase(fetchUserReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch";
      });
  },
});

export const { resetReport } = reportSlice.actions;
export default reportSlice.reducer;
