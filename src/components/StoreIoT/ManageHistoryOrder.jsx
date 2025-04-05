import { Typography, Card, Tabs, Spin, Button, message, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TruckOutlined, EyeOutlined, RocketOutlined } from "@ant-design/icons";
import { getTrackingGhtk } from "../../redux/slices/orderSlice";
import BreadcrumbNav from "../common/BreadcrumbNav";

import {
  fetchHistoryOrderStoreTrainer,
  changePackingStatus,
  changeDeliveringStatus,
  changeSuccessOrderStatus,
  getPrintLabel,
  getPreviewPrintLabel,
} from "../../redux/slices/orderSlice";
import dayjs from "dayjs";
import "dayjs/locale/vi";

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
  8: {
    text: "Bad feedback",
    color: "bg-yellow-100 text-red-800 border-red-200",
    icon: "👎",
    tabName: "Bad feedback",
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

const OrderCard = ({
  order,
  onProceedToPacking,
  // onCreateShippingLabel,
  onPreviewShippingLabel,
  onUpdateToDelivering,
  onTrackClick,
  onSuccessOrder,
}) => {
  const trackingId = order.orderDetailsGrouped[0]?.trackingId;
  return (
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
        <div className="flex flex-col justify-center ">
          {" "}
          <div className="flex justify-end items-center">
            {order.orderDetailsGrouped.some(
              (group) => group.orderItemStatus === 3
            ) &&
              trackingId && (
                <>
                  {" "}
                  <Button
                    className=" border-none shadow-none flex items-center "
                    onClick={() => onTrackClick(trackingId)} // Gọi hàm theo dõi khi nhấn
                  >
                    <TruckOutlined className="text-green-500 hover:text-green-700 text-lg" />
                  </Button>
                  <span>|</span>
                </>
              )}

            {order.orderStatusId === 1 ? (
              <p className="text-green-600 pl-3">PAID</p>
            ) : order.orderStatusId === 2 ? (
              <p className="text-red-600">CANCELLED</p>
            ) : (
              <p className="text-yellow-600">CASH PAYMENT</p>
            )}
          </div>
          <div>
            {" "}
            {Array.isArray(order.orderDetailsGrouped) &&
              order.orderDetailsGrouped.length > 0 && (
                <div>
                  {getStatusTag(order.orderDetailsGrouped[0].orderItemStatus)}
                </div>
              )}
          </div>
        </div>
      </div>

      {order.orderDetailsGrouped.map((group) => (
        <SellerGroup group={group} key={`${order.orderId}-${group.sellerId}`} />
      ))}

      <div className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center space-x-4"></div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-lg">Total:</span>
          <span className="text-red-600 font-bold text-lg">
            {order.orderDetailsGrouped[0].totalAmount.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="flex justify-end space-x-3 mt-6">
        {order.orderDetailsGrouped[0].orderItemStatus === 1 && (
          <Button
            className="bg-blue-500 text-white rounded-md border border-blue-500"
            onClick={() => onProceedToPacking(order.orderId)}
          >
            Proceed to Packing
          </Button>
        )}

        {order.orderDetailsGrouped[0].orderItemStatus === 2 && (
          <>
            {/* <Button
              className="bg-green-500 text-white rounded-md border border-green-500"
              onClick={() =>
                onCreateShippingLabel(order.orderDetailsGrouped[0].trackingId)
              }
            >
              Create Shipping Label
            </Button> */}
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() =>
                onPreviewShippingLabel(order.orderDetailsGrouped[0].trackingId)
              }
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={() => onUpdateToDelivering(order.orderId)}
              className="bg-purple-500 text-white"
            >
              Deliver
            </Button>
          </>
        )}

        {order.orderDetailsGrouped[0].orderItemStatus === 5 && (
          <Button
            className="bg-green-500 text-white rounded-md border border-green-500"
            onClick={() => onSuccessOrder(order.orderId)}
          >
            Confirm Success Order
          </Button>
        )}
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    applicationSerialNumber: PropTypes.string.isRequired,
    createDate: PropTypes.string.isRequired,
    orderStatusId: PropTypes.string.isRequired,
    orderDetailsGrouped: PropTypes.arrayOf(
      PropTypes.shape({
        sellerId: PropTypes.number.isRequired,
        sellerName: PropTypes.string.isRequired,
        orderItemStatus: PropTypes.number.isRequired,
        totalAmount: PropTypes.number.isRequired,
        trackingId: PropTypes.number.isRequired,

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
  onProceedToPacking: PropTypes.func.isRequired,
  onCreateShippingLabel: PropTypes.func.isRequired,
  onUpdateToDelivering: PropTypes.func.isRequired,
  onUpdateToPendingFeedback: PropTypes.func.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  onSuccessOrder: PropTypes.func.isRequired,
  onPreviewShippingLabel: PropTypes.func.isRequired,
};
export default function ManageHistoryOrder() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const { historyOrdersStoreTrainer, pageIndex, pageSize, loading } =
    useSelector((state) => state.orders);
  const showConfirmModal = (title, content, onConfirm) => {
    Modal.confirm({
      title,
      content,
      okText: "Yes, Confirm",
      cancelText: "Cancel",
      onOk: onConfirm,
    });
  };
  const handleTabChange = (key) => {
    setStatusFilter(key === "0" ? "" : key);
  };

  useEffect(() => {
    dispatch(
      fetchHistoryOrderStoreTrainer({
        pageIndex,
        pageSize,
        StatusFilter: statusFilter,
      })
    );
  }, [dispatch, pageIndex, pageSize, statusFilter]);

  const handleProceedToPacking = async (orderId) => {
    showConfirmModal(
      "Confirm proceed to packing",
      "Are you sure you want to proceed to packing this order?",
      async () => {
        await dispatch(changePackingStatus({ orderId })).unwrap();
        dispatch(
          fetchHistoryOrderStoreTrainer({
            pageIndex,
            pageSize,
            StatusFilter: statusFilter,
          })
        );
      }
    );
  };

  const handleCreateShippingLabel = async (trackingId) => {
    try {
      const result = await dispatch(getPrintLabel({ trackingId })).unwrap();

      // Tạo URL tạm để download file
      const pdfUrl = window.URL.createObjectURL(new Blob([result.blob]));
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = result.filename; // Tên file khi tải về
      document.body.appendChild(link);
      link.click();
      link.remove(); // Dọn dẹp sau khi tải

      message.success("Shipping label downloaded!");
    } catch (error) {
      message.error("Error loading label: " + error);
    }
  };

  const handleUpdateToDelivering = async (orderId) => {
    showConfirmModal(
      "Confirm update to Delivering",
      "Are you sure you want to update this order to Delivering?",
      async () => {
        await dispatch(changeDeliveringStatus({ orderId }));
        dispatch(
          fetchHistoryOrderStoreTrainer({
            pageIndex,
            pageSize,
            StatusFilter: statusFilter,
          })
        );
      }
    );
  };

  const handlePreviewShippingLabel = async (trackingId) => {
    try {
      const result = await dispatch(
        getPreviewPrintLabel({ trackingId })
      ).unwrap();
      const pdfUrl = URL.createObjectURL(result.blob);

      Modal.info({
        title: "Shipping Label Preview",
        content: (
          <div style={{ height: "500px" }}>
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="PDF Preview"
              type="application/pdf"
              loading="lazy"
              onLoad={() => console.log("PDF loaded")}
            />
          </div>
        ),
        width: 800,
        okText: "Close",
        onOk: () => URL.revokeObjectURL(pdfUrl),
        afterClose: () => URL.revokeObjectURL(pdfUrl), // Đảm bảo giải phóng bộ nhớ
      });
    } catch (error) {
      message.error("Failed to preview label: " + error);
    }
  };
  const handleSuccessOrder = async (orderId) => {
    showConfirmModal(
      "Order Confirmation Successful",
      "Are you sure this order is complete?",
      async () => {
        await dispatch(changeSuccessOrderStatus({ orderId }));
        dispatch(
          fetchHistoryOrderStoreTrainer({
            pageIndex,
            pageSize,
            StatusFilter: statusFilter,
          })
        );
      }
    );
  };
  const handleTrackClick = async (trackingId) => {
    try {
      const result = await dispatch(getTrackingGhtk({ trackingId })).unwrap();
      setTrackingInfo(result); // Lưu thông tin tracking vào state
    } catch (error) {
      console.error("Failed to fetch tracking info:", error);
    }
  };
  const handleCloseTrackingModal = () => {
    setTrackingInfo(null); // Đóng popup bằng cách reset trackingInfo
  };
  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "store", path: "/store" },
            { label: "manage order" },
          ]}
        />
      </div>
      <div className=" bg-blue-50">
        <div className="max-w-auto ">
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
                      {historyOrdersStoreTrainer.totalCount > 0 &&
                        key === (statusFilter || "0") && (
                          <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                            {historyOrdersStoreTrainer.totalCount}
                          </span>
                        )}
                    </div>
                  }
                >
                  <div className="py-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <Spin size="large" />
                      </div>
                    ) : historyOrdersStoreTrainer.dataHistoryOrder?.length >
                      0 ? (
                      historyOrdersStoreTrainer.dataHistoryOrder.map(
                        (order) => (
                          <OrderCard
                            order={order}
                            key={order.orderId}
                            onProceedToPacking={handleProceedToPacking}
                            onCreateShippingLabel={handleCreateShippingLabel}
                            onUpdateToDelivering={handleUpdateToDelivering}
                            onSuccessOrder={handleSuccessOrder}
                            onTrackClick={handleTrackClick}
                            onPreviewShippingLabel={handlePreviewShippingLabel}
                          />
                        )
                      )
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

        {/* Popup hiển thị thông tin tracking */}
        {trackingInfo && (
          <Modal
            title={
              <div className="flex items-center space-x-3">
                <img
                  src="/public/images/Logo-GHTK.png"
                  alt="GHTK Logo"
                  className="w-[50%] object-contain"
                  onError={(e) =>
                    (e.target.src =
                      "https://img.upanh.tv/2025/03/31/Logo-GHTK-1024x346.png")
                  }
                />
              </div>
            }
            visible={!!trackingInfo}
            onCancel={handleCloseTrackingModal}
            zIndex={1111}
            footer={[
              <Button key="close" onClick={handleCloseTrackingModal}>
                Close
              </Button>,
            ]}
          >
            <div className="space-y-2 text-gray-700">
              {[
                { label: "Tracking ID:", value: trackingInfo.labelId },
                { label: "Status:", value: trackingInfo.statusText },
                { label: "Created Date:", value: trackingInfo.created },
                {
                  label: "Estimated Delivery:",
                  value: trackingInfo.deliverDate,
                },
                {
                  label: "Customer Name:",
                  value: trackingInfo.customerFullname,
                },
                { label: "Phone Number:", value: trackingInfo.customerTel },
                { label: "Address:", value: trackingInfo.address },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
