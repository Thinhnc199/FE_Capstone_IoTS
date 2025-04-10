// import { Typography, Card, Tabs, Spin, Button, Modal } from "antd";
// import BreadcrumbNav from "../components/common/BreadcrumbNav";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { message } from "antd";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchHistoryOrder,
//   changeFeedbackStatus,
//   getTrackingGhtk,
//   changeCancelledStatus,
// } from "../redux/slices/orderSlice";
// import {
//   MessageOutlined,
//   ShopOutlined,
//   SafetyCertificateOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import "dayjs/locale/vi";
// import FeedbackForm from "./Orders/FeedbackForm";
// import { TruckOutlined } from "@ant-design/icons";
// import {
//   ExclamationCircleOutlined,
//   PhoneOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   BankOutlined,
// } from "@ant-design/icons";
// import WarrantyRequestModal from "./../pages/Orders/WarrantyRequestModal";
// const { Title } = Typography;
// const { TabPane } = Tabs;
// dayjs.locale("vi");

// // Status configuration
// const statusConfig = {
//   0: {
//     text: "All orders",
//     color: "bg-amber-100 text-amber-800 border-amber-200",
//     icon: "📋",
//     tabName: "All orders",
//   },
//   1: {
//     text: "Pending",
//     color: "bg-amber-100 text-amber-800 border-amber-200",
//     icon: "⏳",
//     tabName: "Pending",
//   },
//   2: {
//     text: "Packing",
//     color: "bg-blue-100 text-blue-800 border-blue-200",
//     icon: "📦",
//     tabName: "Packing",
//   },
//   3: {
//     text: "Delivering",
//     color: "bg-purple-100 text-purple-800 border-purple-200",
//     icon: "🚚",
//     tabName: "Delivering",
//   },
//   5: {
//     text: "Pending to feedback",
//     color: "bg-pink-100 text-pink-800 border-pink-200",
//     icon: "⭐",
//     tabName: "Pending to feedback",
//   },
//   6: {
//     text: "Success order",
//     color: "bg-emerald-100 text-emerald-800 border-emerald-200",
//     icon: "🏆",
//     tabName: "Success order",
//   },
//   7: {
//     text: "Cancel",
//     color: "bg-red-100 text-red-800 border-red-200",
//     icon: "↩️",
//     tabName: "Cancel",
//   },
//   8: {
//     text: "Bad feedback",
//     color: "bg-yellow-100 text-red-800 border-red-200",
//     icon: "👎",
//     tabName: "Bad feedback",
//   },
// };

// const getStatusTag = (statusId) => {
//   const config = statusConfig[statusId] || {
//     text: "Unknown",
//     color: "bg-gray-100 text-gray-800 border-gray-200",
//     icon: "",
//   };
//   return (
//     <div
//       className={`inline-flex items-center px-2 py-1 rounded-sm text-xs border ${config.color}`}
//     >
//       <span className="mr-1">{config.icon}</span>
//       {config.text}
//     </div>
//   );
// };

// const formatDate = (dateString) => {
//   return dayjs(dateString).format("DD/MM/YYYY HH:mm");
// };

// const OrderItem = ({ item, onWarrantyRequestClick }) => {
//   const currentDate = new Date();
//   const warrantyEndDate = new Date(item.warrantyEndDate);
//   const isWarrantyValid = warrantyEndDate > currentDate;
//   const isWarrantyApplicable = item.productType !== 3;

//   return (
//     <div className="flex justify-between items-center border-b p-3 bg-blue-50 rounded-md">
//       <div className="flex items-center">
//         <img
//           src={item.imageUrl}
//           alt={item.nameProduct}
//           width={80}
//           height={80}
//           className="rounded-sm object-cover"
//         />
//         <div className="ml-4">
//           <p className="font-medium">{item.nameProduct}</p>
//           <p className="text-gray-600">Quantity: {item.quantity}</p>
//         </div>
//       </div>
//       <div className="flex items-end space-x-4 flex-col-reverse">
//         <p className="text-red-500 font-medium">
//           {item.price.toLocaleString("vi-VN")}₫
//         </p>
//         {item.orderItemStatus === 6 && isWarrantyApplicable && (
//           <>
//             {isWarrantyValid ? (
//               <Button
//                 shape="circle"
//                 className="border-none text-yellow-500 flex items-center justify-center shadow-none hover:bg-yellow-100 bg-blue-50"
//                 onClick={() => onWarrantyRequestClick(item.orderItemId)}
//               >
//                 <SafetyCertificateOutlined />
//               </Button>
//             ) : (
//               <span className="text-gray-500 text-xs">Warranty expired!</span>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// OrderItem.propTypes = {
//   item: PropTypes.shape({
//     orderItemId: PropTypes.number.isRequired,
//     imageUrl: PropTypes.string.isRequired,
//     nameProduct: PropTypes.string.isRequired,
//     quantity: PropTypes.number.isRequired,
//     price: PropTypes.number.isRequired,
//     orderItemStatus: PropTypes.number.isRequired,
//     warrantyEndDate: PropTypes.string.isRequired,
//     productType: PropTypes.number.isRequired,
//   }).isRequired,
//   onWarrantyRequestClick: PropTypes.func.isRequired,
// };

// const SellerGroup = ({
//   group,
//   orderId,
//   onFeedbackClick,
//   onWarrantyRequestClick,
// }) => (
//   <div className="rounded-md mb-4">
//     <div className="flex justify-between items-center border-b pb-3 mb-3">
//       <div className="flex items-center space-x-3">
//         <p className="font-bold text-md">{group.sellerName}</p>
//         <div className="flex space-x-2">
//           <button className="px-1 py-1 border border-blue-500 bg-blue-500 text-white rounded-sm hover:bg-white hover:text-blue-500 transition-colors text-xs">
//             <MessageOutlined className="mr-2" />
//             Chat Now
//           </button>
//           <Link to={`/shop-infomation/${group.storeId}`}>
//             <button className="px-1 py-1 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 transition-colors text-xs">
//               <ShopOutlined className="mr-2" />
//               View Shop
//             </button>
//           </Link>
//         </div>
//       </div>
//       <div className="flex items-center space-x-3">
//         {getStatusTag(group.orderItemStatus)}
//         {group.orderItemStatus === 5 && (
//           <Button
//             className="bg-blue-500 text-white rounded-md border border-blue-500"
//             onClick={() => onFeedbackClick({ ...group, orderId })}
//           >
//             Feedback
//           </Button>
//         )}
//       </div>
//     </div>

//     {group.items.map((item) => (
//       <OrderItem
//         item={item}
//         key={item.orderItemId}
//         onWarrantyRequestClick={onWarrantyRequestClick}
//       />
//     ))}
//   </div>
// );

// SellerGroup.propTypes = {
//   group: PropTypes.shape({
//     sellerId: PropTypes.number.isRequired,
//     sellerName: PropTypes.string.isRequired,
//     storeId: PropTypes.string.isRequired,
//     orderItemStatus: PropTypes.number.isRequired,
//     items: PropTypes.arrayOf(
//       PropTypes.shape({
//         orderItemId: PropTypes.number.isRequired,
//         imageUrl: PropTypes.string.isRequired,
//         nameProduct: PropTypes.string.isRequired,
//         quantity: PropTypes.number.isRequired,
//         price: PropTypes.number.isRequired,
//       })
//     ).isRequired,
//   }).isRequired,
//   orderId: PropTypes.number,
//   onFeedbackClick: PropTypes.func.isRequired,
//   onWarrantyRequestClick: PropTypes.func.isRequired,
// };

// const OrderCard = ({
//   order,
//   onFeedbackClick,
//   onReceivedClick,
//   onTrackClick,
//   onCancelClick,
//   onWarrantyRequestClick,
// }) => {
//   const trackingId = order.orderDetailsGrouped[0]?.trackingId;

//   return (
//     <div className="p-6 rounded-lg shadow-md mb-6 border border-gray-200 bg-white">
//       <div className="flex justify-between items-center border-b pb-4 mb-4">
//         <div>
//           <div className="flex items-center space-x-2 mb-2">
//             <span className="text-gray-600">Order code:</span>
//             <span className="font-bold">{order.applicationSerialNumber}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-gray-600">Create date:</span>
//             <span className="font-medium">{formatDate(order.createDate)}</span>
//           </div>
//         </div>
//         <div className="flex justify-end items-center">
//           {order.orderDetailsGrouped.some(
//             (group) =>
//               group.orderItemStatus === 2 || group.orderItemStatus === 3
//           ) &&
//             trackingId && (
//               <>
//                 <Button
//                   className="border-none shadow-none flex items-center"
//                   onClick={() => onTrackClick(trackingId)}
//                 >
//                   <TruckOutlined className="text-green-500 hover:text-green-700 text-lg" />
//                 </Button>
//                 <span>|</span>
//               </>
//             )}
//           {order.orderStatusId === 1 ? (
//             <p className="text-green-600 pl-3">PAID</p>
//           ) : order.orderStatusId === 2 ? (
//             <p className="text-red-600">CANCELLED</p>
//           ) : (
//             <p className="text-yellow-600">CASH PAYMENT</p>
//           )}
//         </div>
//       </div>

//       {order.orderDetailsGrouped.map((group) => (
//         <SellerGroup
//           group={group}
//           orderId={order.orderId}
//           key={`${order.orderId}-${group.sellerId}`}
//           onFeedbackClick={onFeedbackClick}
//           onWarrantyRequestClick={onWarrantyRequestClick}
//         />
//       ))}

//       <div className="flex justify-between items-center border-t pt-4">
//         <div className="flex items-center space-x-4">
//           <span className="font-medium">Shipping fee:</span>
//           <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="font-medium text-lg">Total:</span>
//           <span className="text-red-600 font-bold text-lg">
//             {order.totalPrice.toLocaleString("vi-VN")}₫
//           </span>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3 mt-6">
//         {order.orderDetailsGrouped.some(
//           (group) => group.orderItemStatus === 3
//         ) && (
//           <Button
//             className="bg-green-500 text-white rounded-md border border-green-500"
//             onClick={() =>
//               onReceivedClick(
//                 order.orderId,
//                 order.orderDetailsGrouped[0].sellerId
//               )
//             }
//           >
//             Received Order
//           </Button>
//         )}

//         {order.orderDetailsGrouped.some(
//           (group) => group.orderItemStatus === 1
//         ) && (
//           <Button
//             className="bg-red-500 text-white rounded-md border border-red-500"
//             onClick={() =>
//               onCancelClick(
//                 order.orderId,
//                 order.orderDetailsGrouped[0].sellerId
//               )
//             }
//           >
//             Cancel Order
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// OrderCard.propTypes = {
//   order: PropTypes.shape({
//     orderId: PropTypes.number.isRequired,
//     applicationSerialNumber: PropTypes.string.isRequired,
//     createDate: PropTypes.string.isRequired,
//     orderStatusId: PropTypes.string.isRequired,
//     shippingFee: PropTypes.number.isRequired,
//     totalPrice: PropTypes.number.isRequired,
//     orderDetailsGrouped: PropTypes.arrayOf(
//       PropTypes.shape({
//         sellerId: PropTypes.number.isRequired,
//         sellerName: PropTypes.string.isRequired,
//         orderItemStatus: PropTypes.number.isRequired,
//         trackingId: PropTypes.string,
//         items: PropTypes.arrayOf(
//           PropTypes.shape({
//             orderItemId: PropTypes.number.isRequired,
//             imageUrl: PropTypes.string.isRequired,
//             nameProduct: PropTypes.string.isRequired,
//             quantity: PropTypes.number.isRequired,
//             price: PropTypes.number.isRequired,
//           })
//         ).isRequired,
//       })
//     ).isRequired,
//   }).isRequired,
//   onFeedbackClick: PropTypes.func.isRequired,
//   onReceivedClick: PropTypes.func.isRequired,
//   onTrackClick: PropTypes.func.isRequired,
//   onCancelClick: PropTypes.func.isRequired,
//   onWarrantyRequestClick: PropTypes.func.isRequired,
// };

// export default function HistoryOrder() {
//   const dispatch = useDispatch();
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedSellerGroup, setSelectedSellerGroup] = useState(null);
//   const [trackingInfo, setTrackingInfo] = useState(null);
//   const [cancelOrderInfo, setCancelOrderInfo] = useState({
//     orderId: null,
//     sellerId: null,
//     visible: false,
//     formData: {
//       contactNumber: "",
//       accountName: "",
//       accountNumber: "",
//       bankName: "",
//     },
//     touched: {
//       contactNumber: false,
//       accountName: false,
//       accountNumber: false,
//       bankName: false,
//     },
//   });
//   const [warrantyModal, setWarrantyModal] = useState({
//     visible: false,
//     orderItemId: null,
//   });
//   const { historyOrders, pageIndex, pageSize, loading } = useSelector(
//     (state) => state.orders
//   );

//   // Hàm xử lý khi nhấn nút "Warranty Request"
//   const handleWarrantyRequestClick = (orderItemId) => {
//     setWarrantyModal({ visible: true, orderItemId });
//   };

//   // Hàm đóng modal bảo hành
//   const handleCloseWarrantyModal = () => {
//     setWarrantyModal({ visible: false, orderItemId: null });
//   };

//   // handle...............
//   const handleCancelClick = (orderId, sellerId) => {
//     setCancelOrderInfo({
//       orderId,
//       sellerId,
//       visible: true,
//       formData: {
//         contactNumber: "",
//         accountName: "",
//         accountNumber: "",
//         bankName: "",
//       },
//     });
//   };

//   const handleCancelOrder = async () => {
//     // Đánh dấu tất cả các trường là đã chạm vào
//     setCancelOrderInfo((prev) => ({
//       ...prev,
//       touched: {
//         contactNumber: true,
//         accountName: true,
//         accountNumber: true,
//         bankName: true,
//       },
//     }));

//     // Kiểm tra các trường bắt buộc
//     const { contactNumber, accountName, accountNumber, bankName } =
//       cancelOrderInfo.formData;

//     if (!contactNumber || !accountName || !accountNumber || !bankName) {
//       message.error("Please fill in all required fields");
//       return;
//     }

//     try {
//       const { orderId, sellerId, formData } = cancelOrderInfo;
//       await dispatch(
//         changeCancelledStatus({
//           orderId,
//           sellerId,
//           ...formData,
//         })
//       ).unwrap();
//       setCancelOrderInfo({
//         ...cancelOrderInfo,
//         visible: false,
//         touched: {
//           contactNumber: false,
//           accountName: false,
//           accountNumber: false,
//           bankName: false,
//         },
//       });
//       fetchOrders();
//     } catch (error) {
//       console.error("Cancel order error:", error);
//     }
//   };

//   const handleCancelFormChange = (e) => {
//     const { name, value } = e.target;
//     setCancelOrderInfo({
//       ...cancelOrderInfo,
//       formData: {
//         ...cancelOrderInfo.formData,
//         [name]: value,
//       },
//     });
//   };
//   const showConfirmModal = (title, content, onConfirm) => {
//     Modal.confirm({
//       title,
//       content,
//       okText: "Yes, Confirm",
//       cancelText: "Cancel",
//       onOk: onConfirm,
//     });
//   };

//   const handleTabChange = (key) => {
//     setStatusFilter(key === "0" ? "" : key);
//   };

//   const handleChangeToFeedback = async (orderId, sellerId) => {
//     showConfirmModal(
//       "Confirm Received Order",
//       "Are you sure you have received this order?",
//       async () => {
//         await dispatch(changeFeedbackStatus({ orderId, sellerId })).unwrap();
//         dispatch(
//           fetchHistoryOrder({ pageIndex, pageSize, StatusFilter: statusFilter })
//         );
//       }
//     );
//   };

//   const fetchOrders = () => {
//     dispatch(
//       fetchHistoryOrder({ pageIndex, pageSize, StatusFilter: statusFilter })
//     );
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [dispatch, pageIndex, pageSize, statusFilter]);

//   const handleFeedbackClick = (group) => {
//     setSelectedSellerGroup(group);
//   };

//   const handleCloseFeedback = () => {
//     setSelectedSellerGroup(null);
//   };

//   const handleTrackClick = async (trackingId) => {
//     try {
//       const result = await dispatch(getTrackingGhtk({ trackingId })).unwrap();
//       setTrackingInfo(result);
//     } catch (error) {
//       console.error("Failed to fetch tracking info:", error);
//     }
//   };

//   const handleCloseTrackingModal = () => {
//     setTrackingInfo(null);
//   };
//   // ui..........
//   return (
//     <div className="mx-auto  p-8 bg-background min-h-screen container">
//       <div className="max-w-6xl mb-4">
//         <BreadcrumbNav
//           items={[{ label: "Home", path: "/" }, { label: "Order History" }]}
//         />
//       </div>

//       <div className="mx-auto">
//         <Card
//           className="shadow-sm rounded-lg border-0 overflow-hidden"
//           bodyStyle={{ padding: 0 }}
//         >
//           <div className="px-6 py-4 border-b border-gray-200">
//             <Title level={4} className="mb-0 text-gray-800">
//               Order History
//             </Title>
//           </div>

//           <Tabs
//             defaultActiveKey="0"
//             onChange={handleTabChange}
//             tabPosition="top"
//             className="px-6 pt-2"
//             tabBarStyle={{ marginBottom: 0 }}
//           >
//             {Object.entries(statusConfig).map(([key, config]) => (
//               <TabPane
//                 key={key}
//                 tab={
//                   <div className="flex items-center px-3 py-2">
//                     <span className="mr-2">{config.icon}</span>
//                     <span>{config.tabName}</span>
//                     {historyOrders.totalCount > 0 &&
//                       key === (statusFilter || "0") && (
//                         <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
//                           {historyOrders.totalCount}
//                         </span>
//                       )}
//                   </div>
//                 }
//               >
//                 <div className="py-4">
//                   {loading ? (
//                     <div className="text-center py-8">
//                       <Spin size="large" />
//                     </div>
//                   ) : historyOrders.dataHistoryOrder?.length > 0 ? (
//                     historyOrders.dataHistoryOrder.map((order) => (
//                       <OrderCard
//                         order={order}
//                         key={order.orderId}
//                         onFeedbackClick={handleFeedbackClick}
//                         onReceivedClick={handleChangeToFeedback}
//                         onTrackClick={handleTrackClick}
//                         onCancelClick={handleCancelClick}
//                         onWarrantyRequestClick={handleWarrantyRequestClick}
//                       />
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       There are no orders in this category.
//                     </div>
//                   )}
//                 </div>
//               </TabPane>
//             ))}
//           </Tabs>
//         </Card>
//       </div>
//       {selectedSellerGroup && (
//         <FeedbackForm
//           visible={!!selectedSellerGroup}
//           onClose={handleCloseFeedback}
//           sellerGroup={selectedSellerGroup}
//           fetchHistoryOrder={fetchOrders}
//         />
//       )}
//       {trackingInfo && (
//         <Modal
//           title={
//             <div className="flex items-center space-x-3">
//               <img
//                 src="/public/images/Logo-GHTK.png"
//                 alt="GHTK Logo"
//                 className="w-[50%] object-contain"
//                 onError={(e) =>
//                   (e.target.src =
//                     "https://img.upanh.tv/2025/03/31/Logo-GHTK-1024x346.png")
//                 }
//               />
//             </div>
//           }
//           visible={!!trackingInfo}
//           onCancel={handleCloseTrackingModal}
//           zIndex={1111}
//           footer={[
//             <Button key="close" onClick={handleCloseTrackingModal}>
//               Close
//             </Button>,
//           ]}
//         >
//           <div className="space-y-2 text-gray-700">
//             {[
//               { label: "Tracking ID:", value: trackingInfo.labelId },
//               { label: "Status:", value: trackingInfo.statusText },
//               { label: "Created Date:", value: trackingInfo.created },
//               { label: "Estimated Delivery:", value: trackingInfo.deliverDate },
//               { label: "Customer Name:", value: trackingInfo.customerFullname },
//               { label: "Phone Number:", value: trackingInfo.customerTel },
//               { label: "Address:", value: trackingInfo.address },
//             ].map((item, index) => (
//               <div key={index} className="flex justify-between">
//                 <span className="font-semibold">{item.label}</span>
//                 <span className="text-right">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </Modal>
//       )}
//       <Modal
//         title={
//           <div className="flex items-center">
//             <span className="text-lg font-medium">Cancel Order and Refund</span>
//           </div>
//         }
//         visible={cancelOrderInfo.visible}
//         onOk={handleCancelOrder}
//         onCancel={() =>
//           setCancelOrderInfo({ ...cancelOrderInfo, visible: false })
//         }
//         okText="Confirm Cancel"
//         cancelText="Close"
//         okButtonProps={{ danger: true }}
//         width={600}
//       >
//         <div className="space-y-4">
//           {/* Warning box */}
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
//             <div className="flex items-start">
//               <ExclamationCircleOutlined className="text-yellow-500 text-lg mr-2 mt-0.5" />
//               <div>
//                 <p className="text-yellow-800 font-medium">Important Notice</p>
//                 <p className="text-yellow-700">
//                   Please carefully verify your bank account information before
//                   submitting. Refunds will be processed to this account.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Form fields */}
//           <div className="space-y-4">
//             {/* Contact Number */}
//             <div className="flex items-start">
//               <div className="flex-1">
//                 <div className="flex items-center mb-1">
//                   <PhoneOutlined className="text-gray-500 mr-2" />
//                   <label className="block text-gray-700">
//                     Contact Number <span className="text-red-500">*</span>
//                   </label>
//                 </div>
//                 <input
//                   type="text"
//                   name="contactNumber"
//                   value={cancelOrderInfo.formData.contactNumber}
//                   onChange={handleCancelFormChange}
//                   className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                     !cancelOrderInfo.formData.contactNumber &&
//                     cancelOrderInfo.touched?.contactNumber
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Your phone number"
//                   onBlur={() =>
//                     setCancelOrderInfo((prev) => ({
//                       ...prev,
//                       touched: { ...prev.touched, contactNumber: true },
//                     }))
//                   }
//                 />
//                 {!cancelOrderInfo.formData.contactNumber &&
//                   cancelOrderInfo.touched?.contactNumber && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center">
//                       <ExclamationCircleOutlined className="mr-1" />
//                       Please enter your contact number
//                     </p>
//                   )}
//               </div>
//             </div>

//             {/* Account Name */}
//             <div className="flex items-start">
//               <div className="flex-1">
//                 <div className="flex items-center mb-1">
//                   <UserOutlined className="text-gray-500 mr-2" />
//                   <label className="block text-gray-700">
//                     Account Name <span className="text-red-500">*</span>
//                   </label>
//                 </div>
//                 <input
//                   type="text"
//                   name="accountName"
//                   value={cancelOrderInfo.formData.accountName}
//                   onChange={handleCancelFormChange}
//                   className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                     !cancelOrderInfo.formData.accountName &&
//                     cancelOrderInfo.touched?.accountName
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Account holder name"
//                   onBlur={() =>
//                     setCancelOrderInfo((prev) => ({
//                       ...prev,
//                       touched: { ...prev.touched, accountName: true },
//                     }))
//                   }
//                 />
//                 {!cancelOrderInfo.formData.accountName &&
//                   cancelOrderInfo.touched?.accountName && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center">
//                       <ExclamationCircleOutlined className="mr-1" />
//                       Please enter account name
//                     </p>
//                   )}
//               </div>
//             </div>

//             {/* Account Number */}
//             <div className="flex items-start">
//               <div className="flex-1">
//                 <div className="flex items-center mb-1">
//                   <CreditCardOutlined className="text-gray-500 mr-2" />
//                   <label className="block text-gray-700">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                 </div>
//                 <input
//                   type="text"
//                   name="accountNumber"
//                   value={cancelOrderInfo.formData.accountNumber}
//                   onChange={handleCancelFormChange}
//                   className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                     !cancelOrderInfo.formData.accountNumber &&
//                     cancelOrderInfo.touched?.accountNumber
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Bank account number"
//                   onBlur={() =>
//                     setCancelOrderInfo((prev) => ({
//                       ...prev,
//                       touched: { ...prev.touched, accountNumber: true },
//                     }))
//                   }
//                 />
//                 {!cancelOrderInfo.formData.accountNumber &&
//                   cancelOrderInfo.touched?.accountNumber && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center">
//                       <ExclamationCircleOutlined className="mr-1" />
//                       Please enter account number
//                     </p>
//                   )}
//               </div>
//             </div>

//             {/* Bank Name */}
//             <div className="flex items-start">
//               <div className="flex-1">
//                 <div className="flex items-center mb-1">
//                   <BankOutlined className="text-gray-500 mr-2" />
//                   <label className="block text-gray-700">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                 </div>
//                 <input
//                   type="text"
//                   name="bankName"
//                   value={cancelOrderInfo.formData.bankName}
//                   onChange={handleCancelFormChange}
//                   className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
//                     !cancelOrderInfo.formData.bankName &&
//                     cancelOrderInfo.touched?.bankName
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Bank name"
//                   onBlur={() =>
//                     setCancelOrderInfo((prev) => ({
//                       ...prev,
//                       touched: { ...prev.touched, bankName: true },
//                     }))
//                   }
//                 />
//                 {!cancelOrderInfo.formData.bankName &&
//                   cancelOrderInfo.touched?.bankName && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center">
//                       <ExclamationCircleOutlined className="mr-1" />
//                       Please enter bank name
//                     </p>
//                   )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>

//       <WarrantyRequestModal
//         visible={warrantyModal.visible}
//         orderItemId={warrantyModal.orderItemId}
//         onClose={handleCloseWarrantyModal}
//         fetchOrders={fetchOrders}
//       />
//     </div>
//   );
// }
