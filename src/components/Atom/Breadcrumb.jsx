import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
const Breadcrumb = ({ items }) => {
  return (
    <div className="flex items-center flex-wrap">
      {items?.map((item, index) => (
        <BreadcrumbItem
          key={index}
          item={item}
          isLast={items.length - 1 === index}
        />
      ))}
    </div>
  );
};

export default Breadcrumb;
Breadcrumb.propTypes = {
  items: PropTypes.array,
};

const BreadcrumbItem = ({ item, isLast }) => {
  return (
    <div>
      <Link
        to={item.link}
        className={`transition-all ease-in-out duration-300 text-base hover:text-textColer ${
          isLast ? "text-outerspace font-semibold" : "text-gray font-medium"
        }`}
      >
        {" "}
        {item.label}
      </Link>
      {!isLast && (
        <span className="mx-2 inline-flex text-xs">
          <RightOutlined />
        </span>
      )}
    </div>
  );
};

BreadcrumbItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
};
