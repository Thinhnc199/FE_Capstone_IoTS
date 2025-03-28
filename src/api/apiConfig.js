// api/apiConfig.js
import axios from "axios";
import { notification } from "antd";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // console.log('Request Headers:', config.headers);
    } catch (error) {
      console.error("Request Interceptor Error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      console.error("Unauthorized error:", error.response?.data);
      localStorage.clear();
      showNotification("warning", "Token Expired", "Redirecting to login...");

      // ✅ Delay redirect to prevent instant UI refresh
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

      return Promise.reject("Token expired. Please log in again.");
    }

    return Promise.reject(
      error.response?.data?.message || "An error occurred, please try again."
    );
  }
);

// ✅ Helper function for toast notifications
const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: "topRight",
    duration: 3,
    style: {
      backgroundColor: "#ffffff",
      color: "#333333",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      border: "1px solid #f0f0f0",
      right: "20px",
      top: "50px",
      position: "fixed",
      zIndex: 10000,
      width: "380px",
    },
  });
};

// ✅ Error Handling
const handleApiError = (error) => {
  console.error("API Call Error:", error);
  showNotification("error", "Error", error);
  throw error;
};

/* ===========================
 ✅ AUTH API CALLS
=========================== */

// ✅ Login User
export const login = async (data) => {
  try {
    const response = await api.post("/api/login", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

//  Register Customer
export const registerCustomer = async (data) => {
  try {
    const response = await api.post(
      "/api/customer/register-customer-user",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Send OTP for Store Registration
export const sendOtpStore = async (email) => {
  try {
    const response = await api.post(
      "/api/store/create-store-user-request-verify-otp",
      { email }
    );
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

// ✅ Send OTP for Trainer Registration
export const sendOtpTrainer = async (email) => {
  try {
    const response = await api.post(
      "/api/trainer/create-trainer-user-request-verify-otp",
      { email }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Register Trainer User
export const registerTrainerUser = async (userInfo, otp, password) => {
  try {
    const response = await api.post("/api/trainer/register-trainer-user", {
      userInfomation: userInfo,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/* ===========================
 ✅ CUSTOMER API CALLS
=========================== */

// ✅ Send OTP Request for Customer
export const sendOtpRequest = async (email) => {
  try {
    const response = await api.post(
      "/api/customer/create-customer-user-request-verify-otp",
      { email }
    );
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
    const response = await api.post(
      "/api/store/create-or-update-store/userId",
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const submitDocuments = async (storeId, documentData) => {
  try {
    const response = await api.post(
      "/api/store/submit-pending-to-approve-store-request/requestId",
      {
        storeId,
        ...documentData,
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUserRequestDetails = async (userId) => {
  const response = await api.get(
    `/api/user-request/get-user-request-details-by-user-id/${userId}`
  );
  return response.data;
};

export const createOrUpdateStore = async (userId, storeData) => {
  const response = await api.post(
    `/api/store/create-or-update-store/${userId}`,
    storeData
  );
  return response.data;
};

// export const createOrUpdateBusinessLicense = async (licenseData) => {
//   const response = await api.post("/api/store/create-or-update-business-license", licenseData);
//   return response.data;
// };
export const createOrUpdateBusinessLicense = async (licenseData) => {
  const response = await api.post(
    "/api/store/create-or-update-business-license",
    licenseData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const submitStoreRegistration = async (requestId) => {
  const response = await api.post(
    `/api/store/submit-pending-to-approve-store-request/${requestId}`
  );
  return response.data;
};

export const uploadFiles = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/file/upload-files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload Success:", response.data);

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

export const getStoreDetailsByUserId = async (userId) => {
  try {
    // console.log("Calling API: GET /api/store/get-store-details-by-user-id/" + userId);
    const response = await api.get(
      `/api/store/get-store-details-by-user-id/${userId}`
    );
    // console.log("Store Details API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Store cannot be found:", error);
    throw error;
  }
};

export const getBusinessLicenseByStoreId = async (storeId) => {
  try {
    const response = await api.get(
      `/api/store/get-business-license/${storeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business license:", error);
    throw error;
  }
};

export const getTrainerBusinessLicense = async (trainerId) => {
  try {
    const response = await api.get(
      `/api/trainer/get-trainer-business-license/${trainerId}`
    );
    console.log("Trainer Business License API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trainer business license:", error);
    throw error;
  }
};

export default api;
