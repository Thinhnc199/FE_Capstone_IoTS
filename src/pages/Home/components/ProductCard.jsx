import PropTypes from "prop-types";
import { Card, Badge, Button, Rate, Typography } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { TypeDevice } from "../../../redux/constants";
import { Link } from "react-router-dom";
const { Text } = Typography;

const ProductCard = ({ product }) => {
  if (!product) return null;

  const discountPercentage =
    ((product.price - product.secondHandPrice) / product.price) * 100;
  return (
    <Link to={`/${product.id}`}>
      <Card
        key={product.id}
        hoverable
        className="max-w-72 bg-white shadow-md rounded-lg  group "
        cover={
          <div className="relative ">
            {product.deviceType === TypeDevice.NEWPRICE ? (
              <Badge.Ribbon text="New" color="red">
                <img
                  alt={product.name}
                  src={product.imageUrl || "/placeholder.jpg"}
                  className="w-full   rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 "
                />
              </Badge.Ribbon>
            ) : (
              <Badge.Ribbon
                text={`-${discountPercentage.toFixed(0)}% `}
                color="red"
              >
                <img
                  alt={product.name}
                  src={product.imageUrl || "/placeholder.jpg"}
                  className="w-[99%] rounded-t-lg  scale-100 transition-all duration-300 group-hover:scale-90 "
                />
              </Badge.Ribbon>
            )}

            <div className="absolute top-2 left-2 flex space-x-2">
              <Button
                shape="circle"
                className="bg-white p-2 rounded-full shadow-md"
                icon={<HeartOutlined />}
              />
              <Button
                shape="circle"
                className="bg-white p-2 rounded-full shadow-md"
                icon={<EyeOutlined />}
              />
            </div>
          </div>
        }
      >
        <div className="space-y-2">
          <Text strong className="text-lg font-bold  group-hover:text-headerBg">
            {product.name}
          </Text>
          {product.product}
          <div className="flex items-center space-x-2">
            {product.deviceType === TypeDevice.NEWPRICE ? (
              <Text strong className="text-xl text-red-500">
                ${product.price}
              </Text>
            ) : (
              <>
                <Text strong className="text-xl text-red-500">
                  ${product.secondHandPrice}
                </Text>
                <Text delete className="text-gray-500">
                  ${product.price}
                </Text>
              </>
            )}
          </div>
          <div className="flex items-center">
            <Rate disabled allowHalf defaultValue={product.rating} />
            <Text className="text-gray-500 ml-2">(88)</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
