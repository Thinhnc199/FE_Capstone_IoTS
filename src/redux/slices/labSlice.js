// redux/labSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../../api/apiConfig';

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
      const response = await api.post(`/api/lab/trainer-management/create-lab-video-playlist/${labId}`, playlist);
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

export const approveLab = createAsyncThunk(
  'lab/approveLab',
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/store-management/approve/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectLab = createAsyncThunk(
  'lab/rejectLab',
  async (labId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/lab/store-management/reject/${labId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial State
const initialState = {
  labs: [],
  playlist: [],
  labInfo: null,
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
        state.labs = action.payload;
      })
      .addCase(getLabStorePagination.rejected, (state, action) => {
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
        state.labInfo = action.payload;
      })
      .addCase(createLabInformation.rejected, (state, action) => {
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
        state.labInfo = action.payload;
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
      .addCase(approveLab.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject Lab
      .addCase(rejectLab.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectLab.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rejectLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = labSlice.actions;
export default labSlice.reducer;