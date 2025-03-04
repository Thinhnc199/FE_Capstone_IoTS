import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCarts, resetCart } from "../redux/slices/cartSlice";
import Logo from "../assets/icons/3.svg";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Badge, Input, Dropdown, Space, Modal, Empty } from "antd";

const { Search } = Input;

const Navbar = () => {
  const { cart } = useSelector((state) => state.carts);
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.carts);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("requestId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("imageUrl");
    setIsModalVisible(false);
    navigate("/login");
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchCarts({ pageIndex, pageSize }));
    } else {
      dispatch(resetCart()); // Xóa cart khi chưa đăng nhập hoặc logout
    }
  }, [token, dispatch]);
  const handleTotalProduct = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  const menuItems = [
    {
      key: "1",
      label: <p className="font-semibold text-gray-700 text-sm">My Account</p>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: <Link to="/login">Login</Link>,
      icon: <LoginOutlined />,
    },
    {
      key: "3",
      label: <Link to="/emailcustomer">Register</Link>,
      icon: <UserAddOutlined />,
    },
  ];
  const menuItemsLogin = [
    {
      key: "1",
      label: <p className="font-semibold text-gray-700 text-sm">My Account</p>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: <Link to="/profile">Profile</Link>,
      icon: <UserAddOutlined />,
    },

    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,

      onClick: showModal,
    },
  ];
  const menuCart =
    cart.length > 0
      ? cart.map((item, index) => ({
          key: index,
          label: (
            <div className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="font-semibold hover:text-head erBg">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ),
        }))
      : [
          {
            key: "empty",
            label: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          },
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
              <b className="font-semibold">Become Store & Trainer</b>
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
          {/* cart */}
          <Dropdown
            menu={{ items: menuCart }}
            overlayStyle={{
              width: "25vw",
              borderRadius: "10px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Space className="cursor-pointer" onClick={() => navigate("/cart")}>
              <Badge count={handleTotalProduct()}>
                <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
              </Badge>
            </Space>
          </Dropdown>
          {/* user */}
          {!token ? (
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
          ) : (
            <Dropdown
              menu={{ items: menuItemsLogin }}
              overlayStyle={{
                width: "10vw",
                borderRadius: "10px",
                border: "1px solid #f0f0f0",
              }}
            >
              <Space>
                <UserOutlined
                  className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer "
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              </Space>
            </Dropdown>
          )}
        </div>
      </div>
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </nav>
  );
};

export default Navbar;
