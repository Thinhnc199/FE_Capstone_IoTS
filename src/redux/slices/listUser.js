import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

export const fetchUsers = createAsyncThunk(
  "userList/fetchUsers",
  async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/user/listing`, {
        pageIndex,
        pageSize,
        searchKeyword,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// State ban đầu
const initialState = {
  loading: false,
  users: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 2,
  error: null,
};

// Redux Slice
const userListSlice = createSlice({
  name: "userList",
  initialState,
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPageIndex, setPageSize } = userListSlice.actions;
export default userListSlice.reducer;
