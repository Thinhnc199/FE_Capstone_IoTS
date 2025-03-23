
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";
import { message } from "antd";

export const sendOtp = createAsyncThunk(
  "store/sendOtp",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const apiEndpoint =
        role === 4
          ? "/api/trainer/create-trainer-user-request-verify-otp"
          : "/api/store/create-store-user-request-verify-otp";

      const response = await api.post(apiEndpoint, { email });

      if (response.status !== 200) {
        return rejectWithValue("Failed to send OTP.");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Full API Error Object (sendOtp):", error);

      if (typeof error === "string") {
        return rejectWithValue(error);
      }

      if (error.response && error.response.status === 400 && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue("No response from server. Please check your connection.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "store/registerUser",
  async ({ userInfo, otp, password, roleId }, { rejectWithValue }) => {
    const registerApi =
      roleId === 4
        ? "/api/trainer/register-trainer-user"
        : "/api/store/register-store-user";

    try {
      const response = await api.post(registerApi, {
        userInfomation: userInfo,
        otp,
        password,
      });

      if (response.status === 200) {
        message.success("User registered successfully!");
        return response.data;
      }

      return rejectWithValue("Registration failed");
    } catch (error) {
      console.error("❌ Full Registration Error Object:", error);

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.message || "Registration failed due to invalid data.";
        message.error(errorMessage);
        return rejectWithValue(error.response.data);
      }

      const genericError = error || "Registration failed. Please try again.";
      message.error(genericError);
      return rejectWithValue(genericError);
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: {
    email: "",
    selectedRole: 6,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setRole, clearError } = storeSlice.actions;

export default storeSlice.reducer;

