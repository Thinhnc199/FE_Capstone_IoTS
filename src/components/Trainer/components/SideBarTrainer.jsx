import { Link } from "react-router-dom";
import Logo from "../../../assets/icons/logo2";

import {
  ProductOutlined,
  WalletOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const items2 = [
  {
    key: "sub1",
    icon: <BarChartOutlined />,
    label: <Link to="/trainer/dashboard">DashBoard</Link>,
  },

  {
    key: "sub2",
    icon: <ProductOutlined />,
    label: "Labs",
    children: [
      { key: "lp", label: <Link to="/trainer/labs-management">List Lab</Link> },
    ],
  },

  {
    key: "sub6",
    icon: <WalletOutlined />,
    label: <Link to="/trainer/wallet">Wallet</Link>,
  },
];

const SideBarTrainer = () => {
  return (
    <div className=" font-sans3 border-r bg-white space-y-5">
      <div>
        <Logo />
      </div>

      <Menu
        mode="inline"
        // defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{
          height: "100%",
          border: "none",
          colorItemBgSelected: "red",
        }}
        items={items2}
        className="font-semibold [&_.ant-menu-submenu_.ant-menu]:!bg-white [&_.ant-menu-item:hover]:!bg-[#ebf5ff]
[&_.ant-menu-submenu-title:hover]:!bg-[#ebf5ff]"
        StyledSubMenu
      />

      <hr className="m-4" />
    </div>
  );
};

export default SideBarTrainer;
