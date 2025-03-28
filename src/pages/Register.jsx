// import { Link } from "react-router-dom";
// import AuthenticationLayout from "../layouts/AuthenticationLayout";
// const Register = () => {
//   return (
//     <AuthenticationLayout>
//       <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
//         <div className="max-w-md w-full">
//           <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
//             Create an Account
//           </h2>
//           <form>
//             <input
//               type="text"
//               placeholder="Name"
//               className="w-full p-3 mb-4 border rounded"
//             />
//             <input
//               type="email"
//               placeholder="Email or Phone Number"
//               className="w-full p-3 mb-4 border rounded"
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 mb-4 border rounded"
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
//             >
//               Create Account
//             </button>
//             <button
//               type="button"
//               className="w-full border border-black text-gray-600 py-3 mt-2 rounded hover:bg-gray-100 flex items-center justify-center"
//             >
//               <img
//                 src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB&psig=AOvVaw3FcWugC_mhXWCYG5kjy2pI&ust=1736118487265000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLDRhLeX3YoDFQAAAAAdAAAAABAE"
//                 alt="Google Logo"
//                 className="w-5 h-5 mr-2"
//               />
//               Sign up with Google
//             </button>
//           </form>
//           <p className="text-center mt-4 text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-[#007AFF] hover:underline">
//               Log In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </AuthenticationLayout>
//   );
// };

// export default Register;


import { Typography, Card, Tabs, Spin, Button } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoryOrder } from "../redux/slices/orderSlice";
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import FeedbackForm from "./Orders/FeedbackForm";

const { Title } = Typography;
const { TabPane } = Tabs;
dayjs.locale("vi");

// Status configuration
const statusConfig = {
  0: {
    text: "All orders",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📋",
    tabName: "All orders",
  },
  1: {
    text: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳",
    tabName: "Pending",
  },
  2: {
    text: "Packing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📦",
    tabName: "Packing",
  },
  3: {
    text: "Delivering",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚",
    tabName: "Delivering",
  },
  5: {
    text: "Pending to feedback",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "⭐",
    tabName: "Pending to feedback",
  },
  6: {
    text: "Success order",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🏆",
    tabName: "Success order",
  },
  7: {
    text: "Cancel",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "↩️",
    tabName: "Cancel",
  },
};

const getStatusTag = (statusId) => {
  const config = statusConfig[statusId] || {
    text: "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "",
  };
  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-sm text-xs border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </div>
  );
};

const formatDate = (dateString) => {
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
};

const OrderItem = ({ item }) => (
  <div className="flex justify-between items-center border-b p-3 bg-blue-50 rounded-md">
    <div className="flex items-center">
      <img
        src={item.imageUrl}
        alt={item.nameProduct}
        width={80}
        height={80}
        className="rounded-sm object-cover"
      />
      <div className="ml-4">
        <p className="font-medium">{item.nameProduct}</p>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
      </div>
    </div>
    <p className="text-red-500 font-medium">
      {item.price.toLocaleString("vi-VN")}₫
    </p>
  </div>
);

OrderItem.propTypes = {
  item: PropTypes.shape({
    orderItemId: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    nameProduct: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

const SellerGroup = ({ group }) => (
  <div className="rounded-md mb-4">
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <div className="flex items-center space-x-3">
        <p className="font-bold text-md">{group.sellerName}</p>
        <div className="flex space-x-2">
          <button className="px-1 py-1 border border-blue-500 bg-blue-500 text-white rounded-sm hover:bg-white hover:text-blue-500 transition-colors text-xs">
            <MessageOutlined className="mr-2" />
            Chat Now
          </button>
          <Link to={`/shop-infomation/${group.sellerId}`}>
            <button className="px-1 py-1 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 transition-colors text-xs">
              <ShopOutlined className="mr-2" />
              View Shop
            </button>
          </Link>
        </div>
      </div>
      <div>{getStatusTag(group.orderItemStatus)}</div>
    </div>

    {group.items.map((item) => (
      <OrderItem item={item} key={item.orderItemId} />
    ))}
  </div>
);

SellerGroup.propTypes = {
  group: PropTypes.shape({
    sellerId: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    orderItemStatus: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        orderItemId: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        nameProduct: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const OrderCard = ({ order, onFeedbackClick }) => (
  <div className="p-6 rounded-lg shadow-md mb-6 border border-gray-200 bg-white">
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-600">Order code:</span>
          <span className="font-bold">{order.applicationSerialNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Create date:</span>
          <span className="font-medium">{formatDate(order.createDate)}</span>
        </div>
      </div>
    </div>

    {order.orderDetailsGrouped.map((group) => (
      <SellerGroup group={group} key={`${order.orderId}-${group.sellerId}`} />
    ))}

    <div className="flex justify-between items-center border-t pt-4">
      <div className="flex items-center space-x-4">
        <span className="font-medium">Shipping fee:</span>
        <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium text-lg">Total:</span>
        <span className="text-red-600 font-bold text-lg">
          {order.totalPrice.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>

    <div className="flex justify-end space-x-3 mt-6">
      {order.orderDetailsGrouped.some((group) => group.orderItemStatus === 5) && (
        <Button
          className="bg-blue-500 text-white rounded-md border border-blue-500"
          onClick={() => onFeedbackClick(order)}
        >
          Feedback
        </Button>
      )}
      <Button className="bg-red-500 text-white rounded-md border border-red-500">
        Cancel order
      </Button>
    </div>
  </div>
);

OrderCard.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    applicationSerialNumber: PropTypes.string.isRequired,
    createDate: PropTypes.string.isRequired,
    shippingFee: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    orderDetailsGrouped: PropTypes.arrayOf(
      PropTypes.shape({
        sellerId: PropTypes.number.isRequired,
        sellerName: PropTypes.string.isRequired,
        orderItemStatus: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            orderItemId: PropTypes.number.isRequired,
            imageUrl: PropTypes.string.isRequired,
            nameProduct: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  onFeedbackClick: PropTypes.func.isRequired,
};

export default function HistoryOrder() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { historyOrders, pageIndex, pageSize, loading } = useSelector(
    (state) => state.orders
  );

  const handleTabChange = (key) => {
    setStatusFilter(key === "0" ? "" : key);
  };

  const fetchOrders = () => {
    dispatch(
      fetchHistoryOrder({
        pageIndex,
        pageSize,
        StatusFilter: statusFilter,
      })
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch, pageIndex, pageSize, statusFilter, ]);
  // useEffect(() => {
  //   dispatch(
  //     fetchHistoryOrder({
  //       pageIndex,
  //       pageSize,
  //       StatusFilter: statusFilter,
  //     })
  //   );
  // }, [dispatch, pageIndex, pageSize, statusFilter]);

  const handleFeedbackClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseFeedback = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <Card
          className="shadow-sm rounded-lg border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <Title level={4} className="mb-0 text-gray-800">
              Order History
            </Title>
          </div>

          <Tabs
            defaultActiveKey="0"
            onChange={handleTabChange}
            tabPosition="top"
            className="px-6 pt-2"
            tabBarStyle={{ marginBottom: 0 }}
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <TabPane
                key={key}
                tab={
                  <div className="flex items-center px-3 py-2">
                    <span className="mr-2">{config.icon}</span>
                    <span>{config.tabName}</span>
                  </div>
                }
              >
                <div className="py-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                    </div>
                  ) : historyOrders.dataHistoryOrder?.length > 0 ? (
                    historyOrders.dataHistoryOrder.map((order) => (
                      <OrderCard order={order} key={order.orderId} onFeedbackClick={handleFeedbackClick} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      There are no orders in this category.
                    </div>
                  )}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
      {selectedOrder && (
        <FeedbackForm
          visible={!!selectedOrder}
          onClose={handleCloseFeedback}
          order={selectedOrder}
          fetchHistoryOrder={fetchOrders}
        />
      )}
    </div>
  );
}
