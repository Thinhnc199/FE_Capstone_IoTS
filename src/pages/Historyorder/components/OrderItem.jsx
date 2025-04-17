import PropTypes from "prop-types";
import { Button } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
export const OrderItem = ({ item, onWarrantyRequestClick }) => {
  const currentDate = new Date();
  const warrantyEndDate = new Date(item.warrantyEndDate);
  const isWarrantyValid = warrantyEndDate > currentDate;
  const isWarrantyApplicable = item.productType !== 3;
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

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
          <div className="flex items-end flex-col space-x-2">
            {isWarrantyValid ? (
              <span className="text-gray-500 text-xs flex gap-1">
                <p className="text-green-700">Warranty until:</p>
                {formatDate(item.warrantyEndDate)}
              </span>
            ) : (
              ""
            )}

            {isWarrantyValid ? (
              <Button
                // shape="round"
                className="border-none text-yellow-500 flex items-center justify-center  shadow-none hover:bg-yellow-100 bg-blue-50  "
                onClick={() => onWarrantyRequestClick(item.orderItemId)}
                style={{
                  borderRadius: "8px",
                  padding: "0px 0px",
                }}
              >
                Warranty
                <SafetyCertificateOutlined />
              </Button>
            ) : (
              <span className="text-gray-500 text-xs">Warranty expired!</span>
            )}
          </div>
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
