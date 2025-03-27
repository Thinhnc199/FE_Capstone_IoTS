import { Link } from "react-router-dom";
import { Card, Badge, Rate, Button } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { TypeDevice } from "./../../../redux/constants"; 
import PropTypes from "prop-types";

const ComboCard = ({ combo }) => (
  <Link to={`/detail-combo/${combo.id}`}>
    <Card
      hoverable
      cover={
        <div className="relative group">
          {combo.deviceType === TypeDevice.NEWPRICE ? (
            <Badge.Ribbon text="New" color="red">
              <img
                alt={combo.name}
                src={combo.imageUrl || "/placeholder.jpg"}
                className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 p-3"
              />
            </Badge.Ribbon>
          ) : (
            <img
              alt={combo.name}
              src={combo.imageUrl || "/placeholder.jpg"}
              className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 p-3"
            />
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              shape="circle"
              className="bg-white p-2 shadow-md"
              icon={<HeartOutlined />}
            />
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
      <h2 className="text-lg font-semibold mb-2 truncate">{combo.name}</h2>
      <p className="text-red-600 font-semibold text-xl">
        {combo.price.toLocaleString()}₫
      </p>
      <div className="flex items-center mt-2">
        <Rate disabled allowHalf defaultValue={combo.rating} className="text-sm" />
      </div>
    </Card>
  </Link>
);

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