// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Button, Card, notification } from "antd";
// import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
// import {
//   registerMembershipPackage,
//   getWalletBalance,
//   getMembershipOptions,
// } from "../../redux/slices/storeRegistrationSlice";
// import { useNavigate } from "react-router-dom";

// const { Meta } = Card;

// const PaymentMembershipPage = () => {
//   const dispatch = useDispatch();
//   const { walletBalance, membershipOptions } = useSelector(
//     (state) => state.storeRegistration
//   );
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [toastMessage, setToastMessage] = useState(null);
//   const navigate = useNavigate();

//   // Lấy userId từ localStorage khi component mount
//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     if (id) {
//       setUserId(id);
//     } else {
//       notification.error({ message: "User ID is not available." });
//     }
//   }, []);

//   // Fetch dữ liệu từ API khi userId thay đổi
//   useEffect(() => {
//     if (userId) {
//       dispatch(getWalletBalance(userId));
//       dispatch(getMembershipOptions());
//     }
//   }, [userId, dispatch]);

//   // Theo dõi lỗi từ Redux và hiển thị thông báo
//   // useEffect(() => {
//   //   if (errorMessage) {
//   //     console.log("🛠 Redux Error Message:", errorMessage);
//   //     setToastMessage(errorMessage);
//   //   }
//   // }, [errorMessage]);

//   // Hiển thị Toast khi có lỗi từ Redux
//   useEffect(() => {
//     if (toastMessage) {
//       notification.error({
//         message: "Error",
//         description: toastMessage,
//         placement: "topRight",
//         duration: 3,
//       });
//       setToastMessage(null); // Xóa lỗi sau khi hiển thị
//     }
//   }, [toastMessage]);

//   const handlePackageSelect = (packageId) => {
//     setSelectedPackage(packageId);
//   };

//   const handleSubmit = async () => {
//     if (selectedPackage === null) {
//       notification.error({ message: "Please select a membership package." });
//       return;
//     }

//     if (!Array.isArray(membershipOptions) || membershipOptions.length === 0) {
//       notification.error({
//         message: "Membership options are still loading...",
//       });
//       return;
//     }

//     const selectedOption = membershipOptions.find(
//       (option) => option.id === selectedPackage
//     );

//     if (!selectedOption) {
//       notification.error({
//         message: "Selected membership package is invalid.",
//       });
//       return;
//     }

//     const data = {
//       userId,
//       membershipPackageId: selectedPackage,
//     };

//     try {
//       console.log("🔍 Sending request:", data);
//       const response = await dispatch(registerMembershipPackage(data)).unwrap();
//       console.log("✅ API Response:", response);
//       notification.success({
//         message: "Membership registered successfully!",
//       });
//       navigate("/store/welcome");
//     } catch (error) {
//       // console.error("❌ API Error:", error);

//       // 👉 Hiển thị thông báo lỗi từ API
//       notification.error({
//         message: "Registration Failed",
//         description:
//           typeof error === "string" ? error : "An unexpected error occurred.",
//         placement: "topRight",
//         duration: 3, // Hiển thị 3 giây
//       });
//     }
//   };
//   return (
//     <div className="bg-white shadow-lg rounded-lg p-8 mx-auto w-full max-w-[1300px]">
//       <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
//         🎉 Payment Memberships
//       </h2>

//       {/* Membership Selection */}
//       <div className="mb-8">
//         <h3 className="font-semibold text-lg text-gray-700 mb-6">
//           Choose Your Membership Package:
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {Array.isArray(membershipOptions) && membershipOptions.length > 0 ? (
//             membershipOptions.map((option) => (
//               <Card
//                 key={option.id}
//                 className={`cursor-pointer transform transition-all duration-300 ease-in-out ${
//                   selectedPackage === option.id
//                     ? "border-4 border-blue-600 scale-105"
//                     : "border-2 border-gray-300 hover:scale-105"
//                 }`}
//                 hoverable
//                 onClick={() => handlePackageSelect(option.id)}
//                 style={{ width: "100%", padding: "20px", borderRadius: "15px" }}
//               >
//                 <Meta
//                   title={
//                     <div className="flex items-center space-x-2 mb-2">
//                       <FaCreditCard className="text-blue-600" />
//                       <span className="font-semibold text-lg">
//                         {option.label}
//                       </span>
//                     </div>
//                   }
//                   description={
//                     <div className="flex justify-between">
//                       <span>
//                         Fee:{" "}
//                         <span className="font-semibold text-green-600">
//                           {option.fee}
//                         </span>
//                       </span>
//                     </div>
//                   }
//                 />
//               </Card>
//             ))
//           ) : (
//             <p className="text-center text-gray-600">
//               No membership options available or still loading...
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Wallet Balance & Add Funds */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
//         <p className="font-semibold text-lg text-gray-700">
//           Wallet Balance:{" "}
//           <span className="text-green-600">${walletBalance}</span>
//         </p>

//         {/* Add Funds Button with Icon */}
//         <Button
//           type="primary"
//           className="flex items-center space-x-2 px-4 py-2"
//           onClick={() => {
//             notification.info({
//               message: "Add funds functionality to be implemented",
//             });
//           }}
//         >
//           <FaMoneyBillWave className="text-white" />
//           <span>Add Funds</span>
//         </Button>
//       </div>

//       {/* Confirm Button */}
//       <Button
//         type="primary"
//         onClick={handleSubmit}
//         disabled={selectedPackage === null}
//         className="w-full py-3 text-lg mt-4 transition-colors duration-300 hover:bg-blue-700"
//       >
//         Confirm Selection
//       </Button>
//     </div>
//   );
// };

// export default PaymentMembershipPage;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, notification, Modal } from "antd";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import {
  registerMembershipPackage,
  getWalletBalance,
  getMembershipOptions,
} from "../../redux/slices/storeRegistrationSlice";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const PaymentMembershipPage = () => {
  const dispatch = useDispatch();
  const { walletBalance, membershipOptions, loading } = useSelector(
    (state) => state.storeRegistration
  );
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    } else {
      notification.error({ message: "User ID is not available." });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(getWalletBalance(userId));
      dispatch(getMembershipOptions());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (toastMessage) {
      notification.error({
        message: "Error",
        description: toastMessage,
        placement: "topRight",
        duration: 3,
      });
      setToastMessage(null);
    }
  }, [toastMessage]);

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  const handleSubmit = async () => {
    if (selectedPackage === null) {
      notification.error({ message: "Please select a membership package." });
      return;
    }

    if (!Array.isArray(membershipOptions) || membershipOptions.length === 0) {
      notification.error({
        message: "Membership options are still loading...",
      });
      return;
    }

    const selectedOption = membershipOptions.find(
      (option) => option.id === selectedPackage
    );

    if (!selectedOption) {
      notification.error({
        message: "Selected membership package is invalid.",
      });
      return;
    }

    const data = {
      userId,
      membershipPackageId: selectedPackage,
    };

    try {
      console.log("🔍 Sending request:", data);
      const response = await dispatch(registerMembershipPackage(data)).unwrap();
      console.log("✅ API Response:", response);
      notification.success({
        message: "Membership registered successfully!",
      });
      navigate("/store/welcome");
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description:
          typeof error === "string" ? error : "An unexpected error occurred.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const showConfirmModal = () => {
    if (selectedPackage === null) {
      notification.error({ message: "Please select a membership package." });
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    setIsModalVisible(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mx-auto w-full max-w-[1300px]">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
        🎉 Payment Memberships
      </h2>

      <div className="mb-8">
        <h3 className="font-semibold text-lg text-gray-700 mb-6">
          Choose Your Membership Package:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(membershipOptions) && membershipOptions.length > 0 ? (
            membershipOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transform transition-all duration-300 ease-in-out ${
                  selectedPackage === option.id
                    ? "border-4 border-blue-600 scale-105"
                    : "border-2 border-gray-300 hover:scale-105"
                }`}
                hoverable
                onClick={() => handlePackageSelect(option.id)}
                style={{ width: "100%", padding: "20px", borderRadius: "15px" }}
              >
                <Meta
                  title={
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCreditCard className="text-blue-600" />
                      <span className="font-semibold text-lg">
                        {option.label}
                      </span>
                    </div>
                  }
                  description={
                    <div className="flex justify-between">
                      <span>
                        Fee:{" "}
                        <span className="font-semibold text-green-600">
                          {option.fee}
                        </span>
                      </span>
                    </div>
                  }
                />
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No membership options available or still loading...
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
        <p className="font-semibold text-lg text-gray-700">
          Wallet Balance:{" "}
          <span className="text-green-600">${walletBalance}</span>
        </p>

        <Button
          type="primary"
          className="flex items-center space-x-2 px-4 py-2"
          onClick={() => {
            notification.info({
              message: "Add funds functionality to be implemented",
            });
          }}
        >
          <FaMoneyBillWave className="text-white" />
          <span>Add Funds</span>
        </Button>
      </div>

      <Button
        type="primary"
        onClick={showConfirmModal}
        disabled={selectedPackage === null}
        className="w-full py-3 text-lg mt-4 transition-colors duration-300 hover:bg-blue-700"
      >
        Confirm Selection
      </Button>

      <Modal
        title="Confirm Your Selection"
        visible={isModalVisible && !loading}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to register for the{" "}
          <strong>
            {membershipOptions && Array.isArray(membershipOptions)
              ? membershipOptions.find(
                  (option) => option.id === selectedPackage
                )?.label || "Unknown Package"
              : "Loading..."}
          </strong>{" "}
          package with a fee of{" "}
          <strong>
            {membershipOptions && Array.isArray(membershipOptions)
              ? membershipOptions.find(
                  (option) => option.id === selectedPackage
                )?.fee || "N/A"
              : "Loading..."}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default PaymentMembershipPage;
