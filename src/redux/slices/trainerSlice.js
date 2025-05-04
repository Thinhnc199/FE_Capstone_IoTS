// src/redux/slices/trainerRegisterSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiConfig';
import { getTrainerBusinessLicense } from "../../api/apiConfig";


export const fetchUserStatus = createAsyncThunk(
  "storeRegistration/fetchUserStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
      return response.data.data.userRequestInfo; 
    } catch (error) {
      console.error("Error fetching user status:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch user status");
    }
  }
);

// Async Thunks để xử lý các yêu cầu API
export const submitTrainerDocuments = createAsyncThunk(
  'trainerRegister/submitTrainerDocuments',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/trainer/create-or-update-trainer-business-license', formData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTrainerBusinessLicenseDetails = createAsyncThunk(
  "trainerRegistration/getTrainerBusinessLicenseDetails",
  async (trainerId, { rejectWithValue }) => {
    try {
      const response = await getTrainerBusinessLicense(trainerId);
      console.log("Trainer Business License API Response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching trainer business license:", error);
      return rejectWithValue(error || "Failed to fetch trainer business license");
    }
  }
);

export const submitForApproval = createAsyncThunk(
  'trainerRegister/submitForApproval',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/trainer/submit-pending-to-approve-trainer-request/${requestId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice cho Trainer Register
const trainerSlice = createSlice({
  name: 'trainerRegister',
  initialState: {
    documents: {
      frontIdentification: null,
      backIdentification: null,
      businessLicences: null,
    },
    currentStep: 0,
    requestStatus: "",
    requestId: null,
    remark: "",
    loading: false,
    error: null,
    userId: localStorage.getItem('userId'), 
  },
  reducers: {
    setDocuments: (state, action) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setRequestStatus: (state, action) => {
      state.requestStatus = action.payload;
    },
    setRequestId: (state, action) => {
      state.requestId = action.payload;
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
          state.status = action.payload?.userRequestStatus?.label || "No";
          state.remark = action.payload?.remark || "";
        })
        .addCase(fetchUserStatus.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      .addCase(submitTrainerDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTrainerDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.requestId = action.payload.requestId; 
      })
      .addCase(submitTrainerDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForApproval.fulfilled, (state) => {
        state.loading = false;
        state.requestStatus = "Pending to Approved";
        state.requestStatus = "Approved";
        state.requestStatus = "Rejected"; 
        state.currentStep = 1;
      })
      .addCase(submitForApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDocuments,
  setCurrentStep,
  setRequestStatus,
  setRequestId,
} = trainerSlice.actions;

export default trainerSlice.reducer;
