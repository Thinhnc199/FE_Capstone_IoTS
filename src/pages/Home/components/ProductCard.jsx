// import PropTypes from "prop-types";
// import { Card, Button, Rate, Typography } from "antd";
// import { EyeOutlined } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// const { Text } = Typography;

// const ProductCard = ({ product }) => {
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN").format(price);
//   };
//   return (
//     <Link to={`/detail/${product.id}`}>
//       <Card
//         key={product.id}
//         hoverable
//         className="w-full h-96 bg-white shadow-md rounded-lg m-2  group flex flex-col"
//         cover={
//           <div className="relative flex-shrink-0">
//             {/* <Badge.Ribbon text="New" color="red"> */}
//             <img
//               alt={product.name}
//               src={product.imageUrl || "/placeholder.jpg"}
//               className="w-full h-48 rounded-t-lg scale-100 transition-all duration-300 group-hover:scale-90 p-0"
//             />
//             {/* </Badge.Ribbon> */}

//             <div className="absolute top-2 left-2 flex space-x-2">
//               <Button
//                 shape="circle"
//                 className="bg-white p-2 rounded-full shadow-md"
//                 icon={<EyeOutlined />}
//               />
//             </div>
//           </div>
//         }
//       >
//         {/* context card */}
//         <div className="flex flex-col flex-grow space-y-2">
//           <div className="h-14 overflow-hidden">
//             <Text
//               strong
//               className="text-lg font-bold group-hover:text-headerBg line-clamp-2 overflow-ellipsis overflow-hidden"
//             >
//               {product.name}
//             </Text>
//           </div>
//           {product.product}
//           <div className="flex items-center space-x-2">
//             <Text strong className="text-xl text-red-500">
//               {formatPrice(product.price)}đ
//             </Text>
//           </div>
//           <div className="flex items-center">
//             <Rate disabled allowHalf defaultValue={product.rating} />
//           </div>
//         </div>
//       </Card>
//     </Link>
//   );
// };

// ProductCard.propTypes = {
//   product: PropTypes.object.isRequired,
// };

// export default ProductCard;
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
        </div>
      </Card>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
