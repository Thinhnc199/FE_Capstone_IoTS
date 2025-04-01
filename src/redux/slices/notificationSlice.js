// notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../api/apiConfig";

// Lấy danh sách tất cả thông báo
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/notification/get-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Đếm số thông báo chưa đọc
export const countUnreadNotifications = createAsyncThunk(
  "notification/countUnreadNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/notification/count-not-read-notification");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Đánh dấu tất cả thông báo là đã đọc (khi đóng dropdown)
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.data.filter((n) => !n.isRead).length; // Tính số chưa đọc
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Count Unread Notifications
      .addCase(countUnreadNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(countUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.data; // Giả sử API trả về số lượng
      })
      .addCase(countUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;