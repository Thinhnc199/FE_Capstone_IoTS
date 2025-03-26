import { Table, Button, Typography, Tag, Image, Card, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Text, Title } = Typography;
const { TabPane } = Tabs;
dayjs.locale("vi");

// Giữ nguyên toàn bộ dữ liệu mẫu của em
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
    orderStatusId: 1,
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
        ],
      },
    ],
  },
];

// Config trạng thái theo TypeStatusOrder
const statusConfig = {
  1: {
    text: "Chờ xử lý",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳",
    tabName: "Chờ xử lý",
  },
  2: {
    text: "Đang đóng gói",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📦",
    tabName: "Đóng gói",
  },
  3: {
    text: "Đang giao",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚",
    tabName: "Vận chuyển",
  },
  4: {
    text: "Đã giao",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
    tabName: "Đã giao",
  },
  5: {
    text: "Đã đánh giá",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "⭐",
    tabName: "Đánh giá",
  },
  6: {
    text: "Hoàn thành",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🏆",
    tabName: "Hoàn thành",
  },
  7: {
    text: "Hoàn trả",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "↩️",
    tabName: "Hoàn trả",
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </div>
  );
};

export default function ManageHistoryOrder() {
  const navigate = useNavigate();

  const columns = [
    {
      title: <span className="text-gray-700 font-medium">MÃ ĐƠN</span>,
      dataIndex: "applicationSerialNumber",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">#{text}</span>
          <span className="text-gray-500 text-xs">
            {dayjs(record.createDate).format("HH:mm DD/MM/YYYY")}
          </span>
        </div>
      ),
      width: 150,
    },
    {
      title: <span className="text-gray-700 font-medium">SẢN PHẨM</span>,
      dataIndex: "orderDetailsGrouped",
      render: (groups) => (
        <div className="flex flex-wrap gap-2">
          {groups[0].items.map((item, index) => (
            <div key={index} className="relative">
              <Image
                src={item.imageUrl}
                width={48}
                height={48}
                className="rounded-lg border border-gray-200 object-cover shadow-sm"
                preview={false}
                alt={item.nameProduct}
              />
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: <span className="text-gray-700 font-medium">TỔNG TIỀN</span>,
      dataIndex: "totalPrice",
      render: (price) => (
        <span className="font-bold text-orange-600 whitespace-nowrap">
          {new Intl.NumberFormat("vi-VN").format(price)}đ
        </span>
      ),
      align: "right",
      width: 120,
    },
    {
      title: <span className="text-gray-700 font-medium">TRẠNG THÁI</span>,
      dataIndex: "orderStatusId",
      render: getStatusTag,
      width: 180,
    },
    {
      title: <span className="text-gray-700 font-medium">THAO TÁC</span>,
      render: (_, record) => (
        <Button
          onClick={() => navigate(`/history-order/${record.orderId}`)}
          className="text-blue-600 hover:text-blue-800 font-medium px-0"
          type="text"
        >
          Xem chi tiết →
        </Button>
      ),
      width: 120,
    },
  ];

  // Phân loại dữ liệu theo trạng thái
  const dataByStatus = mockData.reduce((acc, order) => {
    const status = order.orderStatusId;
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card
          className="shadow-sm rounded-lg border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          {/* Header với title và filter (nếu cần) */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <Title level={4} className="mb-0 text-gray-800">
              Lịch sử đơn hàng
            </Title>
          </div>

          {/* Tabs lọc theo trạng thái */}
          <Tabs
            defaultActiveKey="1"
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
                <Table
                  columns={columns}
                  dataSource={dataByStatus[key] || []}
                  rowKey="orderId"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    className: "px-6 py-3",
                  }}
                  className="custom-order-table"
                  rowClassName="hover:bg-blue-50 transition-colors"
                  locale={{
                    emptyText: (
                      <div className="py-12 text-center">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                          width={100}
                          preview={false}
                          className="opacity-50 mx-auto"
                        />
                        <p className="mt-4 text-gray-500">
                          Không có đơn hàng nào
                        </p>
                      </div>
                    ),
                  }}
                />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>

      {/* Custom style để override Ant Design */}
      <style jsx global>{`
        .custom-order-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 12px 16px !important;
        }
        .custom-order-table .ant-table-tbody > tr > td {
          padding: 16px !important;
          vertical-align: middle !important;
          border-bottom: 1px solid #edf2f7 !important;
        }
        .ant-tabs-tab {
          padding: 12px 0 !important;
          margin: 0 16px 0 0 !important;
        }
        .ant-tabs-tab-active {
          border-bottom: 2px solid #3b82f6 !important;
        }
        .ant-tabs-ink-bar {
          background: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}
