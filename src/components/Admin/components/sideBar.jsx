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
      <nav className="mt-1 p-3 flex flex-col space-y-4">
        {/* MAIN MANAGE */}
        <div>
          <Link to="/admin/dashboard">
            <div
              className={`my-1 gap-4 p-3  flex items-center rounded-l-full  transition duration-200 ${
                selectedButton === 1
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer "
              }`}
              onClick={() => handleButtonClick(1)}
            >
              <i className="las la-home w-6 h-6 flex items-center justify-center text-2xl"></i>
              <span className="text-base">Dashboard</span>
            </div>
          </Link>
          <div>
            <h3 className="font-bold text-lg px-4 py-2 mt-2">MAIN MANAGE</h3>
            <Link to="/admin/list-account">
              <div
                className={`my-1 gap-4 p-3 flex items-center rounded-l-full transition duration-200 ${
                  selectedButton === 2
                    ? "bg-bgColer text-textColer font-semibold"
                    : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
                }`}
                onClick={() => handleButtonClick(2)}
              >
                <ProductManageIcon className="w-6 h-6" />
                <span className="text-base">List Product</span>
              </div>
            </Link>
            <Link to="/admin/list-product">
              <div
                className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition duration-200 ${
                  selectedButton === 3
                    ? "bg-bgColer text-textColer font-semibold"
                    : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
                }`}
                onClick={() => handleButtonClick(3)}
              >
                <i className="las la-users w-6 h-6 flex items-center justify-center text-2xl"></i>
                <span className="text-base">List Product</span>
              </div>
            </Link>
          </div>
        </div>
        {/* ACCOUNT*/}
        <div>
          <div>
            <a className="font-bold text-lg px-4 py-2">ACCOUNT</a>
            <Link to="/admin/profile">
              <div
                className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition duration-200 ${
                  selectedButton === 6
                    ? "bg-bgColer text-textColer font-semibold"
                    : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
                }`}
                onClick={() => handleButtonClick(6)}
              >
                <UserOutlined className="w-6 h-6 flex items-center justify-center text-xl" />
                <span className="text-base">Profile</span>
              </div>
            </Link>

            <div
              className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition duration-200 cursor-pointer ${
                selectedButton === 7
                  ? "bg-bgColer text-textColer font-semibold"
                  : "hover:font-semibold hover:bg-bgColer hover:text-textColer"
              }`}
              onClick={handleLogout}
            >
              <LogoutOutlined className="w-6 h-6 flex items-center justify-center text-xl" />
              <span className="text-base">Logout</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
