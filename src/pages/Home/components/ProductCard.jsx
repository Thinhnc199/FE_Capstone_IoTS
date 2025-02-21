import { Card, Badge, Button, Rate, Typography } from "antd";

import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
const { Text } = Typography;

const ProductCard = () => {
  return (
    <Card
      hoverable
      className="max-w-72 bg-white shadow-lg rounded-lg p-4"
      cover={
        <div className="relative">
          <Badge.Ribbon text="-40%" color="red">
            <img
              alt="Gamepad Circuit Board"
              src="https://storage.googleapis.com/a1aa/image/BTR5nBkUZX9917xvjWkc2Aq5RYNLpYvDC_xU64tKM1U.jpg"
              className="w-full rounded-t-lg"
            />
          </Badge.Ribbon>

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
      {/* Nội dung sản phẩm */}
      <div className="space-y-2">
        <Text strong className="text-lg font-bold">
          HAVIT HV-G92 Gamepad
        </Text>

        <div className="flex items-center space-x-2">
          <Text strong className="text-xl text-red-500">
            $120
          </Text>
          <Text delete className="text-gray-500">
            $160
          </Text>
        </div>

        {/* Đánh giá */}
        <div className="flex items-center">
          <Rate allowHalf defaultValue={4.5} />
          <Text className="text-gray-500 ml-2">(88)</Text>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
