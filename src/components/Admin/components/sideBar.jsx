import { Link, useNavigate } from "react-router-dom";
import ProductManageIcon from "@/assets/icons/ProductManageIcon";
import {
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
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
    <div className="h-screen w-[270px] text-black font-sans3 ">
      <nav className="mt-1 p-3 flex flex-col space-y-4">
        {/* MAIN MANAGE */}
        <div>
          <Link to="/admin/dashboard">
            <div
              className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition-transform duration-200 ${
                selectedButton === 1
                  ? "bg-bgColer text-textColer font-semibold"
                  : " hover:bg-bgColer hover:text-textColer "
              }`}
              onClick={() => handleButtonClick(1)}
            >
              <i className="las la-home w-6 h-6 flex items-center justify-center text-2xl"></i>
              <span className="font-semibold">Dashboard</span>
            </div>
            <hr />
          </Link>
          <div>
            <h3 className="font-bold text-lg px-4 py-2 mt-2">MAIN MANAGE</h3>
            <Link to="/admin/list-product">
              <div
                className={`my-1 gap-4 p-3 flex items-center rounded-l-full transition duration-200 ${
                  selectedButton === 2
                    ? "bg-bgColer text-textColer font-semibold"
                    : " hover:bg-bgColer hover:text-textColer"
                }`}
                onClick={() => handleButtonClick(2)}
              >
                <ProductManageIcon className="w-6 h-6" />
                <span className="font-semibold">List Product</span>
              </div>
            </Link>
            <Link to="/admin/list-account">
              <div
                className={`my-1 gap-4 p-3  flex items-center rounded-l-full  duration-200 ${
                  selectedButton === 3
                    ? "bg-bgColer text-textColer font-semibold"
                    : "hover:transition-all hover:ease-in-out hover:bg-bgColer hover:text-textColer "
                }`}
                onClick={() => handleButtonClick(3)}
              >
                <i className="las la-users w-6 h-6 flex items-center justify-center text-2xl"></i>
                <span className="font-semibold ">List Account</span>
              </div>
            </Link>
            <Link to="/admin/create-manager-staff">
              <div
                className={`my-1 gap-4 p-3  flex items-center rounded-l-full  duration-200 ${
                  selectedButton === 4
                    ? "bg-bgColer text-textColer font-semibold"
                    : "hover:transition-all hover:ease-in-out hover:bg-bgColer hover:text-textColer "
                }`}
                onClick={() => handleButtonClick(4)}
              >
                <UsergroupAddOutlined className="w-6 h-6 flex items-center justify-center text-xl" />
                <span className="font-semibold ">Create Account</span>
              </div>
            </Link>
          </div>
        </div>
        {/* ACCOUNT*/}
        <hr />
        <div>
          <div>
            <a className="font-bold text-lg px-4 py-2">ACCOUNT</a>
            <Link to="/admin/profile">
              <div
                className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition duration-200 ${
                  selectedButton === 6
                    ? "bg-bgColer text-textColer font-semibold"
                    : " hover:bg-bgColer hover:text-textColer"
                }`}
                onClick={() => handleButtonClick(6)}
              >
                <UserOutlined className="w-6 h-6 flex items-center justify-center text-xl" />
                <span className="font-semibold">Profile</span>
              </div>
            </Link>

            <div
              className={`my-1 gap-4 p-3  flex items-center rounded-l-full transition duration-200 cursor-pointer ${
                selectedButton === 7
                  ? "bg-bgColer text-textColer font-semibold"
                  : " hover:bg-bgColer hover:text-textColer"
              }`}
              onClick={handleLogout}
            >
              <LogoutOutlined className="w-6 h-6 flex items-center justify-center text-xl" />
              <span className="font-semibold">Logout</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
