import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSuccessOrderMobile } from "../redux/slices/orderSlice";
import { Spin, Alert, Card, Button } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Confetti from "react-confetti"; // Import thư viện pháo hoa

export default function CheckProcessOrderMobile() {
  const dispatch = useDispatch();
  const { dataCheckOrderMobile, loading, error } = useSelector(
    (state) => state.orders
  );
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    dispatch(checkSuccessOrderMobile({ urlResponse: currentUrl }));
  }, [dispatch]);

  useEffect(() => {
    if (dataCheckOrderMobile?.isSuccess) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000);
    }
  }, [dataCheckOrderMobile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Checking order..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 min-h-screen flex items-center justify-center">
        <Card
          title={
            <div className="flex items-center justify-center text-red-600 text-xl font-semibold">
              <CloseCircleOutlined className="mr-2" />
              Payment Failed
            </div>
          }
          className="shadow-lg rounded-lg p-6 border-red-300 border max-w-xl w-full"
        >
          <p className="text-gray-700 text-center mb-4">
            {error ||
              "Payment failed. Please try again or check your order history."}
          </p>
          <div className="flex justify-center gap-3">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                // window.location.href = "fe-capstone-iots-mobile://home";
                const deepLink = `fe-capstone-iots-mobile://home`.replace(
                  /\/+$/,
                  ""
                );
                window.location.href = deepLink;
              }}
            >
              Back Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (dataCheckOrderMobile?.isSuccess) {
    return (
      <div className="bg-gray-100 min-h-screen container mx-auto p-2 max-w-3xl">
        {confettiActive && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
        <Card
          title={
            <div>
              <div className="flex items-center justify-center">
                <span className="text-green-600 mr-2">
                  <CheckCircleOutlined />
                </span>
                <span className="text-xl font-semibold text-green-500">
                  Payment successful 🎉
                </span>
              </div>
              <div className="text-center py-4">
                <p className="text-gray-600 text-3xl font-bold font-Mainfont">
                  {dataCheckOrderMobile.data.totalPrice
                    ? dataCheckOrderMobile.data.totalPrice.toLocaleString()
                    : "N/A"}{" "}
                  VND
                </p>
              </div>
            </div>
          }
          className="shadow-lg rounded-lg p-6 border-green-200 border font-Mainfont"
        >
          <div className="space-y-5">
            {" "}
            {/* Giảm khoảng cách giữa các dòng */}
            <div className="flex justify-between">
              <strong className="text-gray-600">Order ID:</strong>
              <span className="font-semibold text-gray-800">
                {dataCheckOrderMobile.data.applicationSerialNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Total Amount:</strong>
              <span className="font-semibold text-gray-800">
                {dataCheckOrderMobile.data.totalPrice
                  ? dataCheckOrderMobile.data.totalPrice.toLocaleString()
                  : "N/A"}{" "}
                VND
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Phone Number:</strong>
              <span className="font-semibold text-gray-800">
                {dataCheckOrderMobile.data.contactNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Shipping Address:</strong>
              <span className="text-gray-800">
                {dataCheckOrderMobile.data.address},
                {dataCheckOrderMobile.data.wardName},{" "}
                {dataCheckOrderMobile.data.districtName},{" "}
                {dataCheckOrderMobile.data.provinceName}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Notes:</strong>
              <span className="italic text-gray-600">
                {dataCheckOrderMobile.data.notes || "No notes"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                // window.location.href = "fe-capstone-iots-mobile://home";
                const deepLink = `fe-capstone-iots-mobile://home`.replace(
                  /\/+$/,
                  ""
                );
                window.location.href = deepLink;
              }}
            >
              Back Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <Alert
        message="Không xác định được trạng thái"
        description="Vui lòng kiểm tra lại lịch sử đơn hàng"
        type="warning"
        showIcon
        action={
          <Button type="link" href="/" className="text-blue-500">
            Back to home
          </Button>
        }
        className="mb-6"
      />
    </div>
  );
}
