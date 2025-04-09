import PropTypes from "prop-types";
import { Button } from "antd";
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { OrderStatusTag } from "./OrderStatusTag";
import { OrderItem } from "./OrderItem";

export const SellerGroup = ({
  group,
  orderId,
  onFeedbackClick,
  onWarrantyRequestClick,
}) => (
  <div className="rounded-md mb-4">
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <div className="flex items-center space-x-3">
        <p className="font-bold text-md">{group.sellerName}</p>
        <div className="flex space-x-2">
          <button className="px-1 py-1 border border-blue-500 bg-blue-500 text-white rounded-sm hover:bg-white hover:text-blue-500 transition-colors text-xs">
            <MessageOutlined className="mr-2" />
            Chat Now
          </button>
          <Link to={`/shop-infomation/${group.storeId}`}>
            <button className="px-1 py-1 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 transition-colors text-xs">
              <ShopOutlined className="mr-2" />
              View Shop
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <OrderStatusTag statusId={group.orderItemStatus} />
        {group.orderItemStatus === 5 && (
          <Button
            className="bg-blue-500 text-white rounded-md border border-blue-500"
            onClick={() => onFeedbackClick({ ...group, orderId })}
          >
            Feedback
          </Button>
        )}
      </div>
    </div>

    {group.items.map((item) => (
      <OrderItem
        item={item}
        key={item.orderItemId}
        onWarrantyRequestClick={onWarrantyRequestClick}
      />
    ))}
  </div>
);

SellerGroup.propTypes = {
  group: PropTypes.shape({
    sellerId: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    storeId: PropTypes.string.isRequired,
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
  orderId: PropTypes.number,
  onFeedbackClick: PropTypes.func.isRequired,
  onWarrantyRequestClick: PropTypes.func.isRequired,
};
