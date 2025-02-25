import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckStoreStatus = () => {
  const navigate = useNavigate();

  // Lấy trạng thái requestStatus và isActive từ Redux
  const requestStatus = useSelector((state) => state.storeRegistration.requestStatus);
  const isActive = useSelector((state) => state.storeRegistration.isActive);

  // Kiểm tra điều kiện và điều hướng
  useEffect(() => {
    if (isActive === 2 && requestStatus === "Approved") {
      navigate("/store/payment-packages");
    }
  }, [isActive, requestStatus, navigate]);

  return null; 
};

export default CheckStoreStatus;
