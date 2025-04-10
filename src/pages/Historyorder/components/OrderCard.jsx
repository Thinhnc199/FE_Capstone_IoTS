import PropTypes from "prop-types";
import { Button } from "antd";
import { TruckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SellerGroup } from "./SellerGroup";

const formatDate = (dateString) => {
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
};

export const OrderCard = ({
  order,
  onFeedbackClick,
  onReceivedClick,
  onTrackClick,
  onCancelClick,
  onWarrantyRequestClick,
  onCancelCashPayment,
}) => {
  const trackingId = order.orderDetailsGrouped[0]?.trackingId;

  return (
    <div className="p-6 rounded-lg shadow-md my-6 border border-gray-200 bg-white">
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
        <div className="flex justify-end items-center">
          {order.orderDetailsGrouped.some(
            (group) =>
              group.orderItemStatus === 2 || group.orderItemStatus === 3
          ) &&
            trackingId && (
              <>
                <Button
                  className="border-none shadow-none flex items-center"
                  onClick={() => onTrackClick(trackingId)}
                >
                  <TruckOutlined className="text-green-500 hover:text-green-700 text-lg" />
                </Button>
                <span>|</span>
              </>
            )}
          {order.orderStatusId === 1 ? (
            <p className="text-green-600 pl-3">PAID</p>
          ) : order.orderStatusId === 2 ? (
            <p className="text-red-600 pl-3">CANCELLED</p>
          ) : (
            <p className="text-yellow-600 pl-3">CASH PAYMENT</p>
          )}
        </div>
      </div>

      {order.orderDetailsGrouped.map((group) => (
        <SellerGroup
          group={group}
          orderId={order.orderId}
          key={`${order.orderId}-${group.sellerId}`}
          onFeedbackClick={onFeedbackClick}
          onReceivedClick={onReceivedClick}
          onWarrantyRequestClick={onWarrantyRequestClick}
        />
      ))}

      <div className="flex justify-between items-center  pt-4">
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
        {/* {order.orderDetailsGrouped.some(
          (group) => group.orderItemStatus === 3
        ) && (
          <Button
            className="bg-green-500 text-white rounded-md border border-green-500"
            onClick={() =>
              onReceivedClick(
                order.orderId,
                order.orderDetailsGrouped[0].sellerId
              )
            }
          >
            Received Order
          </Button>
        )} */}

        {order.orderDetailsGrouped.some(
          (group) => group.orderItemStatus === 1
        ) &&
          (order.orderStatusId === 3 ? (
            <Button
              className="bg-red-500 text-white rounded-md border border-red-500"
              onClick={() => onCancelCashPayment(order.orderId)}
            >
              Cancel Order
            </Button>
          ) : (
            <Button
              className="bg-red-500 text-white rounded-md border border-red-500"
              onClick={() =>
                onCancelClick(
                  order.orderId,
                  order.orderDetailsGrouped[0].sellerId
                )
              }
            >
              Cancel Order
            </Button>
          ))}
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
    shippingFee: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    orderDetailsGrouped: PropTypes.arrayOf(
      PropTypes.shape({
        sellerId: PropTypes.number.isRequired,
        sellerName: PropTypes.string.isRequired,
        orderItemStatus: PropTypes.number.isRequired,
        trackingId: PropTypes.string,
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
  onReceivedClick: PropTypes.func.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onWarrantyRequestClick: PropTypes.func.isRequired,
  onCancelCashPayment: PropTypes.func.isRequired,
};
