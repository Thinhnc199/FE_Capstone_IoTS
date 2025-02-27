import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Helper function to handle async states
const handleAsyncState = (builder, asyncThunk, onSuccess) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.loading = false;
      onSuccess?.(state, action);
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { pageIndex, pageSize, searchKeyword, startFilterDate, endFilterDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/api/iot-device/get-pagination`, {
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      });
      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/iot-device/get-iot-device-details-by-id/${id}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const initialState = {
  items: [],
  loading: false,
  pageIndex: 1,
  pageSize: 10,
  searchKeyword: "",
  startFilterDate: null,
  endFilterDate: null,
  ProductsDetail: {
    data: null,
    loading: false,
    error: null,
  },
};
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setsearchKeyword: (state, action) => {
      const { tab, keyword } = action.payload;
      state.filters[tab].searchKeyword = keyword;
    },
  },
  extraReducers: (builder) => {
    handleAsyncState(builder, fetchProducts, (state, action) => {
      state.items = action.payload;
    });
    handleAsyncState(builder, fetchProductDetails, (state, action) => {
      state.ProductsDetail.data = action.payload;
      state.ProductsDetail.loading = false;
      state.ProductsDetail.error = null;
    });
  },
});

export default productSlice.reducer;
