import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link
          to="/"
          style={{ fontWeight: location.pathname === "/" ? "bold" : "normal" }}
        >
          Home
        </Link>
      </Breadcrumb.Item>
      {pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
        const isActive = location.pathname === url;

        return (
          <Breadcrumb.Item key={url}>
            <Link
              to={url}
              style={{
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#007aff" : "inherit",
                // Chỉnh màu cho breadcrumb đang ở
              }}
              className=""
            >
              {snippet}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
