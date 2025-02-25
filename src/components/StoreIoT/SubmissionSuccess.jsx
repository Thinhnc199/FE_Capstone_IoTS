// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Button, Tag } from "antd";
// import {
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";

// const SubmissionSuccess = () => {
//   const navigate = useNavigate();
//   const { status } = useSelector((state) => state.storeRegistration);

//   const statusColors = {
//     "Pending to Approved": {
//       color: "gold",
//       background: "#fffbe6",
//       border: "#ffe58f",
//     },
//     Approved: { color: "green", background: "#f6ffed", border: "#b7eb8f" },
//     "Pending to Verify OTP": {
//       color: "gray",
//       background: "#f5f5f5",
//       border: "#d9d9d9",
//     },
//     Rejected: { color: "red", background: "#fff1f0", border: "#ffa39e" },
//   };

//   const getStatusTag = (status) => {
//     const statusInfo = statusColors[status?.trim()] || {
//       color: "black",
//       background: "#f0f0f0",
//       border: "#d9d9d9",
//     };
//     return (
//       <Tag
//         style={{
//           color: statusInfo.color,
//           backgroundColor: statusInfo.background,
//           borderColor: statusInfo.border,
//           fontWeight: "bold",
//           fontSize: "14px",
//           padding: "5px 10px",
//           borderRadius: "5px",
//         }}
//       >
//         {status}
//       </Tag>
//     );
//   };

//   const renderActionButton = () => {
//     switch (status) {
//       case "Approved":
//         return (
//           <Button
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             className="bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
//             onClick={() => navigate("/store/payment-packages")}
//           >
//             Proceed to Payment
//           </Button>
//         );
//       case "Pending to Approved":
//         return (
//           <Button
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
//             onClick={() => navigate("/home")}
//           >
//             Return to Homepage
//           </Button>
//         );
//       case "Rejected":
//         return (
//           <Button
//             type="primary"
//             danger
//             icon={<ExclamationCircleOutlined />}
//             className="bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
//             onClick={() => navigate("/store/registerStore")}
//           >
//             Retry Registration
//           </Button>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-5">
//       <div
//         style={{
//           fontSize: "18px",
//           fontWeight: "bold",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <span>Status: </span>
//         <span style={{ marginLeft: "10px" }}>{getStatusTag(status)}</span>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-10">
//         <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
//           🎉 Submission Successful!
//         </h2>
//         <div className="flex justify-center">
//           <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
//             <div className="mb-4">
//               <CheckCircleOutlined className="text-4xl text-green-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-green-700 mb-2">
//               Your Registration has been successfully submitted!
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Please wait for the admin team to review and approve your
//               application within the next 24 hours.
//             </p>
//             <p className="text-gray-700">
//               For any further queries or assistance, please contact our team via
//               our{" "}
//               <a href="/contact" className="text-blue-600 hover:underline">
//                 Contact Form
//               </a>
//             </p>
//             <div className="mt-6">{renderActionButton()}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionSuccess;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getUserRequestDetails } from "../../api/apiConfig";

const SubmissionSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requestStatus, status } = useSelector(
    (state) => state.storeRegistration
  );

  const [userRequestStatus, setUserRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 ✅ Hook useEffect LUÔN ĐƯỢC GỌI TRƯỚC return()
  useEffect(() => {
    const checkUserStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserRequestDetails(userId);
        const statusFromAPI =
          response?.data?.userRequestInfo?.userRequestStatus?.label;

        if (statusFromAPI) {
          setUserRequestStatus(statusFromAPI);
          dispatch({
            type: "storeRegistration/setRequestStatus",
            payload: statusFromAPI,
          });
        } else {
          console.warn("User request status is undefined in API response.");
        }

        // 🚀 Sau khi lấy xong dữ liệu, tắt trạng thái loading
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user request status:", error);
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [dispatch]);

  // 🔥 ✅ Hook useEffect luôn được gọi, không phụ thuộc vào điều kiện
  useEffect(() => {
    if (userRequestStatus === "Approved") {
      Modal.success({
        title: "Registration Approved",
        content: "Your registration has been approved! Proceed to payment.",
        okText: "Proceed to Payment",
        onOk: () => navigate("/store/payment-packages"),
      });
    }

    if (userRequestStatus === "Rejected") {
      Modal.error({
        title: "Registration Rejected",
        content:
          "Your registration has been rejected. Please retry the registration process.",
        okText: "Retry Registration",
        onOk: () => navigate("/store/registerStore"),
      });
    }
  }, [userRequestStatus, navigate]);

  // 🔥 Nếu đang loading, hiển thị spinner thay vì trang trắng
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // 🔥 ✅ Không return trước khi gọi useEffect
  if (requestStatus !== "Pending to Approved") {
    navigate("/home");
    return null;
  }

  return (
    <div className="p-5">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          🎉 Submission Successful!
        </h2>
        <div className="flex justify-center">
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
            <div className="mb-4">
              <CheckCircleOutlined className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Your Registration has been successfully submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Please wait for the admin team to review and approve your
              application within the next 24 hours.
            </p>
            <p className="text-gray-700">
              For any further queries or assistance, please contact our team via
              our{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact Form
              </a>
            </p>

            {/* Render nút "Return to Homepage" cho Pending to Approved */}
            {status === "Pending to Approved" && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => navigate("/home")}
              >
                Return to Homepage
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Button, Tag } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";

// const statusColors = {
//   "Pending to Approved": {
//     color: "gold",
//     background: "#fffbe6",
//     border: "#ffe58f",
//   },
//   Approved: { color: "green", background: "#f6ffed", border: "#b7eb8f" },
//   "Verify OTP": {
//     color: "gray",
//     background: "#f5f5f5",
//     border: "#d9d9d9",
//   },
//   Rejected: { color: "red", background: "#fff1f0", border: "#ffa39e" },
// };

// const getStatusTag = (status) => {
//   const statusInfo = statusColors[status?.trim()] || {
//     color: "black",
//     background: "#f0f0f0",
//     border: "#d9d9d9",
//   };
//   return (
//     <Tag
//       style={{
//         color: statusInfo.color,
//         backgroundColor: statusInfo.background,
//         borderColor: statusInfo.border,
//         fontWeight: "bold",
//         fontSize: "14px",
//         padding: "5px 10px",
//         borderRadius: "5px",
//       }}
//     >
//       {status}
//     </Tag>
//   );
// };

// const SubmissionSuccess = () => {
//   const navigate = useNavigate();
//   const requestStatus = useSelector(
//     (state) => state.storeRegistration.requestStatus
//   );
//   const [countdown, setCountdown] = useState(10);

//   // 🛠 Di chuyển useEffect lên trên để tránh lỗi gọi Hook conditionally
//   useEffect(() => {
//     if (requestStatus === "Rejected" || requestStatus === "Verify OTP") {
//       navigate("/store/registerStore");
//     }
//   }, [requestStatus, navigate]);

//   useEffect(() => {
//     if (requestStatus === "Pending to Approved") {
//       if (countdown > 0) {
//         const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//         return () => clearTimeout(timer); // Cleanup timer khi component bị unmount
//       } else {
//         navigate("/home"); // 🔄 Chuyển hướng sau khi đếm ngược kết thúc
//       }
//     }
//   }, [countdown, requestStatus, navigate]);

//   // 🛠 Kiểm tra nếu trạng thái không hợp lệ, không hiển thị trang
//   if (requestStatus !== "Pending to Approved") {
//     return null;
//   }

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold text-blue-600">Store Registration</h1>
//       <div
//         style={{
//           fontSize: "18px",
//           fontWeight: "bold",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <span>Status: </span>
//         <span style={{ marginLeft: "10px" }}>
//           {getStatusTag(requestStatus)}
//         </span>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-10">
//         <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
//           🎉 Submission Successful!
//         </h2>
//         <div className="flex justify-center">
//           <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
//             <div className="mb-4">
//               <CheckCircleOutlined className="text-4xl text-green-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-green-700 mb-2">
//               Your Registration has been successfully submitted!
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Please wait for the admin team to review and approve your
//               application within the next 24 hours.
//             </p>
//             <p className="text-gray-700">
//               For any further queries or assistance, please contact our team via
//               our{" "}
//               <a href="/contact" className="text-blue-600 hover:underline">
//                 Contact Form
//               </a>
//             </p>
//             <div className="mt-6">
//               <Button
//                 type="primary"
//                 icon={<CheckCircleOutlined />}
//                 className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
//                 onClick={() => navigate("/home")} // 🛠 Chuyển hướng khi click
//               >
//                 Return to Homepage ({countdown}s)
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionSuccess;
