// redux/labSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../../api/apiConfig';
import { message } from "antd";
// Action Types
export const getLabMemberPagination = createAsyncThunk(
  'lab/getLabMemberPagination',
  async ({ comboId, params }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/member/get-lab-pagination/${comboId}`, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLabStorePagination = createAsyncThunk(
  'lab/getLabStorePagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/lab/store-management/get-lab-pagination', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLabTrainerPagination = createAsyncThunk(
  'lab/getLabTrainerPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/lab/trainer-management/get-lab-pagination', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLabCustomerPagination = createAsyncThunk(
  'lab/getLabCustomerPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/lab/user-management/get-lab-pagination', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const getLabAdminPagination = createAsyncThunk(
  'lab/getLabAdminPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/lab/admin-manager-management/get-lab-pagination', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLabInformation = createAsyncThunk(
  'lab/createLabInformation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/lab/trainer-management/create-lab-information', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLabVideoPlaylist = createAsyncThunk(
  'lab/createLabVideoPlaylist',
  async ({ labId, playlist }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/trainer-management/create-or-update-lab-video-playlist/${labId}`, playlist);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLabPlaylist = createAsyncThunk(
  'lab/getLabPlaylist',
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/lab/get-lab-playlist/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLabInformation = createAsyncThunk(
  'lab/getLabInformation',
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/lab/get-lab-information/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const submitLab = createAsyncThunk(
  'lab/submitLab',
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/trainer-management/submit-lab/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLabInformation = createAsyncThunk(
  'lab/updateLabInformation',
  async ({ labId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/lab/trainer-management/update-lab-information/${labId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Approve Lab
export const approveLab = createAsyncThunk(
  "lab/approveLab",
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/store-management/approve/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve lab");
    }
  }
);

// Reject Lab
export const rejectLab = createAsyncThunk(
  "lab/rejectLab",
  async ({ labId, remark }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/store-management/reject/${labId}`, { remark });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to reject lab");
    }
  }
);

// Thêm action upload video
export const uploadLabVideo = createAsyncThunk(
  "lab/uploadLabVideo",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // API mong đợi key "file"

      const response = await api.post("/api/file/upload-videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percent}%`);
        },
      });
      if (response.status === 200 && response.data.isSuccess) {
        // message.success("Video uploaded successfully!");
        return response.data.data; // { id, fileName, fileSize }
      }

      return rejectWithValue("Failed to upload video");
    } catch (error) {
      console.error("❌ Video Upload Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload video. Please try again.";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial State
const initialState = {
  labs: [],
  playlist: [],
  labInfo: null,
  videoUrl: null, // Lưu URL của video vừa upload
  videoFileName: null, // Lưu tên file video
  loading: false,
  error: null,
};

// Slice
const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetVideoState: (state) => { // Reset trạng thái video
      state.videoUrl = null;
      state.videoFileName = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Lab Member Pagination
      .addCase(getLabMemberPagination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabMemberPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = action.payload;
      })
      .addCase(getLabMemberPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lab Store Pagination
      .addCase(getLabStorePagination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabStorePagination.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = action.payload.data;
      })
      .addCase(getLabStorePagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

 // Get Lab Store Pagination
 .addCase(getLabCustomerPagination.pending, (state) => {
  state.loading = true;
})
.addCase(getLabCustomerPagination.fulfilled, (state, action) => {
  state.loading = false;
  state.labs = action.payload.data;
})
.addCase(getLabCustomerPagination.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      
      // Get Lab Trainer Pagination
      .addCase(getLabTrainerPagination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabTrainerPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = action.payload;
      })
      .addCase(getLabTrainerPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lab Admin Pagination
      .addCase(getLabAdminPagination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabAdminPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = action.payload;
      })
      .addCase(getLabAdminPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Lab Information
      .addCase(createLabInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLabInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.labInfo = action.payload.data;
      })
      .addCase(createLabInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Lab Information
      .addCase(updateLabInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.labInfo = action.payload.data; 
      })
      .addCase(updateLabInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Lab Video Playlist
      .addCase(createLabVideoPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLabVideoPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlist = action.payload;
      })
      .addCase(createLabVideoPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lab Playlist
      .addCase(getLabPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlist = action.payload;
      })
      .addCase(getLabPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lab Information
      .addCase(getLabInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.labInfo = action.payload.data;
      })
      .addCase(getLabInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Lab
      .addCase(submitLab.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLab.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Lab
      .addCase(approveLab.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveLab.fulfilled, (state, action) => {
        state.loading = false;
        if (state.labInfo && state.labInfo.id === action.meta.arg) {
          state.labInfo.status = 1; // Update status to "Approved"
        }
      })
      .addCase(approveLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject Lab
      .addCase(rejectLab.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectLab.fulfilled, (state, action) => {
        state.loading = false;
        if (state.labInfo && state.labInfo.id === action.meta.arg.labId) {
          state.labInfo.status = 3; // Update status to "Rejected"
        }
      })
      .addCase(rejectLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Lab Video
      .addCase(uploadLabVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLabVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUrl = action.payload.id; // Lưu URL video
        state.videoFileName = action.payload.fileName; // Lưu tên file
      })
      .addCase(uploadLabVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetVideoState } = labSlice.actions;
export default labSlice.reducer;