import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../api/apiConfig";

export const fetchFeedbackHistory = createAsyncThunk(
  "feedback/fetchFeedbackHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/feedback/product/get-pagination", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/feedback/create", feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbackHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedbackHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackHistory = action.payload.data;
      })
      .addCase(fetchFeedbackHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFeedback.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;