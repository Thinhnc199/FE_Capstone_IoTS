
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrUpdateStore, createOrUpdateBusinessLicense, uploadFiles, submitStoreRegistration, getStoreDetailsByUserId, getBusinessLicenseByStoreId } from "../../api/apiConfig";
import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`,
  },
});

// Upload Image Action
export const uploadImage = createAsyncThunk(
  "storeRegistration/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadFiles(file);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

// ✅ Async Thunk để lấy trạng thái người dùng từ API
export const fetchUserStatus = createAsyncThunk(
  "storeRegistration/fetchUserStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
      return response.data.data.userRequestInfo; // Trả về dữ liệu userRequestInfo
    } catch (error) {
      console.error("Error fetching user status:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch user status");
    }
  }
);

// Submit Store Info
export const submitStoreInfo = createAsyncThunk(
  "storeRegistration/submitStoreInfo",
  async ({ userId, storeData }, { rejectWithValue }) => {
    try {
      const response = await createOrUpdateStore(userId, storeData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit store info");
    }
  }
);

// Submit Store Documents
export const submitStoreDocuments = createAsyncThunk(
  "storeRegistration/submitStoreDocuments",
  async (licenseData, { rejectWithValue }) => {
    try {
      // console.log("Send API:", licenseData);
      return await createOrUpdateBusinessLicense(licenseData); 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit store documents");
    }
  }
);

// // Fetch Store Details
// export const getStoreDetails = createAsyncThunk(
//   "storeRegistration/getStoreDetails",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await getStoreDetailsByUserId(userId); // Call the API function
//       return response; // Store details data
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch store details");
//     }
//   }
// );
// Fetch Store Details
export const getStoreDetails = createAsyncThunk(
  "storeRegistration/getStoreDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getStoreDetailsByUserId(userId);
      console.log("Store API Response:", response); 
      return response; 
    } catch (error) {
      console.error("Error fetching store details:", error);
      return rejectWithValue(error.message || "Failed to fetch store details");
    }
  }
);

// Fetch Business License Details
export const getBusinessLicenseDetails = createAsyncThunk(
  "storeRegistration/getBusinessLicenseDetails",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await getBusinessLicenseByStoreId(storeId);
      console.log("Business License API Response:", response); 
      return response; 
    } catch (error) {
      console.error("Error fetching business license:", error);
      return rejectWithValue(error.message || "Failed to fetch business license");
    }
  }
);

// // Fetch Business License Details
// export const getBusinessLicenseDetails = createAsyncThunk(
//   "storeRegistration/getBusinessLicenseDetails",
//   async (storeId, { rejectWithValue }) => {
//     try {
//       const response = await getBusinessLicenseByStoreId(storeId); // Call the API function
//       return response; // Business license data
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch business license");
//     }
//   }
// );

// Submit Store Approval
export const submitStoreApproval = createAsyncThunk(
  "storeRegistration/submitStoreApproval",
  async (requestId, { rejectWithValue }) => {
    try {
      return await submitStoreRegistration(requestId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit store approval");
    }
  }
);

//---------------------------------------------------------------
// Fetch Wallet Balance
export const getWalletBalance = createAsyncThunk(
  "storeRegistration/getWalletBalance",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/wallet/get-wallet-by-user-id/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch wallet balance");
    }
  }
);

// Fetch Membership Options
export const getMembershipOptions = createAsyncThunk(
  "storeRegistration/getMembershipOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/account-membership-package/get-all-membership-package-options');
      console.log("🔍 API Response:", response.data); // Debug API response
      return Array.isArray(response.data.data) ? response.data.data : []; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch membership options');
    }
  }
);


export const registerMembershipPackage = createAsyncThunk(
  "storeRegistration/registerMembershipPackage",
  async (data, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending request:", data);
      const response = await api.post("/api/account-membership-package/register-membership-package", data);
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("❌ API Error:", error.response?.data); // Debug lỗi API
      return rejectWithValue(error.response?.data?.message || "An error occurred.");
    }
  }
);


// Store Slice
const storeRegistrationSlice = createSlice({
  name: "storeRegistration",
  initialState: {
    storeInfo: null,
    status: null,
    remark: "",
    loading: false,
    businessLicense: null,
    error: null,
    requestStatus: "",
    walletBalance: 0,
    membershipPackages: [],
    errorMessage: null,
    userId: localStorage.getItem('userId'), 
  },
  reducers: {
    setRequestStatus: (state, action) => {
      state.requestStatus = action.payload;  
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUserStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.status = action.payload?.userRequestStatus?.label;
      state.remark = action.payload?.remark || "";
    })
    .addCase(fetchUserStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      // Upload Image
      .addCase(uploadImage.pending, (state) => { state.loading = true; })
      .addCase(uploadImage.fulfilled, (state) => { state.loading = false; })
      .addCase(uploadImage.rejected, (state, action) => { state.error = action.payload; state.loading = false; })

      // Submit Store Info
      .addCase(submitStoreInfo.pending, (state) => { state.loading = true; })
      .addCase(submitStoreInfo.fulfilled, (state, action) => {
        state.storeInfo = action.payload;
        state.loading = false;
      })
      .addCase(submitStoreApproval.fulfilled, (state) => {
        state.loading = false;
        state.requestStatus = "Pending to Approved"; 
        state.requestStatus = "Approved"; 
        state.requestStatus = "Rejected"; 
        state.storeInfo = null;
      })
      .addCase(submitStoreInfo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Submit Store Documents
      .addCase(submitStoreDocuments.pending, (state) => { state.loading = true; })
      .addCase(submitStoreDocuments.fulfilled, (state, action) => {
        if (state.storeInfo) {
          state.storeInfo.documents = action.payload;
        }
        state.loading = false;
      })
      .addCase(submitStoreDocuments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Handle the fetch of store details
      .addCase(getStoreDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreDetails.fulfilled, (state, action) => {
        state.storeInfo = action.payload;
        state.loading = false;
      })
      .addCase(getStoreDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Handle the fetch of business license details
      .addCase(getBusinessLicenseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessLicenseDetails.fulfilled, (state, action) => {
        state.businessLicense = action.payload;
        state.loading = false;
      })
      .addCase(getBusinessLicenseDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })


      .addCase(getWalletBalance.pending, (state) => { state.loading = true; })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.walletBalance = action.payload.data.ballance;
        state.loading = false;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Handle membership options
      .addCase(getMembershipOptions.pending, (state) => { state.loading = true; })
      .addCase(getMembershipOptions.fulfilled, (state, action) => {
        state.membershipOptions = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(getMembershipOptions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Handle register membership
      .addCase(registerMembershipPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerMembershipPackage.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Success:', action.payload); 
      })
      // In your store slice
.addCase(registerMembershipPackage.rejected, (state, action) => {
  state.loading = false;
  state.errorMessage = action.payload || "Failed to register membership package";
  console.error('Failed:', action.payload); 
});

      
      
      
  },
});

export default storeRegistrationSlice.reducer;
