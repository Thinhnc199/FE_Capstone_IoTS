import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getUserById } from "../../api/apiConfig";
import api from "../../api/apiConfig";
export const fetchUserDetail = createAsyncThunk(
  "user/fetchUserDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/user/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// State ban đầu
const initialState = {
  loading: false,
  user: null,
  error: null,
};

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
