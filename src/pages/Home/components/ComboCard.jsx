import { Link } from "react-router-dom";
import { Card, Badge, Rate, Button, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";
const { Text } = Typography;
const ComboCard = ({ combo }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Link to={`/detail-combo/${combo.id}`}>
      <Badge.Ribbon text="Combo" color="red">
        <Card
          hoverable
          cover={
            <div className="relative group">
              <img
                alt={combo.name}
                src={combo.imageUrl || "/placeholder.jpg"}
                className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 p-3"
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  shape="circle"
                  className="bg-white p-2 shadow-md"
                  icon={<EyeOutlined />}
                />
              </div>
            </div>
          }
          className="shadow-lg rounded-xl border border-gray-200 bg-white"
        >
          <div className="flex flex-col flex-grow space-y-1 sm:space-y-2">
            <div className="h-8 overflow-hidden">
              <Text
                strong
                className="text-xs sm:text-sm md:text-base font-bold group-hover:text-headerBg line-clamp-1"
              >
                {combo.name}
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <Text
                strong
                className="text-sm sm:text-base md:text-lg text-red-500"
              >
                {formatPrice(combo.price)}đ
              </Text>
            </div>
            <div className="flex items-center mt-2">
              <Rate
                disabled
                allowHalf
                defaultValue={combo.rating}
                className="text-xs sm:text-sm md:text-base"
              />
            </div>
          </div>
        </Card>
      </Badge.Ribbon>
    </Link>
  );
};
// Định nghĩa PropTypes
ComboCard.propTypes = {
  combo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    deviceType: PropTypes.string,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
  }).isRequired,
};

export default ComboCard;
