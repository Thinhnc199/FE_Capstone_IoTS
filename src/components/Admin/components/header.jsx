import { BellOutlined } from "@ant-design/icons";
import Logo from "../../../assets/icons/logo2";
export default function Header() {
  const avatarUrl =
    "https://vietlucoder.id.vn/img/Picsart_23-06-13_14-41-05-648.png";

  return (
    <div className="h-4.2rem bg-white flex justify-between">
      {/* <h1 className="text-blue-500 px-10 font-sans2">IOTS SHOP</h1> */}
      <Logo />

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
