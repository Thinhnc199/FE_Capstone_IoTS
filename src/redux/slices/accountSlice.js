import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Helper function to handle async states
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

// Thunks
export const fetchUsers = createAsyncThunk(
  "accounts/fetchUsers",
  async (
    {
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
      role,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/api/user/listing/`,
        {
          pageIndex,
          pageSize,
          searchKeyword,
          startFilterDate,
          endFilterDate,
        },
        {
          params: { role },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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

export const createManagerStaffs = createAsyncThunk(
  "accounts/createManagerStaff",
  async ({ email, fullname, phone, address, roleId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/staff-manager/create-staff-manager-request`,
        {
          email,
          fullname,
          phone,
          address,
          roleId,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const verifyAccounts = createAsyncThunk(
  "accounts/verifyAccount",
  async ({ otp, requestId, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/staff-manager/verify-staff-manager-otp`,
        {
          otp,
          requestId,
          password,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  users: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  error: null,
  roles: [],
  filters: {
    all: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    admin: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    store: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    customer: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    staff: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    manager: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
    trainer: {
      searchKeyword: "",
      startFilterDate: null,
      endFilterDate: null,
    },
  },
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
    setsearchKeyword: (state, action) => {
      const { tab, keyword } = action.payload;
      state.filters[tab].searchKeyword = keyword;
    },
    setStartFilterDate: (state, action) => {
      const { tab, date } = action.payload;
      state.filters[tab].startFilterDate = date;
    },
    setEndFilterDate: (state, action) => {
      const { tab, date } = action.payload;
      state.filters[tab].endFilterDate = date;
    },
  },
  extraReducers: (builder) => {
    handleAsyncState(builder, fetchUsers, (state, action) => {
      state.users = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });

    handleAsyncState(builder, activeUsers, (state, action) => {
      // const updatedUser = action.payload;
      // const index = state.users.findIndex((user) => user.id === updatedUser.id);
      // if (index !== -1) {
      //   state.users[index] = updatedUser;
      // }
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    });

    handleAsyncState(builder, deActiveUsers, (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });

    handleAsyncState(builder, fetchRole, (state, action) => {
      state.roles = action.payload.data;
    });

    handleAsyncState(builder, updateRole, (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });

    handleAsyncState(builder, createManagerStaffs, (state, action) => {
      state.users.unshift(action.payload); // Add new user to the start of the list
      state.totalCount += 1;
    });
  },
});

// Action creators
export const {
  setPageIndex,
  setPageSize,
  setsearchKeyword,
  setEndFilterDate,
  setStartFilterDate,
} = accountListSlice.actions;

export default accountListSlice.reducer;
