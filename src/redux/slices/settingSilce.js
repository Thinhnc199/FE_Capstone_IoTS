import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Hàm xử lý trạng thái chung cho async actions
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
      state.error =
        action.payload || action.payload?.message || "Có lỗi xảy ra";
    });
};

export const getGeneralSettings = createAsyncThunk(
  "settingSilce/getGeneralSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/general-settings/get");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateGeneralSettings = createAsyncThunk(
  "settingSilce/UpdateGeneralSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/general-settings/update", {
        id: payload.id,
        applicationFeePercent: Number(payload.applicationFeePercent),
        orderSuccessDays: Number(payload.orderSuccessDays),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dataGeneralSettings: null, // Thay đổi từ [] sang null
  loading: false,
  error: null,
};

const settingSilce = createSlice({
  name: "settingSilce",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Xử lý get settings
    handleAsyncState(builder, getGeneralSettings, (state, action) => {
      state.dataGeneralSettings = action.payload.data;
    });

    // Xử lý update settings
    handleAsyncState(builder, UpdateGeneralSettings, (state, action) => {
      state.dataGeneralSettings = action.payload.data;
    });
  },
});

export default settingSilce.reducer;
