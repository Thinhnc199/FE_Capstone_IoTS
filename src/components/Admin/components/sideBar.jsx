import { Link, useNavigate } from "react-router-dom";
import ProductManageIcon from "@/assets/icons/ProductManageIcon";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (
    <div className="h-screen w-64 text-black font-mainText3">
      <nav className="mt-1 p-3 flex justify-evenly flex-col">
        {/* MAIN MANAGE */}
        <div>
          <Link to="/admin/dashboard">
            <div
              className={`p-2 my-2 flex items-center rounded-l-full  transition duration-200 ${
                selectedButton === 1
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer "
              }`}
              onClick={() => handleButtonClick(1)}
            >
              <i className="las la-home  text-2xl"></i>
              <a className="py-2.5 px-4 w-full">Dashboard</a>
            </div>
          </Link>
          <div
            className={`p-2 my-2 flex items-center rounded-l-full  transition duration-200 `}
          >
            <a className="py-2.5  w-full font-bold ">MAIN MANAGE</a>
          </div>

          <Link to="/admin/list-account">
            <div
              className={`p-2 my-2  flex items-center rounded-l-full transition duration-200 ${
                selectedButton === 2
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              <i className="las la-users text-2xl"></i>

              <a className="py-2.5 px-4 w-full">List product</a>
            </div>
          </Link>
          <Link to="/admin/list-product">
            <div
              className={`p-2 my-2  flex items-center rounded-l-full transition duration-200 ${
                selectedButton === 3
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
              }`}
              onClick={() => handleButtonClick(3)}
            >
              <ProductManageIcon className="text-2xl" />
              <a className="py-2.5 px-4 w-full">List accounts</a>
            </div>
          </Link>
        </div>
        {/* ACCOUNT*/}
        <div>
          <div
            className={`p-2 my-2 flex items-center rounded-l-full  transition duration-200 `}
          >
            <a className="py-2.5  w-full font-bold">ACCOUNT</a>
          </div>
          <Link to="/admin/profile">
            <div
              className={`p-2 my-2  flex items-center rounded-l-full transition duration-200 ${
                selectedButton === 6
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
              }`}
            >
              <UserOutlined className="text-1xl" />
              <a className="py-2.5 px-4 w-full">Profile</a>
            </div>
          </Link>

          <div
            className={`p-2 my-2  flex items-center rounded-l-full transition duration-200 ${
              selectedButton === 6
                ? "bg-bgColer text-textColer font-semibold"
                : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
            }`}
            onClick={handleLogout}
          >
            <LogoutOutlined className="text-1xl " />
            <span className="py-2.5 px-4 w-full">Logout</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
