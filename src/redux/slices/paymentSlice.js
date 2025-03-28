import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  api  from './../../api/apiConfig'; // Import instance api từ apiConfig

export const createVnPayPayment = createAsyncThunk(
  'payment/createVnPayPayment',
  async ({ amount, returnUrl }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/vnpay/vnpay-create-pay-with-account', {
        params: {
          amount,
          returnUrl
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkVnPayPayment = createAsyncThunk(
  'payment/checkVnPayPayment',
  async (urlResponse, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/vnpay/check-payment', {
        urlResponse
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getWalletBalance = createAsyncThunk(
  'payment/getWalletBalance',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/wallet/get-wallet-by-user-id/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentUrl: null,
    paymentResult: null,
    wallet: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.paymentUrl = null;
      state.paymentResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVnPayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVnPayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload;
      })
      .addCase(createVnPayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkVnPayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkVnPayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
      })
      .addCase(checkVnPayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.data;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;