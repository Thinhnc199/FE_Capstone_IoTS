import PropTypes from "prop-types";
import { Card, Button, Rate, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Text } = Typography;

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  return (
    <Link to={`/detail/${product.id}`}>
      <Card
        key={product.id}
        hoverable
        className="w-full h-96 bg-white shadow-md rounded-lg m-2  group flex flex-col"
        cover={
          <div className="relative flex-shrink-0">
            {/* <Badge.Ribbon text="New" color="red"> */}
            <img
              alt={product.name}
              src={product.imageUrl || "/placeholder.jpg"}
              className="w-full h-48 rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-0"
            />
            {/* </Badge.Ribbon> */}

            <div className="absolute top-2 left-2 flex space-x-2">
              <Button
                shape="circle"
                className="bg-white p-2 rounded-full shadow-md"
                icon={<EyeOutlined />}
              />
            </div>
          </div>
        }
      >
        {/* context card */}
        <div className="flex flex-col flex-grow space-y-2">
          <div className="h-14 overflow-hidden">
            <Text
              strong
              className="text-lg font-bold group-hover:text-headerBg line-clamp-2 overflow-ellipsis overflow-hidden"
            >
              {product.name}
            </Text>
          </div>
          {product.product}
          <div className="flex items-center space-x-2">
            <Text strong className="text-xl text-red-500">
              {formatPrice(product.price)}đ
            </Text>
          </div>
          <div className="flex items-center">
            <Rate disabled allowHalf defaultValue={product.rating} />
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
