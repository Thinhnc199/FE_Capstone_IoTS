import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterEmail from "../pages/RegisterEmail";
import VerifyOtp from "../pages/VerifyOtp";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import ListAccount from "../components/Admin/ListAccount";
import ListProduct from "../components/Admin/ListProduct";
import DashBoard from "../components/Admin/DashBoard";
import Profile from "../components/Admin/Profile";
import RegisterCustomer from "../pages/RegisterCustomer";
import ContactPage from "../pages/ContactPage";
import ErrorPage from "../pages/ErrorPage";
import CreateManagerStaff from "../components/Admin/CreateManagerStaff";
import VerifyAccount from "../pages/VerifyAccount";
import UserRequest from "../components/Admin/UserRequest";
import DetailUserRequest from "../components/Admin/DetailUserRequest";
import AdminAccount from "../components/Admin/AdminAccount";
import StaffAccount from "../components/Admin/StaffAccount";
import ManagerAccount from "../components/Admin/ManagerAccount";
import CustomerAccount from "../components/Admin/CustomerAccount";
import StoreAccount from "../components/Admin/StoreAccount";

// const role = localStorage.getItem("userRole");

const publicRoute = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Home, layout: MainLayout },
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
  { path: "/verifyOtp", component: VerifyOtp, layout: MainLayout },
  { path: "/verifyaccount/:id", component: VerifyAccount, layout: MainLayout },
  { path: "*", component: ErrorPage, layout: null },
  {
    path: "/registerCustomer",
    component: RegisterCustomer,
    layout: MainLayout,
  },
  {
    path: "/contact",
    component: ContactPage,
    layout: MainLayout,
  },
  { path: "/admin", component: DashBoard, layout: AdminLayout },
  { path: "/admin/dashboard", component: DashBoard, layout: AdminLayout },
  {
    path: "/admin/list-account",
    component: ListAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/admin-account",
    component: AdminAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/staff-account",
    component: StaffAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/manager-account",
    component: ManagerAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/customer-account",
    component: CustomerAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/store-account",
    component: StoreAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/list-product",
    component: ListProduct,
    layout: AdminLayout,
  },

  {
    path: "/admin/Profile",
    component: Profile,
    layout: AdminLayout,
  },
  {
    path: "/admin/create-manager-staff",
    component: CreateManagerStaff,
    layout: AdminLayout,
  },
  {
    path: "/admin/userRequest",
    component: UserRequest,
    layout: AdminLayout,
  },
  {
    path: "/admin/userRequest/:id",
    component: DetailUserRequest,
    layout: AdminLayout,
  },
];

// if (role == "ADMIN") {
//   publicRoute.push({
//     path: "/admin",
//     component: AccountList,
//     layout: AdminPage,
//   });

// }

const privateRoute = [];
export { publicRoute, privateRoute };
