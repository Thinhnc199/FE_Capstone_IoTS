import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";
import { message } from "antd";

export const sendOtpStore = createAsyncThunk(
  "store/sendOtpStore",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/store/create-store-user-request-verify-otp", { email });
      message.success("OTP sent successfully!");
      return { email, response: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerStoreUser = createAsyncThunk(
  "store/registerStoreUser",
  async ({ userInfo, otp, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/store/register-store-user", {
        userInfomation: userInfo,
        otp,
        password,
      });
      message.success("Store registered successfully! Redirecting...");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: {
    loading: false,
    error: null,
    userEmail: null, //Store user email here
  },
  reducers: {
    resetStoreState: (state) => {
      state.loading = false;
      state.error = null;
      state.userEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpStore.fulfilled, (state, action) => {
        state.loading = false;
        state.userEmail = action.payload.email; //Save email in Redux
      })
      .addCase(registerStoreUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerStoreUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerStoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration error";
      });
  },
});

export const { resetStoreState } = storeSlice.actions;
export default storeSlice.reducer;
