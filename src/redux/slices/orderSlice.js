import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";
const returnUrl = "http://localhost:5173/checkout-process-order";
// const returnUrl2 = "https://fe-capstone-io-ts.vercel.app/checkout-process-order";
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
    {
      address,
      contactNumber,
      notes,
      provinceId,
      districtId,
      wardId,
      addressId,
      deliver_option,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/api/Order/create-order?returnUrl=${encodeURIComponent(returnUrl)}`,
        {
          address,
          contactNumber,
          notes,
          provinceId,
          districtId,
          wardId,
          addressId,
          deliver_option,
        }
      );
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
export const getfeeShip = createAsyncThunk(
  "createOrders/getfeeShip",
  async (
    { provinceId, wardId, districtId, addressId, address, deliver_option },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/api/Shipping/get-fee`, {
        provinceId,
        wardId,
        districtId,
        addressId,
        address,
        deliver_option,
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
      return rejectWithValue(error);
    }
  }
);
const initialState = {
  dataCheckOrder: null,
  order: [],
  loading: false,
  error: null,
  fee: 0,
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
    handleAsyncState(builder, getfeeShip, (state, action) => {
      state.fee = action.payload;
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
