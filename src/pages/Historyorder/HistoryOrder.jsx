import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Spin, Modal, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import FeedbackForm from "../Orders/FeedbackForm";
import WarrantyRequestModal from "../Orders/WarrantyRequestModal";
import {
  OrderTabs,
  OrderCard,
  TrackingModal,
  CancelOrderModal,
} from "./components";

import {
  fetchHistoryOrder,
  changeFeedbackStatus,
  getTrackingGhtk,
  changeCancelledStatus,
  changeCancelledCashPayment,
} from "../../redux/slices/orderSlice";

const { Title } = Typography;
dayjs.locale("vi");

export default function HistoryOrders() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSellerGroup, setSelectedSellerGroup] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [cancelOrderInfo, setCancelOrderInfo] = useState({
    orderId: null,
    sellerId: null,
    visible: false,
    formData: {
      contactNumber: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
    touched: {
      contactNumber: false,
      accountName: false,
      accountNumber: false,
      bankName: false,
    },
  });
  const [warrantyModal, setWarrantyModal] = useState({
    visible: false,
    orderItemId: null,
  });

  const { historyOrders, loading } = useSelector((state) => state.orders);

  const handleTabChange = (key) => {
    setStatusFilter(key === "0" ? "" : key);
  };

  const fetchOrders = () => {
    dispatch(fetchHistoryOrder({ StatusFilter: statusFilter }));
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch, statusFilter]);

  const handleFeedbackClick = (group) => {
    setSelectedSellerGroup(group);
  };

  const handleCloseFeedback = () => {
    setSelectedSellerGroup(null);
  };

  const handleWarrantyRequestClick = (orderItemId) => {
    setWarrantyModal({ visible: true, orderItemId });
  };

  const handleCloseWarrantyModal = () => {
    setWarrantyModal({ visible: false, orderItemId: null });
  };

  const handleCancelClick = (orderId, sellerId) => {
    setCancelOrderInfo({
      orderId,
      sellerId,
      visible: true,
      formData: {
        contactNumber: "",
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      touched: {
        contactNumber: false,
        accountName: false,
        accountNumber: false,
        bankName: false,
      },
    });
  };

  const handleCancelOrder = async () => {
    // Mark all fields as touched
    setCancelOrderInfo((prev) => ({
      ...prev,
      touched: {
        contactNumber: true,
        accountName: true,
        accountNumber: true,
        bankName: true,
      },
    }));

    // Validate required fields
    const { contactNumber, accountName, accountNumber, bankName } =
      cancelOrderInfo.formData;

    if (!contactNumber || !accountName || !accountNumber || !bankName) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      const { orderId, sellerId, formData } = cancelOrderInfo;
      await dispatch(
        changeCancelledStatus({
          orderId,
          sellerId,
          ...formData,
        })
      ).unwrap();
      setCancelOrderInfo({
        ...cancelOrderInfo,
        visible: false,
      });
      fetchOrders();
    } catch (error) {
      console.error("Cancel order error:", error);
    }
  };

  const handleCancelCashPayment = async (orderId) => {
    Modal.confirm({
      title: "Cancle Order",
      content: "Are you sure you cancle this order?",
      okText: "Yes, Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await dispatch(changeCancelledCashPayment({ orderId })).unwrap();
        fetchOrders();
      },
    });
  };
  const handleCancelFormChange = (name, value) => {
    setCancelOrderInfo({
      ...cancelOrderInfo,
      formData: {
        ...cancelOrderInfo.formData,
        [name]: value,
      },
    });
  };

  const handleTrackClick = async (trackingId) => {
    try {
      const result = await dispatch(getTrackingGhtk({ trackingId })).unwrap();
      setTrackingInfo(result);
    } catch (error) {
      console.error("Failed to fetch tracking info:", error);
    }
  };

  const handleCloseTrackingModal = () => {
    setTrackingInfo(null);
  };

  const handleChangeToFeedback = async (orderId, sellerId) => {
    Modal.confirm({
      title: "Confirm Received Order",
      content: "Are you sure you have received this order?",
      okText: "Yes, Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await dispatch(changeFeedbackStatus({ orderId, sellerId })).unwrap();
        fetchOrders();
      },
    });
  };

  return (
    <div className="mx-auto p-8 bg-background min-h-screen container">
      <div className="max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[{ label: "Home", path: "/" }, { label: "Order History" }]}
        />
      </div>

      <div className="mx-auto ">
        <Card
          className="shadow-sm rounded-lg border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <Title level={4} className="mb-0 text-gray-800">
              Order History
            </Title>
          </div>

          <OrderTabs
            statusFilter={statusFilter}
            onChange={handleTabChange}
            totalCount={historyOrders.totalCount}
            className="mb-6"
          >
            {loading ? (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            ) : historyOrders.dataHistoryOrder?.length > 0 ? (
              historyOrders.dataHistoryOrder.map((order) => (
                <OrderCard
                  order={order}
                  key={order.orderId}
                  onFeedbackClick={handleFeedbackClick}
                  onReceivedClick={handleChangeToFeedback}
                  onCancelCashPayment={handleCancelCashPayment}
                  onTrackClick={handleTrackClick}
                  onCancelClick={handleCancelClick}
                  onWarrantyRequestClick={handleWarrantyRequestClick}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                There are no orders in this category.
              </div>
            )}
          </OrderTabs>
        </Card>
      </div>

      {selectedSellerGroup && (
        <FeedbackForm
          visible={!!selectedSellerGroup}
          onClose={handleCloseFeedback}
          sellerGroup={selectedSellerGroup}
          fetchHistoryOrder={fetchOrders}
        />
      )}

      <TrackingModal
        trackingInfo={trackingInfo}
        onClose={handleCloseTrackingModal}
      />

      <CancelOrderModal
        visible={cancelOrderInfo.visible}
        formData={cancelOrderInfo.formData}
        touched={cancelOrderInfo.touched}
        onChange={handleCancelFormChange}
        onCancel={() =>
          setCancelOrderInfo({ ...cancelOrderInfo, visible: false })
        }
        onConfirm={handleCancelOrder}
      />

      <WarrantyRequestModal
        visible={warrantyModal.visible}
        orderItemId={warrantyModal.orderItemId}
        onClose={handleCloseWarrantyModal}
        fetchOrders={fetchOrders}
      />
    </div>
  );
}
