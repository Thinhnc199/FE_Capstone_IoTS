// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { submitStoreDetails, submitDocuments } from "../../api/apiConfig";

// export const submitStoreInfo = createAsyncThunk(
//   "storeRegistration/submitStoreInfo",
//   async (storeData, { rejectWithValue }) => {
//     try {
//       const response = await submitStoreDetails(storeData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const submitStoreDocuments = createAsyncThunk(
//   "storeRegistration/submitStoreDocuments",
//   async (documentData, { rejectWithValue }) => {
//     try {
//       const response = await submitDocuments(documentData.storeId, documentData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// const storeRegistrationSlice = createSlice({
//   name: "storeRegistration",
//   initialState: {
//     storeDetails: {},
//     documents: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(submitStoreInfo.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitStoreInfo.fulfilled, (state, action) => {
//         state.loading = false;
//         state.storeDetails = action.payload;
//       })
//       .addCase(submitStoreInfo.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(submitStoreDocuments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitStoreDocuments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.documents = action.payload;
//       })
//       .addCase(submitStoreDocuments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default storeRegistrationSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrUpdateStore, createOrUpdateBusinessLicense, uploadFiles, submitStoreRegistration, getStoreDetailsByUserId, getBusinessLicenseByStoreId } from "../../api/apiConfig";

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
      // console.log("Store API Response:", response); // Debug API response
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
      // console.log("Business License API Response:", response); // Debug API response
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

// Store Slice
const storeRegistrationSlice = createSlice({
  name: "storeRegistration",
  initialState: {
    storeInfo: null,
    loading: false,
    businessLicense: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      // Submit Store Approval
      .addCase(submitStoreApproval.fulfilled, (state) => {
        state.storeInfo = null;
      });
  },
});

export default storeRegistrationSlice.reducer;
