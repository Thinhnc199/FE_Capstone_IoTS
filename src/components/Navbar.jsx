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
  HeartOutlined,
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
  BellOutlined,
  LoadingOutlined,
  BarcodeOutlined,
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
import {
  fetchNotifications,
  markAllAsRead,
} from "../redux/slices/notificationSlice";
import QuantityInput from "./common/QuantityInput";
import moment from "moment";
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
  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
  } = useSelector((state) => state.notification || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, token]);

  const showModal = () => setIsModalVisible(true);
  const showCategoryModal = () => setIsCategoryModalVisible(true);
  const handleCategoryModalCancel = () => setIsCategoryModalVisible(false);

  const notificationMenu = (
    <div className="w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200">
      {loading ? (
        <div className="p-3 text-center text-gray-500">
          <LoadingOutlined spin /> Loading...
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3 border-b border-gray-100 ${
              notif.isRead ? "text-gray-500" : "text-gray-800 font-semibold"
            } hover:bg-gray-50`}
          >
            <p className="text-sm mb-1">{notif.title}</p>
            <p className="text-xs text-gray-400">
              {moment(notif.createdDate).format("DD-MM-YYYY HH:mm:ss")}
            </p>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-gray-500">No notifications</div>
      )}
    </div>
  );

  const handleMenuClose = () => {
    dispatch(markAllAsRead());
  };

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

  const { top, left } = getCategoryButtonPosition();

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
      icon: <BarcodeOutlined  />,
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

  return (
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
          <Link to="/wishlist">
            <HeartOutlined className="text-gray-700 text-[25px] hover:text-red-500" />
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
            <Space className="cursor-pointer" onClick={() => navigate("/cart")}>
              <Badge count={handleTotalProduct()}>
                <ShoppingCartOutlined className="text-gray-700 text-[25px] hover:text-headerBg" />
              </Badge>
            </Space>
          </Dropdown>
          <Dropdown
            overlay={notificationMenu}
            trigger={["click"]}
            onVisibleChange={(visible) => !visible && handleMenuClose()}
          >
            <Badge count={unreadCount} size="small" className="cursor-pointer">
              <BellOutlined className="text-xl" />
            </Badge>
          </Dropdown>
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
  );
};

export default Navbar;
