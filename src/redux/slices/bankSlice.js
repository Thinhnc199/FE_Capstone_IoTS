import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBanks = createAsyncThunk(
  "banks/fetchBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.vietqr.io/v2/banks");
      if (response.data.code === "00" && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch bank list");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching bank list"
      );
    }
  }
);

const bankSlice = createSlice({
  name: "banks",
  initialState: {
    banks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bankSlice.reducer;