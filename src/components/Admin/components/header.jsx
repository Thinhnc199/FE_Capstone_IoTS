import { BellOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleSidebar } from "../../../redux/slices/sidebarSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
export default function Header() {
  const dispatch = useDispatch();
  const avatarUrl =
    "https://vietlucoder.id.vn/img/Picsart_23-06-13_14-41-05-648.png";
  const { isSidebarOpen } = useSelector((state) => state.sidebar);
  return (
    <div className="h-4.2rem bg-white flex justify-between border-b ">
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

      <div className="p-4  font-sans font-bold text-2xl flex items-center space-x-2">
        <div className="flex items-center space-x-3">
          <BellOutlined className="text-xl" />

          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-9 h-9 rounded-full"
          />
          <div className=" flex justify-between items-center font-sans flex-col ">
            <p className="text-xs">vietle</p>
            <p className="text-sm text-textColer">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
