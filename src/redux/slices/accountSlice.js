import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Fetch users
export const fetchUsers = createAsyncThunk(
  "accounts/fetchUsers",
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
  "accounts/activeUsers",
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
  "accounts/deActiveUsers",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/user/deactive-user/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
//fetch role
export const fetchRole = createAsyncThunk(
  "accounts/fetchRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/roles`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
//update role
export const updateRole = createAsyncThunk(
  "accounts/updateRole",
  async ({ id, roleIdList }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/user/update-user-role/${id}`, {
        roleIdList,
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
  roles: [],
};
// Redux Slice
const accountListSlice = createSlice({
  name: "accounts",
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
      })
      // Fetch roles
      .addCase(fetchRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
      })
      .addCase(fetchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;

        console.log("action.payload:", action.payload); // Thêm câu lệnh log
        const updatedUser = action.payload; // Truy cập trực tiếp action.payload
        console.log("updatedUser:", updatedUser); // Thêm câu lệnh log

        if (updatedUser) {
          const index = state.users.findIndex(
            (user) => user.id === updatedUser.id
          );

          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        } else {
          console.error("Updated user data is undefined");
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action creators
export const { setPageIndex, setPageSize } = accountListSlice.actions;

export default accountListSlice.reducer;
