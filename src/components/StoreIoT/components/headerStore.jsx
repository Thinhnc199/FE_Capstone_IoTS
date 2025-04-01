import { Modal, Button, Dropdown, Space, Badge } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../../redux/slices/sidebarSlice";
import {
  fetchNotifications,
  markAllAsRead,
} from "./../../../redux/slices/notificationSlice";
import { Link } from "react-router-dom";
import {
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import moment from "moment";

export default function HeaderStore() {
  const dispatch = useDispatch();
  const avatarUrl =
    "https://vietlucoder.id.vn/img/Picsart_23-06-13_17-33-04-543.png";
  const { isSidebarOpen } = useSelector((state) => state.sidebar);
  const { notifications = [], unreadCount = 0 } = useSelector(
    (state) => state.notification || {}
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

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
    localStorage.removeItem("storeId");
    navigate("/login");
  };

  // Menu cho Dropdown thông báo
  const notificationMenu = (
    <div className="w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200">
      {notifications.length > 0 ? (
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
      label: <Link to="/store/transaction-history">Transaction history</Link>,
      icon: <HistoryOutlined />,
    },
    {
      key: "4",
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
          <Dropdown
            overlay={notificationMenu}
            trigger={["click"]}
            onVisibleChange={(visible) => !visible && handleMenuClose()}
          >
            <Badge count={unreadCount} size="small" className="cursor-pointer">
              <BellOutlined className="text-xl" />
            </Badge>
          </Dropdown>

          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex justify-between items-center font-sans flex-col">
            <p className="text-xs">vietle</p>
            <p className="text-sm text-orange-400">Store</p>
          </div>

          <Dropdown
            menu={{
              items,
            }}
            overlayStyle={{
              width: "12vw",
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

// import { Modal, Button, Dropdown, Space, Badge } from "antd";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toggleSidebar } from "../../../redux/slices/sidebarSlice";
// import { Link } from "react-router-dom";
// import {
//   DownOutlined,
//   EditOutlined,
//   LogoutOutlined,
//   BellOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   HistoryOutlined,
// } from "@ant-design/icons";
// export default function HeaderStore() {
//   const dispatch = useDispatch();
//   const avatarUrl =
//     "https://vietlucoder.id.vn/img/Picsart_23-06-13_17-33-04-543.png";
//   const { isSidebarOpen } = useSelector((state) => state.sidebar);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const navigate = useNavigate();
//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("requestId");
//     localStorage.removeItem("username");
//     localStorage.removeItem("role");
//     localStorage.removeItem("imageUrl");
//     localStorage.removeItem("storeId");
//     navigate("/login");
//   };
//   const items = [
//     {
//       key: "1",
//       label: <p className="font-semibold text-gray-700 text-sm">My Account</p>,
//       disabled: true,
//     },
//     {
//       type: "divider",
//     },
//     {
//       key: "2",
//       label: "Profile",
//       icon: <EditOutlined />,
//     },
//     {
//       key: "3",
//       label: <Link to="/store/transaction-history">Transaction history</Link>,
//       icon: <HistoryOutlined />,
//     },
//     {
//       key: "4",
//       label: "Logout",
//       icon: <LogoutOutlined />,

//       onClick: showModal,
//     },
//   ];
//   return (
//     <div className="h-4.2rem bg-white flex justify-between border-b ">
//       <Button
//         type="text"
//         icon={isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//         onClick={() => dispatch(toggleSidebar())}
//         style={{
//           fontSize: "16px",
//           width: 64,
//           height: 64,
//         }}
//       />

//       <div className="p-4  font-sans font-bold text-2xl flex items-center space-x-2">
//         <div className="flex items-center space-x-3">
//           <Badge count={5} size="small" className="">
//             {" "}
//             <BellOutlined className="text-xl" />{" "}
//           </Badge>

//           <img
//             src={avatarUrl}
//             alt="User Avatar"
//             className="w-9 h-9 rounded-full"
//           />
//           <div className=" flex justify-between items-center font-sans flex-col ">
//             <p className="text-xs">vietle</p>
//             <p className="text-sm text-orange-400">Store</p>
//           </div>

//           <Dropdown
//             menu={{
//               items,
//             }}
//             overlayStyle={{
//               width: "10vw",
//               borderRadius: "10px",
//               border: "1px solid #f0f0f0",
//             }}
//           >
//             <a onClick={(e) => e.preventDefault()}>
//               <Space>
//                 <DownOutlined className="text-sm text-gray-400" />
//               </Space>
//             </a>
//           </Dropdown>
//         </div>
//       </div>

//       <Modal
//         title="Confirm Logout"
//         open={isModalVisible}
//         onOk={handleLogout}
//         onCancel={() => setIsModalVisible(false)}
//         okText="Logout"
//         cancelText="Cancel"
//       >
//         <p>Are you sure you want to logout?</p>
//       </Modal>
//     </div>
//   );
// }
