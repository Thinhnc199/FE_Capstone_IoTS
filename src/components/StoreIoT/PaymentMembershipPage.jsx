import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, notification } from "antd";
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
  const { walletBalance, membershipOptions, errorMessage } = useSelector(
    (state) => state.storeRegistration
  );
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userId, setUserId] = useState(null);
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

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  const handleSubmit = () => {
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

    dispatch(registerMembershipPackage(data))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Membership registered successfully!",
        });
        navigate("/store/welcome");
      })
      .catch((error) => {
        notification.error({
          message: error?.message || "Failed to register membership package.",
        });
      });
  };

  // Show error message
  useEffect(() => {
    if (errorMessage) {
      notification.error({
        message: errorMessage,
        placement: "top",
      });
    }
  }, [errorMessage]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mx-auto w-full max-w-[1000px]">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
        🎉 Payment Memberships
      </h2>

      {/* Membership Selection */}
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

      {/* Wallet Balance & Add Funds */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
        <p className="font-semibold text-lg text-gray-700">
          Wallet Balance:{" "}
          <span className="text-green-600">${walletBalance}</span>
        </p>

        {/* Add Funds Button with Icon */}
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

      {/* Confirm Button */}
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={selectedPackage === null}
        className="w-full py-3 text-lg mt-4 transition-colors duration-300 hover:bg-blue-700"
      >
        Confirm Selection
      </Button>
    </div>
  );
};

export default PaymentMembershipPage;
