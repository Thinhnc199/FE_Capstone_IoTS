import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../api/apiConfig";

// fetchFeedbackHistory
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

//  createFeedback
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

//  fetchActivityLog
export const fetchActivityLog = createAsyncThunk(
  "feedback/fetchActivityLog",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/activity-log/get-pagination-activity-log/${userId}`, payload);
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
    activityLog: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFeedbackHistory
      .addCase(fetchFeedbackHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedbackHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackHistory = action.payload.data.data;
      })
      .addCase(fetchFeedbackHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createFeedback
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
      })
      //  fetchActivityLog
      .addCase(fetchActivityLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLog = action.payload.data.data;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;