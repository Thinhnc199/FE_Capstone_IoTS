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
export const createProducts = createAsyncThunk(
  "products/createProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/iot-device/create-iot-device`, {
        ...productData,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const activeProducts = createAsyncThunk(
  "products/activeProducts",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/iot-device/activate-iot-device/${id}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const deactiveProducts = createAsyncThunk(
  "products/deactiveProducts",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/iot-device/deactivate-iot-device/${id}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getUrlImg = createAsyncThunk(
  "products/getUrlImg",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/file/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.isSuccess) {
        return response.data.data.id;
      } else {
        return rejectWithValue(response.data.message || "Upload failed");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload error");
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
  error: null,
  totalCount: 0,

  ProductsDetail: {
    data: null,
    loading: false,
    error: null,
  },

  ProductDatas: {
    name: "",
    deviceType: 1,
    isHardwareInformation: 0,
    mcU_MPU: "",
    memory: "",
    wirelessConnection: "",
    connectivity: "",
    sensor: "",
    isNetworkConnection: 0,
    protocol: "",
    dataTransmissionStandard: "",
    networkSecurity: "",
    isSoftwareOrOperations: 0,
    firmware: "",
    firmwareVersion: 0,
    embeddedEperatingSystem: "",
    cloudservice: "",
    firmwareOTASupport: 0,
    isPowerSource: 0,
    operatingVoltage: "",
    powerConsumption: "",
    powerSource: "",
    isSecurity: 0,
    dataEncryption: "",
    deviceAuthentication: "",
    connectionDelay: "",
    processingSpeed: "",
    serviceLife: "",
    durability: "",
    summary: "",
    description: "",
    categoryId: 0,
    manufacturer: "",
    model: "",
    serialNumber: "",
    specifications: "",
    notes: "",
    price: 0,
    quantity: 0,
    storeId: 0,
    imageUrl: "",
    secondHandPrice: 0,
    secondhandQualityPercent: 0,
    attachments: [],
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
    // setsearchKeyword: (state, action) => {
    //   const { tab, keyword } = action.payload;
    //   state.filters[tab].searchKeyword = keyword;
    // },
    setsearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setStartFilterDate: (state, action) => {
      state.startFilterDate = action.payload;
    },
    setEndFilterDate: (state, action) => {
      state.endFilterDate = action.payload;
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
    handleAsyncState(builder, createProducts, (state, action) => {
      state.ProductDatas.data = action.payload;
      state.ProductDatas.loading = false;
      state.ProductDatas.error = null;
    });
    handleAsyncState(builder, activeProducts, (state, action) => {
      // const updatedUser = action.payload;
      // const index = state.users.findIndex((user) => user.id === updatedUser.id);
      // if (index !== -1) {
      //   state.users[index] = updatedUser;
      // }
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    });
    handleAsyncState(builder, deactiveProducts, (state, action) => {
      const updatedProduct = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === updatedProduct.id
      );
      if (index !== -1) {
        state.items[index] = updatedProduct;
      }
    });
  },
});
export const {
  setPageIndex,
  setPageSize,
  setsearchKeyword,
  setEndFilterDate,
  setStartFilterDate,
} = productSlice.actions;
export default productSlice.reducer;
