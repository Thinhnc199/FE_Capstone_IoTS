import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPaginatedMaterialCategories } from "../redux/slices/materialCategorySlice";
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
  ShoppingCartOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined,
  CloseOutlined,
  HistoryOutlined,
  MenuOutlined,
  ProductOutlined,
  PlaySquareOutlined,
  BarcodeOutlined,
  MessageOutlined,
  HomeOutlined,
  BellOutlined,
  IssuesCloseOutlined,
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
  Drawer,
} from "antd";
import useNotification from "../utils/useNotification.jsx";
import QuantityInput from "./common/QuantityInput";
const { Search } = Input;

const Navbar = () => {
  const categoryButtonRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isDropdownOpen = useSelector((state) => state.carts.isOpenDropdown);
  const { activeData } = useSelector((state) => state.materialCategory);
  const { cart, pageIndex, pageSize, totalSelectedItemsPrice } = useSelector(
    (state) => state.carts
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const token = localStorage.getItem("token");
  const showModal = () => setIsModalVisible(true);
  const showCategoryModal = () => setIsCategoryModalVisible(true);
  const handleCategoryModalCancel = () => setIsCategoryModalVisible(false);
  const { NotificationDropdown, notificationCount } = useNotification();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCategoryButtonPosition = () => {
    if (categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }
    return { top: 0, left: 0 };
  };

  const { left } = getCategoryButtonPosition();

  const handleLogout = () => {
    localStorage.clear();
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
  }, [token, dispatch, location]);

  useEffect(() => {
    dispatch(fetchPaginatedMaterialCategories({ pageIndex, pageSize }));
  }, [dispatch]);

  const handleTotalProduct = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDelete = async (cartId) => {
    try {
      await dispatch(deleteCarts({ cartId })).unwrap();
      dispatch(fetchGetTotalPrice());
      dispatch(fetchCarts({ pageIndex, pageSize }));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const handleCheckBox = async (cartId, isChecked) => {
    try {
      if (isChecked) {
        await dispatch(selectCarts({ cartId })).unwrap();
      } else {
        await dispatch(unselectCarts({ cartId })).unwrap();
      }
      dispatch(fetchGetTotalPrice());
      dispatch(fetchCarts({ pageIndex, pageSize }));
      dispatch(setIsOpenDropdown(true));
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
      label: <Link to="/history-order">History order</Link>,
      icon: <HistoryOutlined />,
    },
    {
      key: "4",
      label: <Link to="/labs-management">My Tutorial Lab</Link>,
      icon: <PlaySquareOutlined />,
    },
    {
      key: "5",
      label: <Link to="/transaction-history">Transaction history</Link>,
      icon: <BarcodeOutlined />,
    },
    {
      key: "6",
      label: <Link to="/warranties">Warranty Request</Link>,
      icon: <IssuesCloseOutlined />,
    },
    { key: "7", label: "Logout", icon: <LogoutOutlined />, onClick: showModal },
  ];

  const menuCart =
    cart.length > 0
      ? [
          ...cart.map((item, index) => ({
            key: index,
            label: (
              <div className="flex gap-4 items-center justify-between p-2 hover:bg-gray-100 border-b border-gray-300 relative">
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
                <div className="flex-1 min-w-0">
                  <Link to={`/detail/${item.productId}`}>
                    <span className="font-medium line-clamp-2 break-words">
                      {item.productName}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <QuantityInput quantity={item.quantity} cartId={item.id} />
                  </div>
                </div>
                <span className="font-medium whitespace-nowrap text-red-500">
                  {item.price.toLocaleString()}₫
                </span>
                <CloseOutlined
                  className="text-gray-500 hover:text-red-500 cursor-pointer absolute top-2 right-2"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            ),
          })),
          {
            key: "total",
            label: (
              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-medium">Total price:</p>
                  <p className="text-lg font-semibold text-red-400">
                    {totalSelectedItemsPrice.toLocaleString()}₫
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="bg-headerBg text-white w-full"
                >
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

  // Main navigation items for mobile/tablet bottom bar
  const bottomNavItems = [
    { path: "/", icon: <HomeOutlined />, label: "Home" },
    { path: "/chat", icon: <MessageOutlined />, label: "Chat" },
    {
      path: "/cart",
      icon: <ShoppingCartOutlined />,
      label: "Cart",
      badge: true,
    },
    {
      custom: true,
      icon: <BellOutlined />,
      label: "Notification",
      component: <NotificationDropdown />,
      badge: notificationCount > 0,
    },
    {
      path: "/category",
      icon: <MenuOutlined />,
      label: "Category",
      onClick: showCategoryModal,
    },
  ];

  return (
    <>
      <nav
        className="bg-white border-b border-b-gray-300 relative"
        style={{ zIndex: 1051 }}
      >
        <div className="h-10 w-full bg-headerBg flex justify-center items-center text-white gap-2">
          <p>
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </p>
          <a href="#" className="font-semibold">
            Shop Now
          </a>
        </div>

        {/* Top row for tablet */}
        {screenWidth <= 1024 && (
          <div className="container mx-auto flex justify-between items-center px-6 py-2">
            <Link
              to="/"
              className="text-2xl font-bold text-[#007AFF] flex items-center space-x-2"
            >
              <img src={Logo} alt="Logo" className="w-12 h-12" />
            </Link>

            <div className="flex-1 mx-4">
              <Search
                size="large"
                className="w-full"
                placeholder="What are you looking for?"
              />
            </div>

            <button
              onClick={() => setIsDrawerVisible(true)}
              className="text-gray-700 text-2xl"
            >
              ☰
            </button>
          </div>
        )}

        {/* Desktop layout */}
        {screenWidth > 1024 && (
          <div className="container mx-auto flex justify-between items-center px-6">
            <Link
              to="/"
              className="text-2xl font-bold text-[#007AFF] flex items-center space-x-2"
            >
              <img src={Logo} alt="Logo" className="w-16 h-16" />
              <p>IOTS</p>
            </Link>

            <ul className="flex space-x-8 text-gray-700 justify-center items-center">
              <Button
                ref={categoryButtonRef}
                className="rounded-md bg-blue-50 text-gray-600 border-none font-semibold"
                onClick={showCategoryModal}
              >
                <MenuOutlined /> Category
              </Button>
              {isCategoryModalVisible && (
                <div className="py-6">
                  <div
                    className="absolute bg-white shadow-lg rounded-sm scroll-y"
                    style={{
                      top: `${105}px`,
                      left: `${left}px`,
                      zIndex: 1050,
                      width: "300px",
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      {activeData.map((category) => (
                        <div
                          key={category.id}
                          className="p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex gap-2"
                        >
                          <ProductOutlined />
                          <p className="font-semibold">{category.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    style={{ top: "105px", left: 0, right: 0, bottom: 0 }}
                    onClick={handleCategoryModalCancel}
                  ></div>
                </div>
              )}
              <li>
                <Link to="/" className="hover:text-[#007AFF] cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#007AFF] cursor-pointer"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#007AFF] cursor-pointer"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/StoreEmail"
                  className="hover:text-[#007AFF] cursor-pointer"
                >
                  <b className="font-normal">Become Store & Trainer</b>
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-6">
              <Search
                size="large"
                className="w-[250px]"
                placeholder="What are you looking for?"
              />
              <Link to="/chat">
                <MessageOutlined className="text-gray-700 text-[22px] hover:text-blue-500" />
              </Link>
              <Dropdown
                menu={{ items: menuCart }}
                overlayStyle={{
                  width: "23vw",
                  borderRadius: "10px",
                  border: "1px solid #f0f0f0",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
                trigger={["hover"]}
                open={isDropdownOpen}
                onOpenChange={(open) => dispatch(setIsOpenDropdown(open))}
              >
                <Space
                  className="cursor-pointer"
                  onClick={() => navigate("/cart")}
                >
                  <Badge count={handleTotalProduct()}>
                    <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
                  </Badge>
                </Space>
              </Dropdown>
              <NotificationDropdown />
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
                    <UserOutlined className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer" />
                  </Space>
                </Dropdown>
              ) : (
                <Dropdown
                  menu={{ items: menuItemsLogin }}
                  overlayStyle={{
                    width: "12vw",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                  }}
                  getPopupContainer={() => document.body}
                >
                  <Space>
                    <UserOutlined className="text-[21px] text-white bg-headerBg p-2 rounded-full cursor-pointer" />
                  </Space>
                </Dropdown>
              )}
            </div>
          </div>
        )}

        {/* Mobile/Tablet Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          width={250}
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="hover:text-[#007AFF] cursor-pointer"
              onClick={() => setIsDrawerVisible(false)}
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#007AFF] cursor-pointer"
              onClick={() => setIsDrawerVisible(false)}
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="hover:text-[#007AFF] cursor-pointer"
              onClick={() => setIsDrawerVisible(false)}
            >
              About
            </Link>
            <Link
              to="/StoreEmail"
              className="hover:text-[#007AFF] cursor-pointer"
              onClick={() => setIsDrawerVisible(false)}
            >
              Become Store & Trainer
            </Link>
          </div>
        </Drawer>

        <Modal
          title="Confirm Logout"
          open={isModalVisible}
          onOk={handleLogout}
          onCancel={() => setIsModalVisible(false)}
          okText="Logout"
          cancelText="Cancel"
          zIndex={1111}
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </nav>

      {/* Fixed Bottom Navigation Bar for Mobile/Tablet */}
      {screenWidth <= 1024 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#007AFF] shadow-lg z-50">
          <div className="container mx-auto">
            <div className="flex justify-around py-2">
              {bottomNavItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-white"
                >
                  {item.custom ? (
                    <Dropdown
                      overlay={item.component}
                      trigger={["click"]}
                      placement="topRight"
                    >
                      <div className="flex flex-col items-center cursor-pointer">
                        <div className="text-xl">
                          {item.badge ? (
                            <Badge count={notificationCount} offset={[-5, 5]}>
                              {item.icon}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </div>
                        <span className="text-xs mt-1">{item.label}</span>
                      </div>
                    </Dropdown>
                  ) : item.onClick ? (
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={item.onClick}
                    >
                      <div className="text-xl">{item.icon}</div>
                      <span className="text-xs mt-1">{item.label}</span>
                    </div>
                  ) : (
                    <Link to={item.path} className="flex flex-col items-center">
                      <div className="text-xl">
                        {item.badge ? (
                          <Badge count={handleTotalProduct()} offset={[-5, 5]}>
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
                      </div>
                      <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
