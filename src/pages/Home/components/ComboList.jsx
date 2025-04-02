
import { useSelector } from "react-redux";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { TypeDevice } from "../../../redux/constants";
import { Card, Button, Skeleton, Badge, Rate } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; 

const ComboList = ({ sortOrder, loading }) => {
  const { combos } = useSelector((state) => state.combo);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton
            key={index}
            active
            avatar
            paragraph={{ rows: 2 }}
            className="w-full"
          />
        ))}
      </div>
    );
  }

  // Sort combos based on selected order
  const sortedCombos = [...combos].sort((a, b) => {
    if (sortOrder === "priceLowToHigh") {
      return a.price - b.price;
    } else if (sortOrder === "priceHighToLow") {
      return b.price - a.price;
    }
    return 0; // Default order (no sorting)
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {sortedCombos
        .filter((combo) => combo.isActive === 1)
        .map((combo) => (
          <Link to={`/detail-combo/${combo.id}`} key={combo.id}>
            <Card
              hoverable
              cover={
                <div className="relative group">
                  {combo.deviceType === TypeDevice.NEWPRICE ? (
                    <Badge.Ribbon
                      text="New"
                      color="red"
                      className="text-textColer"
                    >
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
                      className="bg-white p-2 shadow-md hover:bg-bgColer"
                      icon={<HeartOutlined className="text-textColer" />}
                      aria-label="Add to wishlist"
                    />
                    <Button
                      shape="circle"
                      className="bg-white p-2 shadow-md hover:bg-bgColer"
                      icon={<EyeOutlined className="text-textColer" />}
                      aria-label="Quick view"
                    />
                  </div>
                </div>
              }
              className="shadow-lg rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-textColer mb-2 truncate">
                {combo.name}
              </h2>
              <p className="text-red-600 font-semibold text-xl">
                {combo.price.toLocaleString()}₫
              </p>
              <div className="flex items-center mt-2">
                <Rate
                  disabled
                  allowHalf
                  defaultValue={combo.rating}
                  className="text-sm text-yellow-500"
                />
              </div>
            </Card>
          </Link>
        ))}
    </div>
  );
};

// Add PropTypes validation
ComboList.propTypes = {
  sortOrder: PropTypes.oneOf(["default", "priceLowToHigh", "priceHighToLow"])
    .isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ComboList;