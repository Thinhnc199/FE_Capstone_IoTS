import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Fetch users
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

// Active user
export const activeUsers = createAsyncThunk(
  "userList/activeUsers",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/user/activate-user/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// deActive user
export const deActiveUsers = createAsyncThunk(
  "userList/deActiveUsers",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/user/deactive-user/${id}`);
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
      // Fetch users
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
      })

      // Active user
      .addCase(activeUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(activeUsers.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(activeUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deActive user
      .addCase(deActiveUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(deActiveUsers.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(deActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action creators
export const { setPageIndex, setPageSize } = userListSlice.actions;

export default userListSlice.reducer;
