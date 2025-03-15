// src/redux/slices/addressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiConfig'; 
import { notification } from 'antd';

const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
  });
};

// Async thunks
export const fetchProvinces = createAsyncThunk(
  'address/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/GHTK/provinces');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDistricts = createAsyncThunk(
  'address/fetchDistricts',
  async (provinceId, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/GHTK/districts', {
        params: { provinceId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchWards = createAsyncThunk(
  'address/fetchWards',
  async (prodistrictId, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/GHTK/wards', {
        params: { prodistrictId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    provinces: [],
    districts: [],
    wards: [],
    selectedProvince: null,
    selectedDistrict: null,
    selectedWard: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedProvince: (state, action) => {
      state.selectedProvince = action.payload;
      state.districts = [];
      state.wards = [];
      state.selectedDistrict = null;
      state.selectedWard = null;
    },
    setSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      state.wards = [];
      state.selectedWard = null;
    },
    setSelectedWard: (state, action) => {
      state.selectedWard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showNotification('error', 'Lỗi', 'Không thể tải danh sách tỉnh/thành phố');
      })
      // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showNotification('error', 'Lỗi', 'Không thể tải danh sách quận/huyện');
      })
      // Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showNotification('error', 'Lỗi', 'Không thể tải danh sách phường/xã');
      });
  },
});

export const { setSelectedProvince, setSelectedDistrict, setSelectedWard } = addressSlice.actions;
export default addressSlice.reducer;