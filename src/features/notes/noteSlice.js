import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import noteApi from "../../api/noteApi";

// Fetch notes
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await noteApi.getNotes();
      console.log("✅ fetchNotes response:", res.data);
      return res.data.data;
    } catch (err) {
      console.error("❌ fetchNotes error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch notes"
      );
    }
  }
);

// Add note
export const addNote = createAsyncThunk(
  "notes/addNote",
  async (data, { rejectWithValue }) => {
    try {
      const res = await noteApi.addNote(data);
      console.log("✅ addNote response:", res.data);

      // must return the correct note object
      return res.data.data; // not res.data.user
    } catch (err) {
      console.error("❌ addNote error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || "Failed to add note");
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (note_id, { rejectWithValue }) => {
    try {
      await noteApi.deleteNote(note_id);
      return note_id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete note"
      );
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to add note";
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.note_id !== action.payload);
      });
  },
});

export default noteSlice.reducer;
