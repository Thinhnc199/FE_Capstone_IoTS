import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendOtpRequest } from "../../api/apiConfig"; 

// Async thunk for sending OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      console.log("Sending OTP to:", email); 

      const response = await sendOtpRequest(email);
      console.log("OTP Sent Response Data:", response.data); 

      return response.data; 
    } catch (error) {
      console.error("Failed to send OTP:", error); 
      return rejectWithValue(error.message); 
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // When OTP request is pending
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      // When OTP request is successful
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      // When OTP request fails
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});


export const { resetAuthState } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
