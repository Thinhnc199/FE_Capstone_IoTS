// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/apiConfig";
// import { message } from "antd";

// // storeSlice.js

// export const sendOtpStore = createAsyncThunk(
//   "store/sendOtpStore",
//   async ({ email, roleId }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/api/store/create-store-user-request-verify-otp", { email, roleId });
//       message.success("OTP sent successfully!");
//       return { email, response: response.data };
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to send OTP";
//       message.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // export const sendOtpStore = createAsyncThunk(
// //   "store/sendOtpStore",
// //   async (email, { rejectWithValue }) => {
// //     try {
// //       const response = await api.post("/api/store/create-store-user-request-verify-otp", { email });
// //       message.success("OTP sent successfully!");
// //       return { email, response: response.data };
// //     } catch (error) {
// //       const errorMessage = error.response?.data?.message || "Failed to send OTP";
// //       message.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// export const registerStoreUser = createAsyncThunk(
//   "store/registerStoreUser",
//   async ({ userInfo, otp, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/api/store/register-store-user", {
//         userInfomation: userInfo,
//         otp,
//         password,
//       });
//       message.success("Store registered successfully! Redirecting...");
//       return response.data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Registration failed";
//       message.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const storeSlice = createSlice({
//   name: "store",
//   initialState: {
//     loading: false,
//     error: null,
//     userEmail: null, //Store user email here
//   },
//   reducers: {
//     resetStoreState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.userEmail = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(sendOtpStore.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userEmail = action.payload.email; //Save email in Redux
//       })
//       .addCase(registerStoreUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerStoreUser.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(registerStoreUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Registration error";
//       });
//   },
// });

// export const { resetStoreState } = storeSlice.actions;
// export default storeSlice.reducer;

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
      console.error("❌ Full API Error Object:", error);

      // ✅ Nếu lỗi đã là string, trả về trực tiếp
      if (typeof error === "string") {
        return rejectWithValue(error);
      }

      // ✅ Nếu API trả về lỗi 400 có message, hiển thị message
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.message
      ) {
        return rejectWithValue(error.response.data.message);
      }

      // Nếu API không phản hồi, trả về lỗi mạng
      return rejectWithValue(
        "No response from server. Please check your connection."
      );
    }
  }
);

// ✅ Send OTP for Store/Trainer Registration
// export const sendOtp = createAsyncThunk(
//   "store/sendOtp",
//   async ({ email, role }, { rejectWithValue }) => {
//     try {
//       const apiEndpoint =
//         role === 4
//           ? "/api/trainer/create-trainer-user-request-verify-otp"
//           : "/api/store/create-store-user-request-verify-otp";

//       const response = await api.post(apiEndpoint, { email });

//       if (response.status !== 200) {
//         return rejectWithValue("Failed to send OTP.");
//       }

//       return response.data;
//     } catch (error) {
//       // Lấy thông báo từ API nếu có
//       const errorMessage = error.response?.data?.message || "Failed to send OTP.";

//       // Hiển thị lỗi trên giao diện
//       message.error(errorMessage);
//       console.error("API Error:", errorMessage);

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// ✅ Register User (Store or Trainer)
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
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// get product store by user
// export const fetchProductStoreid = createAsyncThunk(
//   "store/fetchProductStoreid",
//   async (
//     {
//       storeID,
//       pageIndex,
//       pageSize,
//       searchKeyword,
//       startFilterDate,
//       endFilterDate,
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await api.post(
//         `/api/store/get-pagination-product-by-stores-id`,
//         {
//           pageIndex,
//           pageSize,
//           searchKeyword,
//           startFilterDate,
//           endFilterDate,
//         },
//         { storeID: storeID }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );
export const fetchProductStoreid = createAsyncThunk(
  "store/fetchProductStoreid",
  async (
    {
      storeID,
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        storeID,
        pageIndex,
        pageSize,
        searchKeyword,
      };

      // Thêm startFilterDate và endFilterDate nếu chúng không null
      if (startFilterDate) params.startFilterDate = startFilterDate;
      if (endFilterDate) params.endFilterDate = endFilterDate;

      const response = await api.post(
        `/api/store/get-pagination-product-by-stores-id`,
        params
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Store Slice
const storeSlice = createSlice({
  name: "store",
  initialState: {
    email: "",
    selectedRole: 6,
    loading: false,
    error: null,
    success: false,
    dataProduct: [],
  },
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling sendOtp action
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

      // Handling registerUser action
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
      })
      // dataa product story get by usser
      .addCase(fetchProductStoreid.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchProductStoreid.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.dataProduct = action.payload?.data || []; // Tránh lỗi khi API không trả về data
      })

      .addCase(fetchProductStoreid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setRole } = storeSlice.actions;

export default storeSlice.reducer;
