// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Button, Card, notification, Modal } from "antd";
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
//   const { walletBalance, membershipOptions, loading } = useSelector(
//     (state) => state.storeRegistration
//   );
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     if (id) {
//       setUserId(id);
//     } else {
//       notification.error({ message: "User ID is not available." });
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       dispatch(getWalletBalance(userId));
//       dispatch(getMembershipOptions());
//     }
//   }, [userId, dispatch]);

//   useEffect(() => {
//     if (toastMessage) {
//       notification.error({
//         message: "Error",
//         description: toastMessage,
//         placement: "topRight",
//         duration: 3,
//       });
//       setToastMessage(null);
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
//       notification.error({
//         message: "Registration Failed",
//         description:
//           typeof error === "string" ? error : "An unexpected error occurred.",
//         placement: "topRight",
//         duration: 3,
//       });
//     }
//   };

//   const showConfirmModal = () => {
//     if (selectedPackage === null) {
//       notification.error({ message: "Please select a membership package." });
//       return;
//     }
//     setIsModalVisible(true);
//   };

//   const handleConfirm = () => {
//     setIsModalVisible(false);
//     handleSubmit();
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-8 mx-auto w-full max-w-[1300px]">
//       <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
//         🎉 Payment Memberships
//       </h2>

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

//       <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
//         <p className="font-semibold text-lg text-gray-700">
//           Wallet Balance:{" "}
//           <span className="text-green-600">${walletBalance}</span>
//         </p>

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

//       <Button
//         type="primary"
//         onClick={showConfirmModal}
//         disabled={selectedPackage === null}
//         className="w-full py-3 text-lg mt-4 transition-colors duration-300 hover:bg-blue-700"
//       >
//         Confirm Selection
//       </Button>

//       <Modal
//         title="Confirm Your Selection"
//         visible={isModalVisible && !loading}
//         onOk={handleConfirm}
//         onCancel={handleCancel}
//         okText="Yes"
//         cancelText="No"
//       >
//         <p>
//           Are you sure you want to register for the{" "}
//           <strong>
//             {membershipOptions && Array.isArray(membershipOptions)
//               ? membershipOptions.find(
//                   (option) => option.id === selectedPackage
//                 )?.label || "Unknown Package"
//               : "Loading..."}
//           </strong>{" "}
//           package with a fee of{" "}
//           <strong>
//             {membershipOptions && Array.isArray(membershipOptions)
//               ? membershipOptions.find(
//                   (option) => option.id === selectedPackage
//                 )?.fee || "N/A"
//               : "Loading..."}
//           </strong>
//           ?
//         </p>
//       </Modal>
//     </div>
//   );
// };

// export default PaymentMembershipPage;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, notification, Modal, Input } from "antd";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import {
  createVnPayPayment,
  checkVnPayPayment,
  getWalletBalance,
  resetPayment,
} from "../../redux/slices/paymentSlice";
import {
  registerMembershipPackage,
  getMembershipOptions,
} from "../../redux/slices/storeRegistrationSlice";
import { useNavigate, useLocation } from "react-router-dom";

const { Meta } = Card;

const PaymentMembershipPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const paymentState = useSelector((state) => state.payment || {});
  const {
    paymentUrl,
    paymentResult,
    wallet,
    loading: paymentLoading,
    error: paymentError,
  } = paymentState;

  const storeRegistrationState = useSelector(
    (state) => state.storeRegistration || {}
  );
  const { membershipOptions, loading: storeLoading } = storeRegistrationState;

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [amount, setAmount] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);

  // Sử dụng import.meta.env để lấy biến môi trường từ .env
  const returnUrl = "http://localhost:5173/payment-packages";
  const finalUrl = "/payment-packages";
  // const returnUrl = import.meta.env.VITE_DEPLOY_URL + "/payment-packages"; 
  // Khởi tạo userId và lấy dữ liệu ban đầu
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

  // Xử lý URL thanh toán VnPay
  useEffect(() => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
  }, [paymentUrl]);

  // Kiểm tra callback từ VnPay và reset URL sau khi xử lý
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("vnp_Amount") && !hasProcessedPayment) {
      const urlResponse = window.location.href;
      dispatch(checkVnPayPayment(urlResponse));
      setHasProcessedPayment(true); // Đánh dấu đã xử lý để không chạy lại
    }
  }, [location, dispatch, hasProcessedPayment]);

  // Hiển thị kết quả thanh toán và reset URL
  useEffect(() => {
    if (paymentResult) {
      console.log("payment: ", paymentResult);
      if (paymentResult.responseCodeMessage === "Giao dịch thành công") {
        notification.success({
          message: "Transaction Successful",
          description: `
            Amount: ${paymentResult.vnPayResponse.amount} VND
            Bank: ${paymentResult.vnPayResponse.bankCode}
            Time: ${paymentResult.vnPayResponse.payDate}
          `,
          duration: 3,
          onClose: () => {
            dispatch(getWalletBalance(userId));
            dispatch(resetPayment());
            setHasProcessedPayment(false);
            navigate(finalUrl, { replace: true });
          },
        });
      } else {
        notification.error({
          message: "Payment Failed",
          description: paymentResult.responseCodeMessage || "An error occurred",
          duration: 3,
          onClose: () => {
            dispatch(resetPayment());
            setHasProcessedPayment(false);
            navigate(finalUrl, { replace: true });
          },
        });
      }
    }
  }, [paymentResult, dispatch, userId, navigate]);

  // Xử lý chọn package
  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  // Xử lý nạp tiền
  const handleAddFunds = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = () => {
    if (!amount || amount <= 0) {
      notification.error({ message: "Please enter a valid amount" });
      return;
    }
    dispatch(
      createVnPayPayment({
        amount: parseInt(amount),
        returnUrl,
      })
    );
    setIsPaymentModalOpen(false);
    setAmount("");
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    setAmount("");
  };

  // Xử lý đăng ký membership
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
      await dispatch(registerMembershipPackage(data)).unwrap(); // Loại bỏ biến response không dùng
      notification.success({
        message: "Membership registered successfully!",
      });
      navigate("/store/welcome");
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description:
          typeof error === "string" ? error : "An unexpected error occurred.",
      });
    }
  };

  const showConfirmModal = () => {
    if (selectedPackage === null) {
      notification.error({ message: "Please select a membership package." });
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
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

        <div className="flex justify-center gap-6 max-w-[900px] mx-auto">
          {Array.isArray(membershipOptions) && membershipOptions.length > 0 ? (
            membershipOptions.slice(0, 3).map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transform transition-all duration-300 ease-in-out flex-1 max-w-[300px] ${
                  selectedPackage === option.id
                    ? "border-4 border-blue-600 scale-105"
                    : "border-2 border-gray-300 hover:scale-105"
                }`}
                hoverable
                onClick={() => handlePackageSelect(option.id)}
                style={{ padding: "20px", borderRadius: "15px" }}
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
          <span className="text-green-600">{wallet?.ballance || 0} Gold</span>
        </p>

        <Button
          type="primary"
          className="flex items-center space-x-2 px-4 py-2"
          onClick={handleAddFunds}
          loading={paymentLoading}
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

      {/* Modal confirm package registration */}
      <Modal
        title="Confirm Your Selection"
        open={isConfirmModalOpen && !storeLoading}
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

      {/* Modal add funds */}
      <Modal
        title="Add Funds to Wallet"
        open={isPaymentModalOpen}
        onOk={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
        okText="Pay"
        cancelText="Cancel"
      >
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (VND)"
          prefix="₫"
          min={0}
        />
      </Modal>

      {/* Display error if any */}
      {paymentError && (
        <notification.error
          message="Error"
          description={paymentError.message || "An error occurred"}
        />
      )}
    </div>
  );
};

export default PaymentMembershipPage;

