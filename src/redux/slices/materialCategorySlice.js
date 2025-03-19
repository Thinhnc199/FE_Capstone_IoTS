// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/apiConfig";

// // Helper function to handle async states
// const handleAsyncState = (builder, asyncThunk, onSuccess) => {
//   builder
//     .addCase(asyncThunk.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//     .addCase(asyncThunk.fulfilled, (state, action) => {
//       state.loading = false;
//       onSuccess?.(state, action);
//     })
//     .addCase(asyncThunk.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });
// };

// // // Fetch all material categories
// export const fetchAllMaterialCategories = createAsyncThunk(
//   "materialCategory/fetchAll",
//   async (searchKeyword = "", { rejectWithValue }) => {
//     try {
//       const response = await api.get(
//         `/api/material-category/get-all-material-categories?searchKeyword=${searchKeyword}`
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Thunks
// export const fetchPaginatedMaterialCategories = createAsyncThunk(
//   "materialCategory/fetchPaginated",
//   async ({ pageIndex, pageSize, searchKeyword, startFilterDate, endFilterDate }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/material-category/get-pagination`, {
//         pageIndex,
//         pageSize,
//         searchKeyword,
//         startFilterDate,
//         endFilterDate,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const createMaterialCategory = createAsyncThunk(
//   "materialCategory/create",
//   async ({ label, description }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/material-category/create-material-category`, {
//         label,
//         description,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const initialState = {
//   loading: false,
//   categories: [],
//   paginatedData: [],
//   totalCount: 0,
//   pageIndex: 1,
//   pageSize: 10,
//   error: null,
//   filters: {
//     all: { searchKeyword: "", startFilterDate: "", endFilterDate: "" },
//   },
// };

// const materialCategorySlice = createSlice({
//   name: "materialCategory",
//   initialState,
//   reducers: {
//     setPageIndex: (state, action) => {
//       state.pageIndex = action.payload;
//     },
//     setPageSize: (state, action) => {
//       state.pageSize = action.payload;
//     },
//     setSearchKeyword: (state, action) => {
//       state.filters.all.searchKeyword = action.payload;
//     },
//     setStartFilterDate: (state, action) => {
//       state.filters.all.startFilterDate = action.payload;
//     },
//     setEndFilterDate: (state, action) => {
//       state.filters.all.endFilterDate = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     handleAsyncState(builder, fetchPaginatedMaterialCategories, (state, action) => {
//       state.paginatedData = action.payload.data;
//       state.totalCount = action.payload.totalCount;
//     });
//     handleAsyncState(builder, createMaterialCategory, (state, action) => {
//       state.categories.unshift(action.payload);
//       state.totalCount += 1;
//     });
//     handleAsyncState(builder, fetchAllMaterialCategories, (state, action) => {
//         state.paginatedData = action.payload.data; // Gán toàn bộ danh mục vào state
//         state.totalCount = action.payload.data.length;
//       });
//   },
// });

// export const { setPageIndex, setPageSize, setSearchKeyword, setStartFilterDate, setEndFilterDate } = materialCategorySlice.actions;
// export default materialCategorySlice.reducer;

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

// // // Fetch all material categories
export const fetchAllMaterialCategories = createAsyncThunk(
  "materialCategory/fetchAll",
  async (searchKeyword = "", { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/material-category/get-all-material-categories?searchKeyword=${searchKeyword}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunks
export const fetchPaginatedMaterialCategories = createAsyncThunk(
  "materialCategory/fetchPaginated",
  async (
    {
      pageIndex,
      pageSize,
      searchKeyword,
      statusFilter,
      startFilterDate,
      endFilterDate,
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("📡 API Call Params:", {
        pageIndex,
        pageSize,
        searchKeyword,
        statusFilter,
      });

      const response = await api.post(
        `/api/material-category/get-pagination`,
        {
          pageIndex,
          pageSize,
          searchKeyword: searchKeyword || "",
          ...(startFilterDate && { startFilterDate }),
          ...(endFilterDate && { endFilterDate }),
        },
        {
          params: { statusFilter }, // statusFilter được gửi trong query parameters
        }
      );

      // console.log("✅ API Response Data:", response.data);
      return response.data;
    } catch (error) {
      // console.log("❌ API Error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// export const fetchPaginatedMaterialCategories = createAsyncThunk(
//   "materialCategory/fetchPaginated",
//   async ({ pageIndex, pageSize, searchKeyword, startFilterDate, endFilterDate, statusFilter }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/material-category/get-pagination`, {
//         pageIndex,
//         pageSize,
//         searchKeyword: searchKeyword,
//         statusFilter: statusFilter,
//         ...(startFilterDate && { startFilterDate }),
//         ...(endFilterDate && { endFilterDate }),
//       });
//       console.log("API Data:", response.data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

export const createMaterialCategory = createAsyncThunk(
  "materialCategory/create",
  async ({ label, description }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/material-category/create-material-category`,
        {
          label,
          description,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMaterialCategory = createAsyncThunk(
  "materialCategory/update",
  async ({ id, label, description }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/material-category/Update-material-category/${id}`,
        {
          label,
          description,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMaterialCategoryById = createAsyncThunk(
  "materialCategory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/material-category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  categories: [],
  paginatedData: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  error: null,
  searchKeyword: "",
  selectedCategory: null,
  statusFilter: 1,
  filters: {
    all: { searchKeyword: "", startFilterDate: "", endFilterDate: "" },
  },
};

const materialCategorySlice = createSlice({
  name: "materialCategory",
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
    setStatusFilter: (state, action) => {
      // console.log("🔄 Changing statusFilter:", action.payload);
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // handleAsyncState(builder, fetchPaginatedMaterialCategories, (state, action) => {
    //   state.paginatedData = action.payload.data || [];
    //   state.totalCount = action.payload.data?.length || 0;
    // });
    handleAsyncState(
      builder,
      fetchPaginatedMaterialCategories,
      (state, action) => {
        // console.log("📌 Redux API Response:", action.payload);

        if (action.payload && action.payload.data) {
          if (state.statusFilter === 1) {
            state.activeData = action.payload.data;
            state.totalCountActive =
              action.payload.totalCount || action.payload.data.length; // ✅ Đảm bảo totalCount chính xác
          } else if (state.statusFilter === 2) {
            state.pendingData = action.payload.data;
            state.totalCountPending =
              action.payload.totalCount || action.payload.data.length; // ✅ Đảm bảo totalCount chính xác
          }
        } else {
          state.activeData = [];
          state.pendingData = [];
          state.totalCountActive = 0;
          state.totalCountPending = 0;
        }
      }
    );

    handleAsyncState(builder, createMaterialCategory, (state, action) => {
      state.categories.unshift(action.payload);
      state.totalCount += 1;
    });
    handleAsyncState(builder, updateMaterialCategory, (state, action) => {
      state.paginatedData = state.paginatedData.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
    });
    handleAsyncState(builder, fetchMaterialCategoryById, (state, action) => {
      state.selectedCategory = action.payload.data;
    });
    handleAsyncState(builder, fetchAllMaterialCategories, (state, action) => {
      state.paginatedData = action.payload.data; // Gán toàn bộ danh mục vào state
      state.totalCount = action.payload.data.length;
      // console.log("📌 Redux API Responsse:", typeof state.paginatedData);
    });
    // handleAsyncState(builder, fetchPaginatedMaterialCategories, (state, action) => {
    //   console.log("API Response:", action.payload);
    //   if (action.payload && action.payload.data) {
    //     state.paginatedData = action.payload.data || [];
    //     state.totalCount = action.payload.data.totalCount || 0;
    //   }
    // });
  },
});

export const {
  setPageIndex,
  setPageSize,
  setSearchKeyword,
  setStartFilterDate,
  setEndFilterDate,
  setStatusFilter,
} = materialCategorySlice.actions;
export default materialCategorySlice.reducer;
