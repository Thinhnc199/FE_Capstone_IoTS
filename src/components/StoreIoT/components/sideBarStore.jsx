import { Link } from "react-router-dom";
import Logo from "../../../assets/icons/logo2";

import {
  ProductOutlined,
  // WalletOutlined,
  BarChartOutlined,
  ReadOutlined,
  AppstoreAddOutlined,
  HistoryOutlined,
  IssuesCloseOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const items2 = [
  {
    key: "sub1",
    icon: <BarChartOutlined />,
    label: <Link to="/store/dashboard">DashBoard</Link>,
  },

  {
    key: "sub2",
    icon: <ProductOutlined />,
    label: "Products",
    children: [
      { key: "lp", label: <Link to="/store/list-product">Devices List</Link> },
    ],
  },
  {
    key: "sub3",
    icon: <AppstoreAddOutlined />,
    label: "Combos",
    children: [
      {
        key: "3a",
        label: <Link to="/store/combo-managerment">Combos List</Link>,
      },
      // { key: "5", label: <Link to="/store/add-device">Create Device</Link> },
    ],
  },
  {
    key: "sub4",
    icon: <ReadOutlined />,
    label: "Labs",
    children: [
      {
        key: "lm",
        label: <Link to="/store/labs-management">Labs List</Link>,
      },

      // {
      //   key: "cm",
      //   label: <Link to="/store/combo-labs">Combo Labs</Link>,
      // },

      // { key: "5", label: <Link to="/store/add-device">Create Device</Link> },
    ],
  },
  // {
  //   key: "sub5",
  //   icon: <SolutionOutlined />,
  //   label: <Link to="/store/labs-management">labs Request</Link>,
  // },
  {
    key: "sub6",
    icon: <HistoryOutlined />,
    label: <Link to="/store/manage-order">Orders</Link>,
  },
  {
    key: "sub7",
    icon: <IssuesCloseOutlined />,
    label: <Link to="/store/warranties-request">Warranties</Link>,
  },
  // {
  //   key: "sub8",
  //   icon: <WalletOutlined />,
  //   label: <Link to="/store/wallet">Wallet</Link>,
  // },
  {
    key: "sub9",
    icon: <SwapOutlined />,
    label: <Link to="/store/cashout-management">Cashout Management</Link>,
  },
  // {
  //   key: "sub3",
  //   icon: <PullRequestOutlined />,
  //   label: "Request",
  //   children: [
  //     {
  //       key: "userrequest",
  //       label: <Link to="/admin/user-request">User Requests</Link>,
  //       icon: <UnorderedListOutlined />,
  //     },
  //     {
  //       key: "productrequest",
  //       label: <Link to="/admin/product-request">Product Requests</Link>,
  //       icon: <UnorderedListOutlined />,
  //     },
  //   ],
  // },
];

const SidebarStore = () => {
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

export default SidebarStore;
