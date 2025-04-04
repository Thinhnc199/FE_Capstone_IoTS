import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import PropTypes from "prop-types";

const BreadcrumbNav = ({ items }) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          className={
            index === items.length - 1
              ? "font-semibold text-blue-600"
              : "text-gray-500"
          }
        >
          {item.path ? (
            <Link to={item.path} className="text-blue-600 hover:text-blue-800">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-blue-600">{item.label}</span>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

BreadcrumbNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ).isRequired,
};

export default BreadcrumbNav;
