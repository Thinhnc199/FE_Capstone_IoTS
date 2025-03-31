// walletSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../../api/apiConfig';

export const getCashoutRequests = createAsyncThunk(
  'wallet/getCashoutRequests',
  async ({ statusFilter, pageIndex = 0, pageSize = 10, searchKeyword = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/cashout-request/get-pagination', {
        pageIndex,
        pageSize,
        searchKeyword
      }, {
        params: { statusFilter }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCashoutRequest = createAsyncThunk(
  'wallet/createCashoutRequest',
  async (cashoutData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/cashout-request/create', cashoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const approveCashoutRequest = createAsyncThunk(
  'wallet/approveCashoutRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/cashout-request/approve/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectCashoutRequest = createAsyncThunk(
  'wallet/rejectCashoutRequest',
  async ({ id, remark }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/cashout-request/reject/${id}`, { remark });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async ({ pageIndex = 0, pageSize = 20, searchKeyword = '' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/transaction/get-transaction-pagination', {
        pageIndex,
        pageSize,
        searchKeyword
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    cashoutRequests: {
      data: [],
      pageIndex: 0,
      pageSize: 10,
      totalCount: 0
    },
    transactions: {
      data: [],
      pageIndex: 0,
      pageSize: 20,
      totalCount: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Get Cashout Requests
    builder
      .addCase(getCashoutRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCashoutRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.cashoutRequests = action.payload.data;
      })
      .addCase(getCashoutRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Cashout Request
      .addCase(createCashoutRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCashoutRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCashoutRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Cashout Request
      .addCase(approveCashoutRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCashoutRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveCashoutRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject Cashout Request
      .addCase(rejectCashoutRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCashoutRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rejectCashoutRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;