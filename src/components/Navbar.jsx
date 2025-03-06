import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCarts,
  deleteCarts,
  selectCarts,
  unselectCarts,
  fetchGetTotalPrice,
  resetCart,
  setIsOpenDropdown,
} from "../redux/slices/cartSlice";
import Logo from "../assets/icons/3.svg";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Input,
  Dropdown,
  Space,
  Modal,
  Empty,
  Checkbox,
  Button,
} from "antd";
import QuantityInput from "./common/QuantityInput";
const { Search } = Input;

const Navbar = () => {
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector((state) => state.carts.isOpenDropdown);
  const { cart, pageIndex, pageSize, totalSelectedItemsPrice } = useSelector(
    (state) => state.carts
  );

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
      dispatch(fetchGetTotalPrice());
    } else {
      dispatch(resetCart());
    }
  }, [token, dispatch]);
  const handleTotalProduct = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  const handleDelete = async (cartId) => {
    try {
      await dispatch(deleteCarts({ cartId })).unwrap();
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
    dispatch(fetchGetTotalPrice());
    dispatch(fetchCarts({ pageIndex, pageSize }));
  };
  const handleCheckBox = async (cartId, isChecked) => {
    try {
      if (isChecked) {
        dispatch(setIsOpenDropdown(true));
        await dispatch(selectCarts({ cartId })).unwrap();
      } else {
        dispatch(setIsOpenDropdown(true));
        await dispatch(unselectCarts({ cartId })).unwrap();
      }

      dispatch(fetchGetTotalPrice());
      dispatch(fetchCarts({ pageIndex, pageSize }));
    } catch (error) {
      console.error("Failed to update cart selection:", error);
    }
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
      ? [
          ...cart.map((item, index) => ({
            key: index,
            label: (
              <div className="h-50vw relative flex gap-4 items-center justify-between p-2 hover:bg-gray-100 border-b border-gray-300">
                {/* Checkbox và hình ảnh */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.isSelected}
                    onChange={(e) => handleCheckBox(item.id, e.target.checked)}
                  />
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex-1 min-w-0">
                  <Link to={`/detail/${item.productId}`}>
                    <span className="font-medium truncate h-12">
                      {item.productName}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <QuantityInput quantity={item.quantity} cartId={item.id} />
                  </div>
                </div>

                {/* Giá tiền */}
                <span className="font-medium whitespace-nowrap text-red-500">
                  {item.price.toLocaleString()}₫
                </span>

                {/* Nút xóa */}
                <CloseOutlined
                  className=" font-bold absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            ),
          })),
          {
            key: "total",
            label: (
              <div className=" p-2 rounded-sm ">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-medium">Total price:</p>
                  <p className="text-lg font-semibold text-red-400">
                    {totalSelectedItemsPrice.toLocaleString()}₫
                  </p>
                </div>
                <Button className="bg-headerBg text-white w-full">
                  Payment
                </Button>
              </div>
            ),
          },
        ]
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
              width: "23vw",
              height: "5vw",
              borderRadius: "10px",
              border: "1px solid #f0f0f0",
              overflowY: "auto",
            }}
            trigger={["hover"]}
            open={isDropdownOpen}
            onOpenChange={(open) => dispatch(setIsOpenDropdown(open))}
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
                  onClick={() => dispatch(setIsOpenDropdown(!isDropdownOpen))}
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
              getPopupContainer={() => document.body}
            >
              <Space>
                <UserOutlined
                  className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer "
                  onClick={() => dispatch(setIsOpenDropdown(!isDropdownOpen))}
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
