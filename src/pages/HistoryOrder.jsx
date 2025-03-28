import { Button, Typography, Card, Tabs } from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageOutlined,
  ShopOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Text, Title } = Typography;
const { TabPane } = Tabs;
dayjs.locale("vi");

const mockData = [
  {
    orderId: 300,
    applicationSerialNumber: "OD12020250325183646",
    totalPrice: 175000,
    address: "quảng ngãi",
    contactNumber: "0867603194",
    notes: "",
    createDate: "2025-03-25T18:36:46.3262076",
    updatedDate: "2025-03-25T18:36:46.3261952",
    orderStatusId: 1,
    shippingFee: 0,
    orderDetailsGrouped: [
      {
        sellerId: 75,
        sellerName: "chu ba duy",
        sellerRole: 6,
        sellerRoleName: "Store",
        trackingId: "1150027441",
        orderItemStatus: 1,
        totalAmount: 175000,
        items: [
          {
            orderItemId: 206,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2Fcfda188b-3fd2-4bd0-834d-920821e31cd2.png.png?alt=media&token=4fafd47b-c29e-444b-89dc-e50efa0602e7",
            productId: 33,
            nameProduct: "tetst2",
            productType: 1,
            quantity: 1,
            price: 175000,
            warrantyEndDate: null,
            orderItemStatus: 1,
          },
        ],
      },
    ],
  },
  {
    orderId: 299,
    applicationSerialNumber: "OD12020250325182726",
    totalPrice: 175000,
    address: "hcm",
    contactNumber: "0867603192",
    notes: "string",
    createDate: "2025-03-25T18:27:26.4361151",
    updatedDate: "2025-03-25T18:27:26.4360351",
    orderStatusId: 2,
    shippingFee: 0,
    orderDetailsGrouped: [
      {
        sellerId: 75,
        sellerName: "chu ba duy",
        sellerRole: 6,
        sellerRoleName: "Store",
        trackingId: "1050028151",
        orderItemStatus: 1,
        totalAmount: 175000,
        items: [
          {
            orderItemId: 205,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2Fcfda188b-3fd2-4bd0-834d-920821e31cd2.png.png?alt=media&token=4fafd47b-c29e-444b-89dc-e50efa0602e7",
            productId: 33,
            nameProduct: "tetst2",
            productType: 1,
            quantity: 1,
            price: 175000,
            warrantyEndDate: null,
            orderItemStatus: 1,
          },
        ],
      },
    ],
  },
  {
    orderId: 298,
    applicationSerialNumber: "OD12020250325180030",
    totalPrice: 3050500,
    address: "quảng ngãi",
    contactNumber: "0867603194",
    notes: "",
    createDate: "2025-03-25T18:00:30.4665429",
    updatedDate: "2025-03-25T18:00:30.4664584",
    orderStatusId: 1,
    shippingFee: 2175500,
    orderDetailsGrouped: [
      {
        sellerId: 75,
        sellerName: "chu ba duy",
        sellerRole: 6,
        sellerRoleName: "Store",
        trackingId: "1150027439",
        orderItemStatus: 1,
        totalAmount: 175000,
        items: [
          {
            orderItemId: 204,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2F14af80c7-5555-4187-8880-9136ade953a4.png.png?alt=media&token=b9ef5e90-8d28-425e-a2d4-20754b0efe3f",
            productId: 34,
            nameProduct: "tetst3",
            productType: 1,
            quantity: 5,
            price: 175000,
            warrantyEndDate: null,
            orderItemStatus: 1,
          },
          {
            orderItemId: 205,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2F14af80c7-5555-4187-8880-9136ade953a4.png.png?alt=media&token=b9ef5e90-8d28-425e-a2d4-20754b0efe3f",
            productId: 34,
            nameProduct: "tetst4",
            productType: 1,
            quantity: 5,
            price: 156000,
            warrantyEndDate: null,
            orderItemStatus: 1,
          },
        ],
      },
      {
        sellerId: 75,
        sellerName: "a vu map",
        sellerRole: 6,
        sellerRoleName: "Store",
        trackingId: "1150027439",
        orderItemStatus: 2,
        totalAmount: 175000,
        items: [
          {
            orderItemId: 234,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2F14af80c7-5555-4187-8880-9136ade953a4.png.png?alt=media&token=b9ef5e90-8d28-425e-a2d4-20754b0efe3f",
            productId: 34,
            nameProduct: "tetst3",
            productType: 1,
            quantity: 5,
            price: 175000,
            warrantyEndDate: null,
            orderItemStatus: 1,
          },
        ],
      },
    ],
  },
];

// Config trạng thái
const statusConfig = {
  0: {
    text: "All order",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📋",
    tabName: "All order",
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
    text: "Delevering",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚",
    tabName: "Delevering",
  },
  // 4: {
  //   text: "Delevered",
  //   color: "bg-green-100 text-green-800 border-green-200",
  //   icon: "✅",
  //   tabName: "Delevered",
  // },
  5: {
    text: "Pending to feeback",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "⭐",
    tabName: "Pending to feeback",
  },
  6: {
    text: "Success order",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🏆",
    tabName: "Success order",
  },
  7: {
    text: "Cancle",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "↩️",
    tabName: "Cancle",
  },
};

const getStatusTag = (statusId) => {
  const config = statusConfig[statusId] || {
    text: "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "❓",
  };
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm border ${config.color}`}
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
  <div
    className="flex justify-between items-center border-b py-3"
    key={item.orderItemId}
  >
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
        <p className="text-gray-600">Số lượng: {item.quantity}</p>
      </div>
    </div>
    <p className="text-red-500 font-medium">
      {item.price.toLocaleString("vi-VN")}₫
    </p>
  </div>
);

const SellerGroup = ({ group }) => (
  <div className="bg-blue-50 rounded-md mb-4" key={group.sellerId}>
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <div className="flex items-center space-x-3">
        <p className="font-bold text-md">{group.sellerName}</p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-sm hover:bg-white hover:text-blue-500 transition-colors text-xs">
            <MessageOutlined className="mr-2" />
            Chat Now
          </button>
          <Link to={`/shop-infomation/${group.sellerId}`}>
            <button className="px-3 py-1 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 transition-colors text-xs">
              <ShopOutlined className="mr-2" />
              View Shop
            </button>
          </Link>
          {getStatusTag(group.orderStatusId)}
        </div>
      </div>
    </div>

    {group.items.map((item) => (
      <OrderItem item={item} key={item.orderItemId} />
    ))}

    {/* <div className="flex justify-end mt-3">
      <div className="flex items-center space-x-4">
        <span className="font-medium">Tổng cửa hàng:</span>
        <span className="text-red-600 font-semibold">
          {group.totalAmount.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div> */}
  </div>
);

const OrderCard = ({ order }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-600">Mã đơn hàng:</span>
          <span className="font-bold">{order.applicationSerialNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Ngày tạo:</span>
          <span className="font-medium">{formatDate(order.createDate)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        {getStatusTag(order.orderStatusId)}
        <button className="text-blue-500 flex items-center mt-2">
          <span className="mr-1">Xem thêm</span>
          <ArrowDownOutlined />
        </button>
      </div>
    </div>

    {order.orderDetailsGrouped.map((group) => (
      <SellerGroup group={group} key={`${order.orderId}-${group.sellerId}`} />
    ))}

    <div className="flex justify-between items-center border-t pt-4">
      <div className="flex items-center space-x-4">
        <span className="font-medium">Phí vận chuyển:</span>
        <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium text-lg">Tổng cộng:</span>
        <span className="text-red-600 font-bold text-lg">
          {order.totalPrice.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>

    <div className="flex justify-end space-x-3 mt-6">
      <Button type="primary" className="bg-blue-500">
        Xem chi tiết
      </Button>
      <Button danger>Hủy đơn</Button>
    </div>
  </div>
);

export default function HistoryOrder() {
  const navigate = useNavigate();

  // Phân loại dữ liệu theo trạng thái
  const dataByStatus = { 0: [...mockData] }; // Mục "All order" chứa tất cả đơn
  mockData.forEach((order) => {
    const status = order.orderStatusId;
    if (!dataByStatus[status]) dataByStatus[status] = [];
    dataByStatus[status].push(order);
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card
          className="shadow-sm rounded-lg border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <Title level={4} className="mb-0 text-gray-800">
              Lịch sử đơn hàng
            </Title>
          </div>

          <Tabs
            defaultActiveKey="0"
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
                    {dataByStatus[key]?.length > 0 && (
                      <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                        {dataByStatus[key]?.length || 0}
                      </span>
                    )}
                  </div>
                }
              >
                <div className="py-4">
                  {dataByStatus[key]?.length > 0 ? (
                    dataByStatus[key].map((order) => (
                      <OrderCard order={order} key={order.orderId} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có đơn hàng nào trong mục này
                    </div>
                  )}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
