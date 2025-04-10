import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

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

export const getStatisticAdmin = createAsyncThunk(
  "statistic/getStatisticAdmin",
  async (params, { rejectWithValue }) => {
    try {
      // Gửi params trực tiếp vì nó có thể là { year } hoặc { year, month }
      const response = await api.post(`/api/statistic/admin/get`, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const getStatisticStore = createAsyncThunk(
  "statistic/getStatisticStore",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/statistic/store/get`, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const getStatisticTrainer = createAsyncThunk(
  "statistic/getStatisticTrainer",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/statistic/trainer/get`, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const initialState = {
  dataStatistic: null,
  loading: false,
  error: null,
};

const statistic = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncState(builder, getStatisticAdmin, (state, action) => {
      state.dataStatistic = action.payload.data;
    });
    handleAsyncState(builder, getStatisticStore, (state, action) => {
      state.dataStatistic = action.payload.data;
    });
    handleAsyncState(builder, getStatisticTrainer, (state, action) => {
      state.dataStatistic = action.payload.data;
    });
  },
});

export default statistic.reducer;
