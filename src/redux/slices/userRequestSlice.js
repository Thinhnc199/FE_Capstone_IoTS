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

export const userRequests = createAsyncThunk(
  "userrequest/userRequests",
  async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/user-request/listing`, {
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
export const fetchRequestDetails = createAsyncThunk(
  "accounts/userRequestDetail",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/user-request/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchStoreDetails = createAsyncThunk(
  "accounts/fetchStoreRequestDetails",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/store/get-store-details-by-user-id/${userId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const approveUserRequests = createAsyncThunk(
  "accounts/approveUserRequest",
  async ({ remark, id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `http://api/user-request/approve-user-request/${id}`,
        { remark }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const rejectUserRequests = createAsyncThunk(
  "accounts/rejectUserRequest",
  async ({ remark, id }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `http://api/user-request/reject-user-request/${id}`,
        { remark }
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
  pageIndex: 1,
  pageSize: 10,
  error: null,
  userRequest: [],
  userRequestDetail: {
    data: null,
    loading: false,
    error: null,
  },
  storeDetail: {
    data: null,
    message: "",
  },
  aproveUserRequest: [],
  rejectUserRequest: [],
};

// Redux Slice
const userRequestSlice = createSlice({
  name: "userrequest",
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
    handleAsyncState(builder, userRequests, (state, action) => {
      state.userRequest = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    handleAsyncState(builder, fetchRequestDetails, (state, action) => {
      state.userRequestDetail.data = action.payload;
      state.userRequestDetail.loading = false;
      state.userRequestDetail.error = null;
    });
    handleAsyncState(builder, fetchStoreDetails, (state, action) => {
      state.storeDetail.data = action.payload;
    });
    handleAsyncState(builder, approveUserRequests, (state, action) => {
      state.approveUserRequest.data = action.payload;
    });
    handleAsyncState(builder, rejectUserRequests, (state, action) => {
      state.rejectUserRequest.data = action.payload;
    });
  },
});

// Action creators
export const { setPageIndex, setPageSize } = userRequestSlice.actions;

export default userRequestSlice.reducer;
