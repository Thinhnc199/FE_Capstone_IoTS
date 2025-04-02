import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";
import { message } from "antd";

const handleAsyncState = (builder, asyncThunk, onSuccess) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.loading = false;
      onSuccess?.(state, action);
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};

export const getRecentChat = createAsyncThunk(
  "chatSlices/getRecentChat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/Message/recent-chats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
export const getAllChat = createAsyncThunk(
  "chatSlices/getAllChat",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/Message/get-all-chats-sender-reciver?receiverId=${receiverId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
export const chatRabbit = createAsyncThunk(
  "chatSlices/chatRabbit",
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/Message/Chat-RabbitMQ`, {
        receiverId: receiverId,
        content: content,
      });
      return response.data;
    } catch (error) {
      message.error(error);
      return rejectWithValue(error.toString());
    }
  }
);

// history order

const initialState = {
  dataRecent: [],
  dataAllChat: [],
};
const chatSlice = createSlice({
  name: "chatSlices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncState(builder, getRecentChat, (state, action) => {
      state.dataRecent = action.payload.data;
    });
    handleAsyncState(builder, getAllChat, (state, action) => {
      state.dataAllChat = action.payload.data;
    });
    handleAsyncState(builder, chatRabbit, (state, action) => {
      state.dataAllChat.push(action.payload.data);
    });
  },
});
// export const {} = orderSlice.actions;
export default chatSlice.reducer;
