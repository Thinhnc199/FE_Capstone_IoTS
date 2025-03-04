// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/apiConfig";


// // Fetch paginated combos
// export const fetchCombos = createAsyncThunk(
//   "combo/fetchCombos",
//   async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
//     try {
//       console.log("📡 API Call Params:", { pageIndex, pageSize, searchKeyword });


//       const response = await api.post(`/api/combo/get-pagination`, 
//         { 
//           pageIndex,
//           pageSize,
//           searchKeyword,
//         }
//       );

//       console.log("✅ API Response Data:", response.data);

//       return response.data.d; 
//     } catch (error) {
//       console.log("❌ API Error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Unknown error");
//     }
//   }
// );
  
// // export const fetchCombos = createAsyncThunk("combo/fetchCombos", async (params) => {
// //   const response = await api.post("/api/combo/get-pagination", params);
// //   return response.data.data;
// // });

// // Update an existing combo
// export const updateCombo = createAsyncThunk("combo/updateCombo", async ({ comboId, comboData }) => {
//   const response = await api.post(`/api/combo/update-combo/${comboId}`, comboData);
//   return response.data;
// });

// // Get combo details
// export const fetchComboDetails = createAsyncThunk("combo/fetchComboDetails", async (comboId) => {
//   const response = await api.get(`/api/combo/get-combo-details/${comboId}`);
//   return response.data;
// });

// // Fetch IoT device details by ID
// export const fetchIotDeviceDetails = createAsyncThunk("combo/fetchIotDeviceDetails", async (id) => {
//   const response = await api.get(`/api/iot-device/get-iot-device-details-by-id/${id}`);
//   return response.data;
// });

// // Fetch paginated IoT devices
// export const fetchIotDevices = createAsyncThunk("combo/fetchIotDevices", async (params) => {
//   const response = await api.post("/api/iot-device/get-pagination", params);
//   return response.data;
// });

// // Create new combo
// export const createCombo = createAsyncThunk(
//   "combo/createCombo",
//   async (comboData, { getState, rejectWithValue }) => {
//       try {
//           const state = getState();
//           const storeId = state.storeRegistration.store?.id;

//           if (!storeId) {
//               throw new Error("Store ID is missing! Make sure the store is loaded before creating a combo.");
//           }

//           const payload = { ...comboData, storeId };
//           const response = await api.post("/api/combo/create-combo", payload);
//           console.log("✅ Combo Created:", response.data);
//           return response.data;
//       } catch (error) {
//           console.error("❌ Error creating combo:", error.response?.data || error.message);
//           return rejectWithValue(error.response?.data?.message || "Failed to create combo");
//       }
//   }
// );

// const comboSlice = createSlice({
//   name: "combo",
//   initialState: {
//     combos: [],
//     totalCount: 0,
//     pageIndex: 0,
//     pageSize: 10,
//     comboDetails: null,
//     iotDevices: [],
//     iotDeviceDetails: null,
//     loading: false,
//     error: null,
//     errorMessage: "",
//   },
//   reducers: {
//     setSearchKeyword: (state, action) => {
//       state.filters.all.searchKeyword = action.payload;
//     },
//     setPageIndex: (state, action) => {
//       state.pageIndex = action.payload;
//     },
//     setPageSize: (state, action) => {
//       state.pageSize = action.payload;
//     },
//     setStartFilterDate: (state, action) => {
//       state.filters.all.startFilterDate = action.payload;
//     },
//     setEndFilterDate: (state, action) => {
//       state.filters.all.endFilterDate = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCombos.pending, (state) => {
//         state.loading = true;
//         state.errorMessage = "";
//       })
//       .addCase(fetchCombos.fulfilled, (state, action) => {
//         state.loading = false;
//         state.combos = action.payload?.data || []; 
//         state.totalCount = action.payload?.totalCount || 0;
//         state.pageIndex = action.payload?.pageIndex || 0;
//         state.pageSize = action.payload?.pageSize || 10;
//     })
      
//       .addCase(fetchCombos.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(fetchComboDetails.fulfilled, (state, action) => {
//         state.comboDetails = action.payload;
//       })
//       .addCase(fetchIotDevices.fulfilled, (state, action) => {
//         state.iotDevices = action.payload;
//       })
//       .addCase(fetchIotDeviceDetails.fulfilled, (state, action) => {
//         state.iotDeviceDetails = action.payload;
//       });
//   },
// });
// export const { setPageIndex, setPageSize, setSearchKeyword, setStartFilterDate, setEndFilterDate} = comboSlice.actions;

// export default comboSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

// Helper function để quản lý trạng thái async
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

export const fetchCombos = createAsyncThunk(
  "combo/fetchCombos",
  async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
    try {
      console.log("📡 Fetching Combos with params:", { pageIndex, pageSize, searchKeyword });

      const response = await api.post(`/api/combo/get-pagination`, { pageIndex, pageSize, searchKeyword });

      console.log("✅ API Response:", response.data);

      if (!response.data || !response.data.data || !Array.isArray(response.data.data.data)) {
        throw new Error("API response is missing expected data structure");
      }

      return {
        data: response.data.data.data,  
        pageIndex: response.data.data.pageIndex,
        pageSize: response.data.data.pageSize,
        totalCount: response.data.data.totalCount
      };
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch combo details
export const fetchComboDetails = createAsyncThunk(
  "combo/fetchComboDetails",
  async (comboId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/combo/get-combo-details/${comboId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create new combo
export const createCombo = createAsyncThunk(
  "combo/createCombo",
  async (comboData, { rejectWithValue }) => {
    try {
      const storeId = localStorage.getItem("storeId");

      if (!storeId) {
        throw new Error("❌ Store ID is missing! Make sure the store is loaded before creating a combo.");
      }

      if (!comboData || Object.keys(comboData).length === 0) {
        throw new Error("❌ Payload is missing! Please provide valid combo data.");
      }

      const payload = { ...comboData, storeId };

      console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2)); 

      const response = await api.post("/api/combo/create-combo", payload); 
      console.log("✅ Combo Created:", response.data);
      return response.data;
    } catch (error) {
      // console.error("❌ Error creating combo:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to create combo");
    }
  }
);

// Update combo
export const updateCombo = createAsyncThunk(
  "combo/updateCombo",
  async ({ comboId, comboData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/combo/update-combo/${comboId}`, comboData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch IoT device details by ID
export const fetchIotDeviceDetails = createAsyncThunk("combo/fetchIotDeviceDetails", async (id) => {
  const response = await api.get(`/api/iot-device/get-iot-device-details-by-id/${id}`);
  return response.data;
});

// Fetch paginated IoT devices
export const fetchIotDevices = createAsyncThunk(
  "combo/fetchIotDevices",
  async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
    try {
      console.log("📡 API Request:", { pageIndex, pageSize, searchKeyword });

      const response = await api.post(`/api/iot-device/get-pagination`, { pageIndex, pageSize, searchKeyword });

      console.log("✅ API Response:", response.data);

      if (!response.data || !response.data.data || !Array.isArray(response.data.data.data)) {
        throw new Error("API response is missing expected data structure");
      }

      return {
        data: response.data.data.data,  // Lấy danh sách iotDevices
        totalCount: response.data.data.totalCount,
        pageIndex: response.data.data.pageIndex,
        pageSize: response.data.data.pageSize
      };
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// export const fetchIotDevices = createAsyncThunk("combo/fetchIotDevices", async (params) => {
//   const response = await api.post("/api/iot-device/get-pagination", params);
//   return response.data;
// });

// Initial state
const initialState = {
  loading: false,
  combos: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  error: null,
  searchKeyword: "",
  selectedCombo: null,
  filters: {
    all: { searchKeyword: "", startFilterDate: "", endFilterDate: "" },
  },
};

// Create slice
const comboSlice = createSlice({
  name: "combo",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.filters.all.searchKeyword = action.payload;
    },
    setStartFilterDate: (state, action) => {
      state.filters.all.startFilterDate = action.payload;
    },
    setEndFilterDate: (state, action) => {
      state.filters.all.endFilterDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncState(builder, fetchCombos, (state, action) => {
      state.combos = action.payload?.data || [];
      state.totalCount = action.payload?.totalCount || 0;
    });
    

    handleAsyncState(builder, fetchComboDetails, (state, action) => {
      state.selectedCombo = action.payload;
    });

    handleAsyncState(builder, createCombo, (state, action) => {
      state.combos.unshift(action.payload);
      state.totalCount += 1;
    });

    handleAsyncState(builder, updateCombo, (state, action) => {
      state.combos = state.combos.map((combo) =>
        combo.id === action.payload.id ? action.payload : combo
      );
    });
    handleAsyncState(builder, fetchIotDevices, (state, action) => {
      console.log("📌 Updating Redux Store with IoT Devices:", action.payload);
    
      if (!action.payload || !Array.isArray(action.payload.data)) {
        console.warn("⚠️ API không trả về danh sách thiết bị, đặt giá trị rỗng");
        state.iotDevices = [];
      } else {
        state.iotDevices = action.payload.data;
      }
    });
    
  },
});

// Export actions & reducer
export const { setPageIndex, setPageSize, setSearchKeyword, setStartFilterDate, setEndFilterDate } = comboSlice.actions;
export default comboSlice.reducer;
