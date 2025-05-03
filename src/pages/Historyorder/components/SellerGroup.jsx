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
  onReceivedClick,
}) => (
  <div className=" mb-4 border-b border-gray-300 ">
    <div className="flex justify-between items-center pb-3 mb-3">
      <div className="flex items-center space-x-3">
        <p className="font-bold text-md">{group.sellerName}</p>
        <div className="flex space-x-2">
          {/* <Link to={`/chat/${group.storeId}`}> */}
          <button className="px-1 py-1 border border-blue-500 bg-blue-500 text-white rounded-sm hover:bg-white hover:text-blue-500 transition-colors text-xs">
            <MessageOutlined className="mr-2" />
            Chat Now
          </button>
          {/* </Link> */}
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
        {/* {group.orderItemStatus === 5 && (
          <Button
            className="bg-blue-500 text-white rounded-md border border-blue-500"
            onClick={() => onFeedbackClick({ ...group, orderId })}
          >
            Feedback
          </Button>
        )} */}
      </div>
    </div>

    {group.items.map((item) => (
      <OrderItem
        item={item}
        key={item.orderItemId}
        onWarrantyRequestClick={onWarrantyRequestClick}
      />
    ))}
    <div className=" justify-end flex items-center my-2">
      {" "}
      {group.orderItemStatus === 5 && (
        <Button
          className="bg-blue-500 text-white rounded-md border border-blue-500"
          onClick={() => onFeedbackClick({ ...group, orderId })}
        >
          Feedback
        </Button>
      )}
      {group.orderItemStatus === 3 && (
        <Button
          className="bg-green-500 text-white rounded-md  border border-green-500"
          onClick={() => {
            console.log("Received clicked", group.sellerId, orderId);
            onReceivedClick(orderId, group.sellerId);
          }}
        >
          Received Order
        </Button>
      )}
    </div>
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
  sellerId: PropTypes.number,
  onFeedbackClick: PropTypes.func.isRequired,
  onWarrantyRequestClick: PropTypes.func.isRequired,
  onReceivedClick: PropTypes.func.isRequired,
};
