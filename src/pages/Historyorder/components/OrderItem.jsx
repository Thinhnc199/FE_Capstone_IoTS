import PropTypes from "prop-types";
import { Button } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";

export const OrderItem = ({ item, onWarrantyRequestClick }) => {
  const currentDate = new Date();
  const warrantyEndDate = new Date(item.warrantyEndDate);
  const isWarrantyValid = warrantyEndDate > currentDate;
  const isWarrantyApplicable = item.productType !== 3;

  return (
    <div className="flex justify-between items-center  p-3 bg-blue-50 rounded-md">
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
      <div className="flex items-end space-x-4 flex-col-reverse">
        <p className="text-red-500 font-medium">
          {item.price.toLocaleString("vi-VN")}₫
        </p>
        {item.orderItemStatus === 6 && isWarrantyApplicable && (
          <>
            {isWarrantyValid ? (
              <Button
                shape="round"
                className="border-none text-yellow-500 flex items-center justify-center  shadow-none hover:bg-yellow-100 bg-blue-50"
                onClick={() => onWarrantyRequestClick(item.orderItemId)}
              >
                Warranty
                <SafetyCertificateOutlined />
              </Button>
            ) : (
              <span className="text-gray-500 text-xs">Warranty expired!</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    orderItemId: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    nameProduct: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    orderItemStatus: PropTypes.number.isRequired,
    warrantyEndDate: PropTypes.string.isRequired,
    productType: PropTypes.number.isRequired,
  }).isRequired,
  onWarrantyRequestClick: PropTypes.func.isRequired,
};
