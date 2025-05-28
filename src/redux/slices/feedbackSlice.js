import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../api/apiConfig";
// import { message } from "antd";
// fetchFeedbackHistory
export const fetchFeedbackHistory = createAsyncThunk(
  "feedback/fetchFeedbackHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/feedback/product/get-pagination",
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// createFeedback
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

// fetchActivityLog
export const fetchActivityLog = createAsyncThunk(
  "feedback/fetchActivityLog",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/activity-log/get-pagination-activity-log/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// fetchReports - Thêm API lấy danh sách reports
export const fetchReports = createAsyncThunk(
  "feedback/fetchReports",
  async ({ payload, statusFilter }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/report/get-pagination", payload, {
        params: { statusFilter },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// approveReport - Thêm API approve report
export const approveReport = createAsyncThunk(
  "feedback/approveReport",
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/report/approve/${reportId}`);
      // message.success("Report approved successfully");
      return { reportId, data: response.data };
    } catch (error) {
      // message.error(error);
      return rejectWithValue(error);
    }
  }
);

// rejectReport - Thêm API reject report
export const refundReport = createAsyncThunk(
  "feedback/refundReport",
  async ({ reportId, refundQuantity }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/report/refund/${reportId}`, {
        refundQuantity: refundQuantity,
      });
      // message.success("Report refunded successfully");
      return { reportId, data: response.data };
    } catch (error) {
      // message.error(error);
      return rejectWithValue(error);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbackHistory: [],
    activityLog: [],
    reports: [], // Thêm state cho reports
    loading: false,
    error: null,
    pageIndex: 1,
    pageSize: 10,
  },
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
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
      // fetchActivityLog
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
      })
      // fetchReports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // approveReport
      .addCase(approveReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật status của report trong state
        const reportIndex = state.reports.findIndex(
          (report) => report.id === action.payload.reportId
        );
        if (reportIndex !== -1) {
          state.reports[reportIndex].status = 1; // 1 là success
        }
      })
      .addCase(approveReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // rejectReport
      .addCase(refundReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(refundReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật status của report trong state
        const reportIndex = state.reports.findIndex(
          (report) => report.id === action.payload.reportId
        );
        if (reportIndex !== -1) {
          state.reports[reportIndex].status = 2;
        }
      })
      .addCase(refundReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setPageIndex, setPageSize } = feedbackSlice.actions;
export default feedbackSlice.reducer;
