import Home from "../pages/Home/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterEmail from "../pages/RegisterEmail";
import VerifyOtp from "../pages/VerifyOtp";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import ListAccount from "../components/Admin/ListAccount";
import ListProducts from "../components/Admin/ProductsManageAdmin/ListProducts";
import DashBoard from "../components/Admin/DashBoard";
import Profile from "../components/Admin/Profile";
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
import TrainerAccount from "../components/Admin/TrainerAccount";
import StoreLayout from "../components/StoreIoT/StoreLayout";
import StoreIotLayout from "../components/StoreIoT/StoreIotLayout";
import WelcomeStore from "../components/StoreIoT/WelcomeStore";
import StoreRegistration from "../components/StoreIoT/StoreRegistration";
import EmailOtpPage from "./../pages/StoreRes/EmailOtpPage";
import OtpUserInfoPage from "../pages/StoreRes/OtpUserInfoPage";
import PaymentMembershipPage from "../components/StoreIoT/PaymentMembershipPage";
import TrainerRegister from "../components/Trainer/TrainerResgister";
import TrainerLayout from "../components/Trainer/TrainerLayout";
import DashBoardStore from "../components/StoreIoT/DashBoardStore";
import WalletStore from "../components/StoreIoT/WalletStore";
import ListProductStore from "../components/StoreIoT/ListProductStore";
// const allowedroles = localStorage.getItem("userAllowedRoles");
import Test from "../components/test";
import AccessRestricted from "../pages/AccessRestricted";
import CheckStatus from "../components/StoreIoT/CheckStatus";
import SubmissionSuccess from "../components/StoreIoT/SubmissionSuccess";
import RegisterCustomer from "../pages/RegisterCustomer";
import CategoryManagement from "../components/Admin/ProductsManageAdmin/CategoryManagement";
import DetailProducts from "../components/Customer/DetailProducts";
// const publicRoute = [
//   { path: "/", component: Home, layout: MainLayout },
//   { path: "/home", component: Test, layout: MainLayout },
//   { path: "/register", component: Register, layout: MainLayout },
//   { path: "/login", component: Login, layout: MainLayout },
//   { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
//   { path: "/verifyOtp", component: VerifyOtp, layout: MainLayout },
//   { path: "/verifyaccount/:id", component: VerifyAccount, layout: MainLayout },
//   { path: "*", component: ErrorPage, layout: null },
//   { path: "/Access-Restricted", component: AccessRestricted, layout: null },
//   { path: "/registerCustomer", component: RegisterCustomer, layout: MainLayout },
//   { path: "/StoreEmail", component: EmailOtpPage, layout: MainLayout },
//   { path: "/OtpRegister", component: OtpUserInfoPage, layout: MainLayout },
//   { path: "/contact", component: ContactPage, layout: MainLayout },
// ];

// const privateRoute = [
//   // Admin Routes
//   { path: "/admin", component: DashBoard, layout: AdminLayout },
//   { path: "/admin/dashboard", component: DashBoard, layout: AdminLayout },
//   { path: "/admin/list-account", component: ListAccount, layout: AdminLayout },
//   { path: "/admin/admin-account", component: AdminAccount, layout: AdminLayout },
//   { path: "/admin/staff-account", component: StaffAccount, layout: AdminLayout },
//   { path: "/admin/manager-account", component: ManagerAccount, layout: AdminLayout },
//   { path: "/admin/customer-account", component: CustomerAccount, layout: AdminLayout },
//   { path: "/admin/store-account", component: StoreAccount, layout: AdminLayout },
//   { path: "/admin/trainer-account", component: TrainerAccount, layout: AdminLayout },
//   { path: "/admin/list-product", component: ListProduct, layout: AdminLayout },
//   { path: "/admin/profile", component: Profile, layout: AdminLayout },
//   { path: "/admin/create-manager-staff", component: CreateManagerStaff, layout: AdminLayout },
//   { path: "/admin/user-request", component: UserRequest, layout: AdminLayout },
//   { path: "/admin/user-request/:id", component: DetailUserRequest, layout: AdminLayout },

//   // Store Routes
//   { path: "/store/registerStore", component: StoreRegistration, layout: StoreLayout },
//   { path: "/store/welcome", component: WelcomeStore, layout: StoreLayout },
//   { path: "/store/payment-packages", component: PaymentMembershipPage, layout: StoreLayout },
//   { path: "/store/dashboard", component: DashBoardStore, layout: StoreIotLayout },
//   { path: "/store/wallet", component: WalletStore, layout: StoreIotLayout },
//   { path: "/store/list-product", component: ListProductStore, layout: StoreIotLayout },

//   // Trainer Routes
//   { path: "/trainer/registerTrainer", component: TrainerRegister, layout: TrainerLayout },
// ];

// export { publicRoute, privateRoute };

const publicRoute = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Test, layout: MainLayout },
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
  { path: "/verifyOtp", component: VerifyOtp, layout: MainLayout },
  { path: "/verifyaccount/:id", component: VerifyAccount, layout: MainLayout },
  { path: "*", component: ErrorPage, layout: null },
  { path: "/Access-Restricted", component: AccessRestricted, layout: null },
  {
    path: "/register-Customer",
    component: RegisterCustomer,
    layout: MainLayout,
  },
  { path: "/StoreEmail", component: EmailOtpPage, layout: MainLayout },
  { path: "/OtpRegister", component: OtpUserInfoPage, layout: MainLayout },
  {
    path: "/contact",
    component: ContactPage,
    layout: MainLayout,
  },
  {
    path: "/:id",
    component: DetailProducts,
    layout: MainLayout,
  },
  // Admin
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
    path: "/admin/trainer-account",
    component: TrainerAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/list-product",
    component: ListProducts,
    layout: AdminLayout,
  },
  {
    path: "/admin/category-management",
    component: CategoryManagement,
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
    path: "/admin/user-request",
    component: UserRequest,
    layout: AdminLayout,
  },
  {
    path: "/admin/user-request/:id",
    component: DetailUserRequest,
    layout: MainLayout,
  },

  // Store
  {
    path: "/store/registerStore",
    component: StoreRegistration,
    layout: StoreLayout,
  },
  {
    path: "/store/welcome",
    component: WelcomeStore,
    layout: StoreLayout,
  },
  {
    path: "/store/payment-packages",
    component: PaymentMembershipPage,
    layout: StoreLayout,
  },
  {
    path: "/trainer/registerTrainer",
    component: TrainerRegister,
    layout: TrainerLayout,
  },
  {
    path: "/store/dashboard",
    component: DashBoardStore,
    layout: StoreIotLayout,
  },
  {
    path: "/store/wallet",
    component: WalletStore,
    layout: StoreIotLayout,
  },
  {
    path: "/store/list-product",
    component: ListProductStore,
    layout: StoreIotLayout,
  },
  {
    path: "/store/status",
    component: CheckStatus,
    layout: StoreLayout,
  },
  {
    path: "/store/submission-Success",
    component: SubmissionSuccess,
    layout: StoreLayout,
  },
];

// if (allowedroles == "ADMIN") {
//   publicRoute.push({
//     path: "/admin",
//     component: AccountList,
//     layout: AdminPage,
//   });
// }

const privateRoute = [];
export { publicRoute, privateRoute };
// { path: "/store/welcome", component: WelcomeStore, layout: StoreLayout, allowedroless: [6] },
//   { path: "/store/registerStore", component: StoreRegistration, layout: StoreLayout, allowedroless: [6] }
