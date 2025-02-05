import { Link } from "react-router-dom";
import Logo from "../../../assets/icons/logo2";
import "./custom.css";
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
      {
        key: "la",
        label: <Link to="/admin/list-account">List Account</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "admin",
        label: <Link to="/admin/admin-account">Admin Account</Link>,
        icon: <UnorderedListOutlined />,
      },
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
      { key: "lp", label: <Link to="/admin/list-product">List products</Link> },
      { key: "5", label: <Link to="/add-device">Add Device</Link> },
    ],
  },
  {
    key: "sub4",
    icon: <PullRequestOutlined />,
    label: "Request",
    children: [
      {
        key: "userrequest",
        label: <Link to="/admin/userRequest">User Requests</Link>,
        icon: <UnorderedListOutlined />,
      },
      {
        key: "userrequest",
        label: <Link to="/admin/userRequest">Product Requests</Link>,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
];

const Sidebar = () => {
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
        className="font-semibold "
        StyledSubMenu
      />

      <hr className="m-4" />
    </div>
  );
};

export default Sidebar;
