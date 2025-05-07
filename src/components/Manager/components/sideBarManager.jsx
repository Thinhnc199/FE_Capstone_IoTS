import { Link } from "react-router-dom";
import Logo from "../../../assets/icons/logo2";

import { HomeOutlined, ProductOutlined } from "@ant-design/icons";
import { Menu } from "antd";

const items2 = [
  {
    key: "sub1",
    icon: <HomeOutlined />,
    label: <Link to="/manager/dashboard">DashBoard</Link>,
  },

  {
    key: "sub3",
    icon: <ProductOutlined />,
    label: "Products",
    children: [
      { key: "lp", label: <Link to="/manager/list-product">Devices Management</Link> },
      {
        key: "cm",
        label: (
          <Link to="/manager/category-management">Categories Management</Link>
        ),
      },
      {
        key: "mcombo",
        label: <Link to="/manager/combos-management">Combos Management</Link>,
      },
      {
        key: "mlab",
        label: <Link to="/manager/labs-management">Labs Management</Link>,
      },
    ],
  },

  // {
  //   key: "sub4",
  //   icon: <PullRequestOutlined />,
  //   label: "Request",
  //   children: [
  //     {
  //       key: "userrequest",
  //       label: <Link to="/staff/user-request">User Requests</Link>,
  //       icon: <UnorderedListOutlined />,
  //     },
  //     {
  //       key: "cashrequest",
  //       label: <Link to="/staff/wallet">Cashout Requests</Link>,
  //       icon: <UnorderedListOutlined />,
  //     },
  //     {
  //       key: "report",
  //       label: <Link to="/staff/report-request">Report Requests</Link>,
  //       icon: <UnorderedListOutlined />,
  //     },
  //   ],
  // },
];

const SideBarManager = () => {
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

export default SideBarManager;
