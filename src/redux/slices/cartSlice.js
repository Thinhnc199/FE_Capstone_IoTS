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
export const fetchCarts = createAsyncThunk(
  "carts/fetchCarts",
  async (
    { pageIndex, pageSize, searchKeyword, startFilterDate, endFilterDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/api/cart/get-pagination`, {
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchAddCarts = createAsyncThunk(
  "carts/fetchAddCarts",
  async ({ productId, productType, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/cart/add-to-cart`, {
        productId,
        productType,
        quantity,
      });
      return response.data;
    } catch (error) {
      // if (error.response) {
      //   return rejectWithValue(
      //     error.response.data.errors ||
      //       error.response.data.message ||
      //       "Something went wrong"
      //   );
      // }
      return rejectWithValue(error || "Unknown error");
    }
  }
);

export const updateAddCarts = createAsyncThunk(
  "carts/updateAddCarts",
  async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/cart/update-cart-quantity`, {
        cartId,
        quantity,
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
export const deleteCarts = createAsyncThunk(
  "carts/deleteAddCarts",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/cart/remove-cart-item/${cartId}`);
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
export const selectCarts = createAsyncThunk(
  "carts/selectCarts",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/cart/select-cart-item/${cartId}`);
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
export const unselectCarts = createAsyncThunk(
  "carts/unselectCarts",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/cart/unselect-cart-item/${cartId}`);
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
export const fetchGetTotalPrice = createAsyncThunk(
  "carts/fetchGetTotalPrice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/cart/get-cart-total-information`);
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

// Thêm createAsyncThunk để lấy danh sách lab của Combo
export const fetchComboIncludedLabs = createAsyncThunk(
  "carts/fetchComboIncludedLabs",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/cart/get-all-combo-included-labs/${cartId}`);
      return response.data.data;
    } catch (error) {
      // if (error.response) {
      //   return rejectWithValue(
      //     error.response.data.message || "Failed to fetch included labs"
      //   );
      // }
      return rejectWithValue(error || "Unknown error");
    }
  }
);

const initialState = {
  cart: [],
  loading: false,
  pageIndex: 0,
  pageSize: 100,
  searchKeyword: "",
  startFilterDate: null,
  endFilterDate: null,
  error: null,
  totalCount: 0,
  messages: null,
  totalSelectedItemsPrice: 0,
  isDropdownOpen: false,
  includedLabs: [],
};
const cartSlice = createSlice({
  name: "carts",
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
    resetCart: (state) => {
      state.cart = [];
      state.totalCount = 0;
      state.totalSelectedItemsPrice = 0;
    },
    setIsOpenDropdown: (state, action) => {
      state.isOpenDropdown = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAsyncState(builder, fetchCarts, (state, action) => {
      state.cart = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    handleAsyncState(builder, fetchAddCarts, (state, action) => {
      state.cart = action.payload?.data || [];
      state.messages = action.payload?.message || null;
      state.error = action.payload?.errors || action.payload || "Unknown error";
    });
    handleAsyncState(builder, fetchGetTotalPrice, (state, action) => {
      state.totalSelectedItemsPrice =
        action.payload.data.totalSelectedItemsPrice;
    });
    // Xử lý fetchComboIncludedLabs
    handleAsyncState(builder, fetchComboIncludedLabs, (state, action) => {
      state.includedLabs = action.payload; // Lưu danh sách lab vào state
    });
    // handleAsyncState(builder, updateAddCarts, (state, action) => {
    //   const { cartId, quantity } = action.meta.arg; // Lấy dữ liệu từ request gốc
    //   const cartItem = state.cart.find((item) => item.id === cartId);
    //   if (cartItem) {
    //     cartItem.quantity = quantity; // Cập nhật số lượng ngay trên Redux Store
    //   }
    // });
    // handleAsyncState(builder, deleteCarts, (state, action) => {
    //   const deletedCartId = action.payload;
    //   const index = state.items.findIndex(
    //     (item) => item.id === deletedCartId.id
    //   );
    //   if (index !== -1) {
    //     state.items[index] = deletedCartId;
    //   }
    // });
  },
});
export const {
  setPageIndex,
  setPageSize,
  setsearchKeyword,
  setEndFilterDate,
  setStartFilterDate,
  resetCart,
  setIsOpenDropdown,
} = cartSlice.actions;
export default cartSlice.reducer;
