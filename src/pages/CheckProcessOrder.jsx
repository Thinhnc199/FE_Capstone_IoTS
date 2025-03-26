// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { checkSuccessOrder } from "../redux/slices/orderSlice";
// import { Spin, Alert, Card, Button } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";

// export default function CheckProcessOrder() {
//   const dispatch = useDispatch();
//   const { dataCheckOrder } = useSelector((state) => state.orders);

//   useEffect(() => {
//     const fetchOrderStatus = async () => {
//       try {
//         const currentUrl = window.location.href;
//         console.log("Fetching order status for URL:", currentUrl);
//         await dispatch(checkSuccessOrder({ urlResponse: currentUrl }));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchOrderStatus();
//   }, [dispatch]);

//   if (dataCheckOrder === null) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="container mx-auto p-8 max-w-3xl ">
//         {!dataCheckOrder.isSuccess ? (
//           <Alert
//             message="Đặt hàng thất bại"
//             description={dataCheckOrder.data.message || "Không có thông tin"}
//             type="error"
//             showIcon
//             action={
//               <Button type="link" href="/" className="text-blue-500">
//                 Quay lại trang chủ
//               </Button>
//             }
//             className="mb-6"
//           />
//         ) : (
//           <Card
//             title="Thanh toán thành công 🎉"
//             className="shadow-lg rounded-lg p-6 "
//             extra={
//               <div className="text-green-600 text-xl">
//                 <CheckCircleOutlined />
//               </div>
//             }
//           >
//             <div className="space-y-4">
//               <p>
//                 <strong>Mã đơn hàng:</strong>{" "}
//                 <span className="font-semibold">
//                   {dataCheckOrder.data.applicationSerialNumber}
//                 </span>
//               </p>
//               <p>
//                 <strong>Tổng tiền:</strong>{" "}
//                 <span className="font-semibold">
//                   {dataCheckOrder.data.totalPrice
//                     ? dataCheckOrder.data.totalPrice.toLocaleString()
//                     : "N/A"}{" "}
//                   VND
//                 </span>
//               </p>
//               <p>
//                 <strong>Địa chỉ giao hàng:</strong> {dataCheckOrder.address},{" "}
//                 {dataCheckOrder.data.wardName}, {dataCheckOrder.districtName},{" "}
//                 {dataCheckOrder.data.provinceName}
//               </p>
//               <p>
//                 <strong>Số điện thoại:</strong>{" "}
//                 <span className="font-semibold">
//                   {dataCheckOrder.data.contactNumber}
//                 </span>
//               </p>
//               <p>
//                 <strong>Ghi chú:</strong>{" "}
//                 <span className="italic text-gray-600">
//                   {dataCheckOrder.data.notes || "Không có ghi chú"}
//                 </span>
//               </p>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <Button
//                 type="primary"
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//                 href="/"
//               >
//                 Quay lại trang chủ
//               </Button>
//             </div>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSuccessOrder } from "../redux/slices/orderSlice";
import { Spin, Alert, Card, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import Confetti from "react-confetti"; // Import thư viện pháo hoa

export default function CheckProcessOrder() {
  const dispatch = useDispatch();
  const { dataCheckOrder } = useSelector((state) => state.orders);
  const [confettiActive, setConfettiActive] = useState(false); // Trạng thái pháo hoa

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const currentUrl = window.location.href;
        console.log("Fetching order status for URLq:", currentUrl);
        console.log(window.location.href);
        await dispatch(checkSuccessOrder({ urlResponse: currentUrl }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderStatus();
  }, [dispatch]);

  useEffect(() => {
    if (dataCheckOrder && dataCheckOrder.isSuccess) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000); // Tắt pháo hoa sau 5 giây
    }
  }, [dataCheckOrder]);

  if (dataCheckOrder === null) {
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
        {!dataCheckOrder.isSuccess ? (
          <Alert
            message="order failed"
            description={dataCheckOrder.data.message || "not information"}
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
                    {dataCheckOrder.data.totalPrice
                      ? dataCheckOrder.data.totalPrice.toLocaleString()
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
                  {dataCheckOrder.data.applicationSerialNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Total Amount:</strong>
                <span className="font-semibold text-gray-800">
                  {dataCheckOrder.data.totalPrice
                    ? dataCheckOrder.data.totalPrice.toLocaleString()
                    : "N/A"}{" "}
                  VND
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Phone Number:</strong>
                <span className="font-semibold text-gray-800">
                  {dataCheckOrder.data.contactNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Shipping Address:</strong>
                <span className="text-gray-800">
                  {dataCheckOrder.data.address},{dataCheckOrder.data.wardName},{" "}
                  {dataCheckOrder.data.districtName},{" "}
                  {dataCheckOrder.data.provinceName}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-600">Notes:</strong>
                <span className="italic text-gray-600">
                  {dataCheckOrder.data.notes || "Không có ghi chú"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="primary"
                className="bg-green-500 hover:bg-green-600 text-white"
                href="/"
              >
                Back to Home
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
