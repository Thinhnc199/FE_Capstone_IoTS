import PropTypes from "prop-types";
import { Card, Button, Rate, Typography } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Text } = Typography;
import { useDispatch } from "react-redux";
import { fetchAddCarts, fetchCarts } from "../../../redux/slices/cartSlice";
import { ProductType } from "../../../redux/constants";
import { message } from "antd";
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  const handleQuickAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.quantity <= 0) {
      message.warning("This product is out of stock.");
      return;
    }

    try {
      await dispatch(
        fetchAddCarts({
          productId: product.id,
          productType: ProductType.DEVICE,
          quantity: 1,
        })
      ).unwrap();

      await dispatch(fetchCarts({ pageIndex: 0, pageSize: 100 }));

      message.success("Product added to cart!");
    } catch (error) {
      message.error(error.message || "Failed to add to cart");
    }
  };
  return (
    <Link to={`/detail/${product.id}`}>
      <Card
        key={product.id}
        hoverable
        className="w-full h-full min-h-[300px] sm:h-96 bg-white shadow-md rounded-lg mx-0 sm:m-2 group flex flex-col"
        cover={
          <div className="relative flex-shrink-0">
            <img
              alt={product.name}
              src={product.imageUrl || "/placeholder.jpg"}
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-0"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                shape="circle"
                size="small"
                className="bg-white p-1 sm:p-2 rounded-full shadow-md"
                icon={<EyeOutlined className="text-xs sm:text-sm" />}
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-col flex-grow space-y-1 sm:space-y-2">
          <div className="h-12 sm:h-14 overflow-hidden">
            <Text
              strong
              className="text-xs sm:text-sm md:text-base font-bold group-hover:text-headerBg line-clamp-2"
            >
              {product.name}
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <Text
              strong
              className="text-sm sm:text-base md:text-lg text-red-500"
            >
              {formatPrice(product.price)}đ
            </Text>
          </div>
          <div className="flex items-center">
            <Rate
              disabled
              allowHalf
              defaultValue={product.rating}
              className="text-xs sm:text-sm md:text-base"
            />
          </div>
          {/* Quick Add to Cart Button */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleQuickAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="small"
            >
              Quick Add
            </Button>
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
