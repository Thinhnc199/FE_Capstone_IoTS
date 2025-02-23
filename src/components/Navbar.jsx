import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/3.svg";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Badge, Input, Dropdown, Space } from "antd";

const { Search } = Input;

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    {
      key: "1",
      label: <p className="font-semibold text-gray-700 text-sm">My Account</p>,
      disabled: true,
    },
    { type: "divider" },
    { key: "2", label: <Link to="/login">Login</Link>, icon: <UserAddOutlined /> },
    { key: "3", label: <Link to="/emailcustomer">Register</Link>, icon: <UserAddOutlined /> },
  ];

  return (
    <nav className="bg-white border-b border-b-gray-300 ">
      {/* Header Banner */}
      <div className="h-10 w-full bg-headerBg flex justify-center items-center text-white gap-2">
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </p>
        <a href="#" className="font-semibold">
          Shop Now
        </a>
      </div>

      {/* Navbar Main */}
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#007AFF] flex items-center space-x-2"
        >
          <img src={Logo} alt="Logo" className="w-16 h-16" />
          <p className="">IOTS</p>
        </Link>

        {/* Menu Links */}
        <ul className="flex space-x-8 text-gray-700">
          <li>
            <Link to="/" className="hover:text-[#007AFF] cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-[#007AFF] cursor-pointer">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#007AFF] cursor-pointer">
              About
            </Link>
          </li>
          <li>
            <Link
              to="/StoreEmail"
              className="hover:text-[#007AFF] cursor-pointer text-blue-500 "
            >
            <b>Become Store & Trainer</b> 
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <Search
            size="large"
            className="w-[250px] "
            placeholder="What are you looking for?"
          />
          <Link to="/wishlist">
            <HeartOutlined className="text-gray-700 text-[25px] hover:text-red-500" />
          </Link>
          <Badge count={2}>
            <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
          </Badge>
          <Dropdown
            menu={{ items: menuItems }}
            overlayStyle={{
              width: "10vw",
              borderRadius: "10px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Space>
              <UserOutlined
                className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            </Space>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
