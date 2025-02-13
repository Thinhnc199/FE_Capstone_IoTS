// import axios from "axios";

// // ✅ Create API instance with default config
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Automatically add token if user is logged in
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // Retrieve token from localStorage
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const handleApiError = (error) => {
//   console.error("API Error:", error);
//   throw error.response?.data?.message || "An error occurred, please try again.";
// };


// export const getProducts = async () => {
//   try {
//     const response = await api.get("/products");
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// // 
// export const login = async (data) => {
//   try {
//     const response = await api.post("/api/login", data);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// // 
// export const registerCustomer = async (data) => {
//   try {
//     const response = await api.post("/api/user/register-verify-otp-customer", data);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// // 
// export const sendOtpRequest = async (email) => {
//   try {
//     const response = await api.post("/api/customer/create-customer-user-request-verify-otp", { email });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// //  Send OTP for Store Registration
// export const sendOtpStore = async (email) => {
//   try {
//     const response = await api.post("/api/store/create-store-user-request-verify-otp", { email });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// //  Register Store User
// export const registerStoreUser = async (userInfo, otp, password) => {
//   try {
//     const response = await api.post("/api/store/register-store-user", {
//       userInfomation: userInfo,
//       otp: otp,
//       password: password,
//     });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// export default api;

import axios from "axios";
import { notification } from "antd";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Request Interceptor Error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      showNotification("warning", "Session Expired", "Redirecting to login...");

      // ✅ Delay redirect to prevent instant UI refresh
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 2000);

      return Promise.reject("Session expired. Please log in again.");
    }

    return Promise.reject(error.response?.data?.message || "An error occurred, please try again.");
  }
);

// ✅ Helper function for toast notifications
const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: "topRight",
    duration: 3,
  });
};

// ✅ Error Handling
const handleApiError = (error) => {
  console.error("API Call Error:", error);
  showNotification("error", "API Error", error);
  throw error;
};

// ✅ Login User
export const login = async (data) => {
  try {
    const response = await api.post("/api/login", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Register Customer
export const registerCustomer = async (data) => {
  try {
    const response = await api.post("/api/customer/register-customer-user", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
// export const registerCustomer = async (data) => {
//   try {
//     const response = await api.post("/api/user/register-verify-otp-customer", data);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };


// ✅ Send OTP for Store Registration
export const sendOtpStore = async (email) => {
  try {
    const response = await api.post("/api/store/create-store-user-request-verify-otp", { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Register Store User
export const registerStoreUser = async (userInfo, otp, password) => {
  try {
    const response = await api.post("/api/store/register-store-user", {
      userInfomation: userInfo,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const sendOtpRequest = async (email) => {
  try {
    const response = await api.post("/api/customer/create-customer-user-request-verify-otp", { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Get Products (Example API)
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


// Store API Calls
export const submitStoreDetails = async (data) => {
  try {
    const response = await api.post("/api/store/create-or-update-store/userId", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const submitDocuments = async (storeId, documentData) => {
  try {
    const response = await api.post("/api/store/submit-pending-to-approve-store-request/requestId", {
      storeId,
      ...documentData,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const getUserRequestDetails = async (userId) => {
  const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
  return response.data;
};

export const createOrUpdateStore = async (userId, storeData) => {
  const response = await api.post(`/api/store/create-or-update-store/${userId}`, storeData);
  return response.data;
};


// export const createOrUpdateBusinessLicense = async (licenseData) => {
//   const response = await api.post("/api/store/create-or-update-business-license", licenseData);
//   return response.data;
// };
export const createOrUpdateBusinessLicense = async (licenseData) => {
  const response = await api.post("/api/store/create-or-update-business-license", licenseData, {
    headers: {
      "Content-Type": "application/json", 
    },
  });
  return response.data;
};



export const submitStoreRegistration = async (requestId) => {
  const response = await api.post(`/api/store/submit-pending-to-approve-store-request/${requestId}`);
  return response.data;
};


export const uploadFiles = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/file/upload-files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload Success:", response.data); // Debug dữ liệu trả về

    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data.id; // Trả về URL ảnh
    } else {
      throw new Error("Invalid response format: No image URL found");
    }
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error("Upload image failed");
  }
};

// // Function to get store details by user ID
// export const getStoreDetailsByUserId = async (userId) => {
//   try {
//     const response = await api.get(`/api/store/get-store-details-by-user-id/${userId}`);
//     return response.data; 
//   } catch (error) {
//     console.error("Error fetching store details:", error);
//     throw error; 
//   }
// };
export const getStoreDetailsByUserId = async (userId) => {
  try {
    // console.log("Calling API: GET /api/store/get-store-details-by-user-id/" + userId);
    const response = await api.get(`/api/store/get-store-details-by-user-id/${userId}`);
    // console.log("Store Details API Response:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Store cannot be found", error);
    throw error; 
  }
};

export const getBusinessLicenseByStoreId = async (storeId) => {
  try {
    // console.log("Calling API: GET /api/store/get-business-license/" + storeId);
    const response = await api.get(`/api/store/get-business-license/${storeId}`);
    // console.log("Business License API Response:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching business license:", error);
    throw error; 
  }
};

// // Function to get business license by store ID
// export const getBusinessLicenseByStoreId = async (storeId) => {
//   try {
//     const response = await api.get(`/api/store/get-business-license/${storeId}`);
//     return response.data; 
//   } catch (error) {
//     console.error("Error fetching business license:", error);
//     throw error; 
//   }
// };

export default api;
