import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import speechApi from "../../api/speechApi";

export const fetchSpeechEvaluation = createAsyncThunk(
  "speech/fetchSpeechEvaluation",
  async (speech_id, { rejectWithValue }) => {
    try {
      const res = await speechApi.getSpeechEvaluation(speech_id);
      if (!res.data?.success) {
        return rejectWithValue(res.data?.message || "Failed to load");
      }
      return res.data.data; // single object as per your example
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

const initialState = {
  data: null, // single speech evaluation object
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const speechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {
    resetSpeech: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpeechEvaluation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSpeechEvaluation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || null;
      })
      .addCase(fetchSpeechEvaluation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch";
      });
  },
});

export const { resetSpeech } = speechSlice.actions;
export default speechSlice.reducer;
