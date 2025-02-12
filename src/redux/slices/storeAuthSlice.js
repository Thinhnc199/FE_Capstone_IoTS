// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/apiConfig";
// import { notification, Modal } from "antd";

// // ✅ Helper function for toast notifications
// const showNotification = (type, message, description) => {
//   notification[type]({
//     message,
//     description,
//     placement: "topRight",
//     duration: 3,
//   });
// };

// export const fetchUserRequest = async (userId) => {
//   try {
//     const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
//     const { userRequestInfo } = response.data.data;


//     if (userRequestInfo.remark) {
//       Modal.info({
//         title: "Important Notice",
//         content: userRequestInfo.remark,
//         okText: "Close",
//       });
//     }

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching user request details:", error);
//     return null;
//   }
// };


// export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
//   try {
//     const response = await api.post("/api/login", credentials);
//     const { token, id, roleId } = response.data.data;

  
//     localStorage.setItem("token", token);
//     localStorage.setItem("userId", id);
//     localStorage.setItem("role", roleId);


//     const userDetails = await fetchUserRequest(id);

//     return { ...response.data.data, userDetails };
//   } catch (error) {
//     showNotification("error", "Login Failed", error.response?.data?.message || "Invalid credentials");
//     return rejectWithValue(error.response?.data);
//   }
// });

// const storeAuthSlice = createSlice({
//   name: "auth",
//   initialState: {
//     token: localStorage.getItem("token") || null,
//     userId: localStorage.getItem("userId") || null,
//     role: localStorage.getItem("role") || null,
//     userDetails: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//       localStorage.removeItem("role");
//       state.token = null;
//       state.userId = null;
//       state.role = null;
//       state.userDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.userId = action.payload.id;
//         state.role = action.payload.roleId;
//         state.userDetails = action.payload.userDetails;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Login failed!";
//       });
//   },
// });

// export const { logout } = storeAuthSlice.actions;
// export default storeAuthSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiConfig";
import { notification, Modal } from "antd";


const showNotification = (type, message, description) => {
  notification[type]( {
    message,
    description,
    placement: "topRight",
    duration: 3,
  });
};


export const fetchUserRequest = async (userId) => {
  try {
    const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
    const { userRequestInfo } = response.data.data;

    if (userRequestInfo.remark) {
      Modal.info({
        title: "Important Notice",
        content: userRequestInfo.remark,
        okText: "Close",
      });
    }

    return response.data.data; 
  } catch (error) {
    console.error("Error fetching user request details:", error);
    return null;
  }
};


export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/login", credentials);
    const { token, id, roleId, email, imageUrl, username } = response.data.data;

   
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("role", roleId);
    localStorage.setItem("imageUrl", imageUrl);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    const userDetails = await fetchUserRequest(id);

    return { ...response.data.data, userDetails };
  } catch (error) {
    showNotification("error", "Login Failed", error.response?.data?.message || "Invalid credentials");
    return rejectWithValue(error.response?.data);
  }
});

const storeAuthSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    role: localStorage.getItem("role") || null,
    email: localStorage.getItem("email") || null,
    fullname: localStorage.getItem("username") || null,
    imageUrl: localStorage.getItem("imageUrl") || null,
    // userDetails: localStorage.getItem("userDetails") || null,
    userDetails: {
      id: localStorage.getItem("userId") || null,
      role: localStorage.getItem("role") || null,
      email: localStorage.getItem("email") || null,
      fullname: localStorage.getItem("username") || null,
      imageUrl: localStorage.getItem("imageUrl") || null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("imageUrl");
      localStorage.removeItem("userDetails");
      state.token = null;
      state.userId = null;
      state.email = null;
      state.fullname = null;
      state.imageUrl = null;
      state.role = null;
     state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.id;
        state.role = action.payload.roleId;
        state.email = action.payload.email;
        state.fullname = action.payload.fullname;
        state.imageUrl = action.payload.imageUrl;
        state.userDetails = action.payload.userDetails;
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed!";
      });
  },
});

export const { logout } = storeAuthSlice.actions;
export default storeAuthSlice.reducer;
