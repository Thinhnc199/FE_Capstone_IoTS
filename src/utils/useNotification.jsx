import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllAsRead } from "../redux/slices/notificationSlice"; // Điều chỉnh đường dẫn nếu cần
import { Dropdown, Badge } from "antd";
import { BellOutlined, LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const useNotification = () => {
  const dispatch = useDispatch();
  const { notifications = [], unreadCount = 0, loading = false } = useSelector(
    (state) => state.notification || {}
  );
  const token = localStorage.getItem("token");

  // Fetch notifications khi đã đăng nhập
  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, token]);

  // Menu cho Dropdown thông báo
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

  // Xử lý khi đóng dropdown
  const handleMenuClose = () => {
    dispatch(markAllAsRead());
  };

  // Trả về component Dropdown để sử dụng
  const NotificationDropdown = () =>
    token ? (
      <Dropdown
        overlay={notificationMenu}
        trigger={["click"]}
        onVisibleChange={(visible) => !visible && handleMenuClose()}
      >
        <Badge count={unreadCount} size="small" className="cursor-pointer">
          <BellOutlined className="text-xl" />
        </Badge>
      </Dropdown>
    ) : null;

  return { NotificationDropdown, notifications, unreadCount, loading };
};

export default useNotification;