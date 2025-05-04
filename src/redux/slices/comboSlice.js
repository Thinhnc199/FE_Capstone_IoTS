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
      state.error = action.payload || action.error.message;
    });
};

// Fetch combos
export const fetchCombos = createAsyncThunk(
  "combo/fetchCombos",
  async (
    { pageIndex, pageSize, searchKeyword },
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log("📡 Fetching Combos with params:", {
        pageIndex,
        pageSize,
        searchKeyword,
      });
      const response = await api.post(`/api/combo/get-pagination`, {
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword || "",
      });
      console.log("✅ API Response:", response.data);

      if (
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data.data)
      ) {
        throw new Error("API response is missing expected data structure");
      }

      return {
        data: response.data.data.data,
        pageIndex: response.data.data.pageIndex,
        pageSize: response.data.data.pageSize,
        totalCount: response.data.data.totalCount,
      };
    } catch (error) {
      console.error("❌ Error fetching combos:", error);
      dispatch(
        setComboError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch combos."
        )
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch combos."
      );
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
// export const createCombo = createAsyncThunk(
//   "combo/createCombo",
//   async (comboData, { rejectWithValue, dispatch }) => {
//     try {
//       const storeId = localStorage.getItem("storeId");
//       if (!storeId) {
//         throw new Error(
//           "❌ Store ID is missing! Make sure the store is loaded before creating a combo."
//         );
//       }
//       if (!comboData || Object.keys(comboData).length === 0) {
//         throw new Error(
//           "❌ Payload is missing! Please provide valid combo data."
//         );
//       }

//       const payload = { ...comboData, storeId };
//       console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2));
//       const response = await api.post("/api/combo/create-combo", payload);
//       console.log("✅ Combo Created:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error creating combo:", error);
//       dispatch(
//         setComboError(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to create combo."
//         )
//       );
//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to create combo."
//       );
//     }
//   }
// );
export const createCombo = createAsyncThunk(
  "combo/createCombo",
  async (comboData, { rejectWithValue }) => {
    try {
      const storeId = localStorage.getItem("storeId");
      if (!storeId) {
        throw new Error(
          "❌ Store ID is missing! Make sure the store is loaded before creating a combo."
        );
      }
      if (!comboData || Object.keys(comboData).length === 0) {
        throw new Error(
          "❌ Payload is missing! Please provide valid combo data."
        );
      }

      const payload = { ...comboData, storeId };
      const response = await api.post("/api/combo/create-combo", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update combo
export const updateCombo = createAsyncThunk(
  "combo/updateCombo",
  async ({ comboId, comboData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/combo/update-combo/${comboId}`,
        comboData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Active combo
export const activeCombos = createAsyncThunk(
  "combo/activeCombos",
  async ({ comboId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/api/combo/combo-status/activate`, {
        comboId,
      });
      console.log("✅ Combo Activated:", response.data);
      return { id: comboId, isActive: 1 }; // Trả về dữ liệu để cập nhật state
    } catch (error) {
      console.error("❌ Error activating combo:", error);
      dispatch(
        setComboError(
          error.response?.data?.message ||
            error.message ||
            "Failed to activate combo."
        )
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to activate combo."
      );
    }
  }
);

// Deactive combo
export const deactiveCombos = createAsyncThunk(
  "combo/deactiveCombos",
  async ({ comboId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/api/combo/combo-status/deactivate`, {
        comboId,
      });
      console.log("✅ Combo Deactivated:", response.data);
      return { id: comboId, isActive: 0 }; // Trả về dữ liệu để cập nhật state
    } catch (error) {
      console.error("❌ Error deactivating combo:", error);
      dispatch(
        setComboError(
          error.response?.data?.message ||
            error.message ||
            "Failed to deactivate combo."
        )
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate combo."
      );
    }
  }
);

// Fetch IoT device details by ID
export const fetchIotDeviceDetails = createAsyncThunk(
  "combo/fetchIotDeviceDetails",
  async (id) => {
    const response = await api.get(
      `/api/iot-device/get-iot-device-details-by-id/${id}`
    );
    return response.data;
  }
);

// Fetch paginated IoT devices
export const fetchIotDevices = createAsyncThunk(
  "combo/fetchIotDevices",
  async ({ pageIndex, pageSize, searchKeyword }, { rejectWithValue }) => {
    try {
      console.log("📡 API Request:", { pageIndex, pageSize, searchKeyword });
      const response = await api.post(`/api/iot-device/get-pagination`, {
        pageIndex,
        pageSize,
        searchKeyword,
      });
      console.log("✅ API Response:", response.data);

      if (
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data.data)
      ) {
        throw new Error("API response is missing expected data structure");
      }

      return {
        data: response.data.data.data,
        totalCount: response.data.data.totalCount,
        pageIndex: response.data.data.pageIndex,
        pageSize: response.data.data.pageSize,
      };
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
      state.searchKeyword = action.payload;
    },
    setStartFilterDate: (state, action) => {
      state.filters.all.startFilterDate = action.payload;
    },
    setEndFilterDate: (state, action) => {
      state.filters.all.endFilterDate = action.payload;
    },
    setComboError: (state, action) => {
      state.error = action.payload;
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

    handleAsyncState(builder, activeCombos, (state, action) => {
      state.combos = state.combos.map((combo) =>
        combo.id === action.payload.id ? { ...combo, isActive: 1 } : combo
      );
    });

    handleAsyncState(builder, deactiveCombos, (state, action) => {
      state.combos = state.combos.map((combo) =>
        combo.id === action.payload.id ? { ...combo, isActive: 0 } : combo
      );
    });

    handleAsyncState(builder, fetchIotDevices, (state, action) => {
      console.log("📌 Updating Redux Store with IoT Devices:", action.payload);
      if (!action.payload || !Array.isArray(action.payload.data)) {
        console.warn(
          "⚠️ API không trả về danh sách thiết bị, đặt giá trị rỗng"
        );
        state.iotDevices = [];
      } else {
        state.iotDevices = action.payload.data;
      }
    });
  },
});

// Export actions & reducer
export const {
  setPageIndex,
  setPageSize,
  setSearchKeyword,
  setStartFilterDate,
  setEndFilterDate,
  setComboError,
} = comboSlice.actions;

export default comboSlice.reducer;
