import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { checkSuccessOrder } from "../redux/slices/orderSlice";
import { Spin, Alert, Card, Button } from "antd";
import {
  CheckCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import Confetti from "react-confetti"; // Import thư viện pháo hoa

export default function CheckProcessOrderCash() {
  //   const dispatch = useDispatch();
  const { dataCashPayment } = useSelector((state) => state.orders);
  const [confettiActive, setConfettiActive] = useState(false); // Trạng thái pháo hoa

  useEffect(() => {
    if (dataCashPayment && dataCashPayment.isSuccess) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000); // Tắt pháo hoa sau 5 giây
    }
  }, [dataCashPayment]);

  if (dataCashPayment === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
      {confettiActive && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div className="container mx-auto p-8 max-w-3xl">
        {!dataCashPayment.isSuccess ? (
          <Alert
            message="order failed"
            description={dataCashPayment.data.message || "not information"}
            type="error"
            showIcon
            action={
              <Button type="link" href="/" className="text-blue-500">
                Back to home
              </Button>
            }
            className="mb-6"
          />
        ) : (
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
                    {dataCashPayment.data.totalPrice
                      ? dataCashPayment.data.totalPrice.toLocaleString()
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
                  {dataCashPayment.data.applicationSerialNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Total Amount:</strong>
                <span className="font-semibold text-gray-800">
                  {dataCashPayment.data.totalPrice
                    ? dataCashPayment.data.totalPrice.toLocaleString()
                    : "N/A"}{" "}
                  VND
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Phone Number:</strong>
                <span className="font-semibold text-gray-800">
                  {dataCashPayment.data.contactNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Shipping Address:</strong>
                <span className="text-gray-800">
                  {dataCashPayment.data.address},{dataCashPayment.data.wardName}
                  , {dataCashPayment.data.districtName},{" "}
                  {dataCashPayment.data.provinceName}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Notes:</strong>
                <span className="italic text-gray-600">
                  {dataCashPayment.data.notes || "No notes"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <Button
                type="default"
                icon={<HistoryOutlined />}
                className="text-green-600 border-green-500 hover:bg-green-50"
                href="/history-order"
              >
                Order History
              </Button>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                className="bg-green-500 hover:bg-green-600 text-white"
                href="/"
              >
                Back Home
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
