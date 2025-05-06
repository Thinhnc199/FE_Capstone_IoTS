import { Link } from "react-router-dom";
import Logo from "../../../assets/icons/logo2";

import {
  PullRequestOutlined,
  UserOutlined,
  HomeOutlined,
  ProductOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const items2 = [
  {
    key: "sub1",
    icon: <HomeOutlined />,
    label: <Link to="/admin/dashboard">DashBoard</Link>,
  },
  {
    key: "sub2",
    icon: <UserOutlined />,
    label: "Accounts",
    backgroundColor: "white",
    children: [
      // {
      //   key: "la",
      //   label: <Link to="/admin/list-account">List Account</Link>,
      //   icon: <UnorderedListOutlined />,
      // },
      // {
      //   key: "admin",
      //   label: <Link to="/admin/admin-account">Admin Account</Link>,
      //   icon: <UnorderedListOutlined />,
      // },
      {
        key: "staff",
        label: <Link to="/admin/staff-account">Staff Account</Link>,
        icon: <UnorderedListOutlined />,
      },

      {
        key: "manager",
        label: <Link to="/admin/manager-account">Manager Account</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "store",
        label: <Link to="/admin/store-account">Store Account</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "trainer",
        label: <Link to="/admin/trainer-account">Trainer Account</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "customer",
        label: <Link to="/admin/customer-account">Customer Account</Link>,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    key: "sub3",
    icon: <ProductOutlined />,
    label: "Products",
    children: [
      { key: "lp", label: <Link to="/admin/list-product">Devices Management</Link> },
      {
        key: "cm",
        label: (
          <Link to="/admin/category-management">Categories Management</Link>
        ),
      },
      {
        key: "mcombo",
        label: <Link to="/admin/combos-management">Combos Management</Link>,
      },
      {
        key: "mlab",
        label: <Link to="/admin/labs-management">Labs Management</Link>,
      },
    ],
  },
  // {
  //   key: "sub5",
  //   icon: <HistoryOutlined />,

  //   label: <Link to="/admin/manage-history-order"> History Order</Link>,
  // },
  {
    key: "sub4",
    icon: <PullRequestOutlined />,
    label: "Request",
    children: [
      {
        key: "userrequest",
        label: <Link to="/admin/user-request">User Requests</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "cashrequest",
        label: <Link to="/admin/cashout-requests">Cashout Requests</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "report",
        label: <Link to="/admin/report-request">Report Requests</Link>,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
];

const SidebarAdmin = () => {
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

export default SidebarAdmin;
