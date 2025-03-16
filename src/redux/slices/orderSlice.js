import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";

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

export const createOrder = createAsyncThunk(
  "createOrders/createOrder",
  async (
    { address, contactNumber, notes, provinceId, districtId, wardId },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/api/Order/create-order`, {
        address,
        contactNumber,
        notes,
        provinceId,
        districtId,
        wardId,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.errors ||
            error.response.data.message ||
            "Something went wrong"
        );
      }
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);
export const checkSuccessOrder = createAsyncThunk(
  "createOrders/checkSuccessOrder",
  async ({ urlResponse }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/Order/check-order-success`, {
        urlResponse,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.errors ||
            error.response.data.message ||
            "Something went wrong"
        );
      }
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);
const initialState = {
  dataCheckOrder: null,
  order: [],
  loading: false,
  error: null,
};
const orderSlice = createSlice({
  name: "createOrders",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },

    setsearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setStartFilterDate: (state, action) => {
      state.startFilterDate = action.payload;
    },
    setEndFilterDate: (state, action) => {
      state.endFilterDate = action.payload;
    },

    setIsOpenDropdown: (state, action) => {
      state.isOpenDropdown = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncState(builder, createOrder, (state, action) => {
      state.order = action.payload;
    });
    handleAsyncState(builder, checkSuccessOrder, (state, action) => {
      state.dataCheckOrder = action.payload;
    });
  },
});
export const {
  setPageIndex,
  setPageSize,
  setsearchKeyword,
  setEndFilterDate,
  setStartFilterDate,

  setIsOpenDropdown,
} = orderSlice.actions;
export default orderSlice.reducer;
