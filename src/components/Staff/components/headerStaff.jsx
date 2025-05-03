import { Modal, Button, Dropdown, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../../redux/slices/sidebarSlice";
import useNotification from "../../../utils/useNotification.jsx";
import {
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

export default function HeaderStaff() {
  const dispatch = useDispatch();
  const avatarUrl =
    "https://vietlucoder.id.vn/img/Picsart_23-06-13_14-41-05-648.png";
  const { isSidebarOpen } = useSelector((state) => state.sidebar);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const navigate = useNavigate();
  const { NotificationDropdown } = useNotification();
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
    localStorage.clear();
    window.location.href = "/login";
  };

  const items = [
    {
      key: "1",
      label: <p className="font-semibold text-gray-700 text-sm">My Account</p>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      icon: <EditOutlined />,
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: showModal,
    },
  ];

  return (
    <div className="h-4.2rem bg-white flex justify-between border-b">
      <Button
        type="text"
        icon={isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(toggleSidebar())}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      <div className="p-4 font-sans font-bold text-2xl flex items-center space-x-2">
        <div className="flex items-center space-x-3">
          <NotificationDropdown />
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex justify-between items-center font-sans flex-col">
            <p className="text-xs">Tan nam</p>
            <p className="text-sm text-textColer">Staff</p>
          </div>

          <Dropdown
            menu={{
              items,
            }}
            overlayStyle={{
              width: "10vw",
              borderRadius: "10px",
              border: "1px solid #f0f0f0",
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <DownOutlined className="text-sm text-gray-400" />
              </Space>
            </a>
          </Dropdown>
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
    </div>
  );
}
