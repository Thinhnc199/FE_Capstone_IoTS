// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from './../../api/apiConfig';

// // Async Thunks cho các API calls
// export const getWarrantyById = createAsyncThunk(
//   'warranty/getById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/api/warranty-request/get/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Error fetching warranty');
//     }
//   }
// );

// export const createWarrantyRequest = createAsyncThunk(
//   'warranty/create',
//   async (warrantyData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/api/warranty-request/create', warrantyData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Error creating warranty');
//     }
//   }
// );

// export const getWarrantyPagination = createAsyncThunk(
//   'warranty/getPagination',
//   async ({ pageIndex, pageSize, searchKeyword, statusFilter }, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/api/warranty-request/get-pagination', {
//         pageIndex,
//         pageSize,
//         searchKeyword,
//         statusFilter
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error|| 'Error fetching warranty pagination');
//     }
//   }
// );

// export const rejectWarrantyRequest = createAsyncThunk(
//   'warranty/reject',
//   async ({ id, remark }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/warranty-request/store/reject/${id}`, { remark });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error|| 'Error rejecting warranty');
//     }
//   }
// );

// export const approveWarrantyRequest = createAsyncThunk(
//   'warranty/approve',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/warranty-request/store/approve/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error|| 'Error approving warranty');
//     }
//   }
// );

// export const confirmWarrantySuccess = createAsyncThunk(
//   'warranty/confirmSuccess',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/api/warranty-request/confirm-success/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error|| 'Error confirming warranty success');
//     }
//   }
// );

// // Warranty Slice
// const warrantySlice = createSlice({
//   name: 'warranty',
//   initialState: {
//     warranty: null,
//     warranties: [],
//     pagination: {
//       pageIndex: 0,
//       pageSize: 10,
//       totalCount: 0,
//     },
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearWarranty: (state) => {
//       state.warranty = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Get Warranty By ID
//     builder
//       .addCase(getWarrantyById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getWarrantyById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.warranty = action.payload.data;
//       })
//       .addCase(getWarrantyById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Create Warranty Request
//       .addCase(createWarrantyRequest.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createWarrantyRequest.fulfilled, (state, action) => {
//         state.loading = false;
//         state.warranties.push(action.payload.data);
//       })
//       .addCase(createWarrantyRequest.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get Warranty Pagination
//       .addCase(getWarrantyPagination.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getWarrantyPagination.fulfilled, (state, action) => {
//         state.loading = false;
//         state.warranties = action.payload.data.data;
//         state.pagination = {
//           pageIndex: action.payload.data.pageIndex,
//           pageSize: action.payload.data.pageSize,
//           totalCount: action.payload.data.totalCount,
//         };
//       })
//       .addCase(getWarrantyPagination.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Reject Warranty Request
//       .addCase(rejectWarrantyRequest.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(rejectWarrantyRequest.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.warranties.findIndex(w => w.id === action.meta.arg.id);
//         if (index !== -1) {
//           state.warranties[index] = { ...state.warranties[index], ...action.payload.data };
//         }
//       })
//       .addCase(rejectWarrantyRequest.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Approve Warranty Request
//       .addCase(approveWarrantyRequest.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(approveWarrantyRequest.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.warranties.findIndex(w => w.id === action.meta.arg);
//         if (index !== -1) {
//           state.warranties[index] = { ...state.warranties[index], ...action.payload.data };
//         }
//       })
//       .addCase(approveWarrantyRequest.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Confirm Warranty Success
//       .addCase(confirmWarrantySuccess.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(confirmWarrantySuccess.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.warranties.findIndex(w => w.id === action.meta.arg);
//         if (index !== -1) {
//           state.warranties[index] = { ...state.warranties[index], ...action.payload.data };
//         }
//       })
//       .addCase(confirmWarrantySuccess.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Export actions
// export const { clearError, clearWarranty } = warrantySlice.actions;

// // Export reducer
// export default warrantySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../api/apiConfig";
import { message } from "antd";
// Async Thunks cho các API calls
export const getWarrantyById = createAsyncThunk(
  "warranty/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/warranty-request/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching warranty");
    }
  }
);

export const createWarrantyRequest = createAsyncThunk(
  "warranty/create",
  async (warrantyData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/warranty-request/create",
        warrantyData
      );
      return response.data;
    } catch (error) {
      message.error(error);
      return rejectWithValue(error.response?.data || "Error creating warranty");
    }
  }
);

export const getWarrantyPagination = createAsyncThunk(
  "warranty/getPagination",
  async (
    { pageIndex, pageSize, searchKeyword, statusFilter },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/warranty-request/get-pagination", {
        pageIndex,
        pageSize,
        searchKeyword,
        statusFilter,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Error fetching warranty pagination");
    }
  }
);

export const rejectWarrantyRequest = createAsyncThunk(
  "warranty/reject",
  async ({ id, remark }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/warranty-request/store/reject/${id}`,
        { remark }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Error rejecting warranty");
    }
  }
);

export const approveWarrantyRequest = createAsyncThunk(
  "warranty/approve",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/warranty-request/store/approve/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Error approving warranty");
    }
  }
);

export const confirmWarrantySuccess = createAsyncThunk(
  "warranty/confirmSuccess",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/warranty-request/confirm-success/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Error confirming warranty success");
    }
  }
);

// Thêm action uploadWarrantyVideo
export const uploadWarrantyVideo = createAsyncThunk(
  "warranty/uploadWarrantyVideo",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // API mong đợi key "file"

      const response = await api.post("/api/file/upload-videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percent}%`);
        },
      });
      if (response.status === 200 && response.data.isSuccess) {
        return response.data.data; // { id, fileName, fileSize }
      }

      return rejectWithValue("Failed to upload video");
    } catch (error) {
      if (error.response?.status === 413) {
        message.warning("Request Entity Too Large");
        return rejectWithValue("Request Entity Too Large");
      }
      const errorMessage =
        error.response?.data?.message || "Request Entity Too Large";
      message.warning(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Warranty Slice
const warrantySlice = createSlice({
  name: "warranty",
  initialState: {
    warranty: null,
    warranties: [],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      totalCount: 0,
    },
    loading: false,
    error: null,
    videoUrl: null,
    videoFileName: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWarranty: (state) => {
      state.warranty = null;
    },
    resetVideoState: (state) => {
      // Thêm reducer để reset trạng thái video
      state.videoUrl = null;
      state.videoFileName = null;
    },
  },
  extraReducers: (builder) => {
    // Get Warranty By ID
    builder
      .addCase(getWarrantyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarrantyById.fulfilled, (state, action) => {
        state.loading = false;
        state.warranty = action.payload.data;
      })
      .addCase(getWarrantyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Warranty Request
      .addCase(createWarrantyRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWarrantyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties.push(action.payload.data);
        state.videoUrl = null; // Reset videoUrl sau khi tạo yêu cầu thành công
        state.videoFileName = null; // Reset videoFileName
      })
      .addCase(createWarrantyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Warranty Pagination
      .addCase(getWarrantyPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarrantyPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties = action.payload.data.data;
        state.pagination = {
          pageIndex: action.payload.data.pageIndex,
          pageSize: action.payload.data.pageSize,
          totalCount: action.payload.data.totalCount,
        };
      })
      .addCase(getWarrantyPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject Warranty Request
      .addCase(rejectWarrantyRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectWarrantyRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warranties.findIndex(
          (w) => w.id === action.meta.arg.id
        );
        if (index !== -1) {
          state.warranties[index] = {
            ...state.warranties[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(rejectWarrantyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Warranty Request
      .addCase(approveWarrantyRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveWarrantyRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warranties.findIndex(
          (w) => w.id === action.meta.arg
        );
        if (index !== -1) {
          state.warranties[index] = {
            ...state.warranties[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(approveWarrantyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm Warranty Success
      .addCase(confirmWarrantySuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmWarrantySuccess.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warranties.findIndex(
          (w) => w.id === action.meta.arg
        );
        if (index !== -1) {
          state.warranties[index] = {
            ...state.warranties[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(confirmWarrantySuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Warranty Video
      .addCase(uploadWarrantyVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadWarrantyVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUrl = action.payload.id; // Lưu URL video
        state.videoFileName = action.payload.fileName; // Lưu tên file
      })
      .addCase(uploadWarrantyVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearWarranty, resetVideoState } =
  warrantySlice.actions;

// Export reducer
export default warrantySlice.reducer;
