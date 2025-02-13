import Home from "../pages/Home";
import Login from "../pages/Login";
import RegisterEmail from "../pages/RegisterEmail";
import VerifyOtp from "../pages/VerifyOtp";
import ContactPage from "../pages/ContactPage";
import RegisterCustomer from "../pages/RegisterCustomer";
import EmailOtpPage from "../pages/StoreRes/EmailOtpPage";
import OtpUserInfoPage from "../pages/StoreRes/OtpUserInfoPage";
import StoreRegistration from "../components/StoreIoT/StoreRegistration";

// Admin Pages
import DashBoard from "../components/Admin/DashBoard";
import ListAccount from "../components/Admin/ListAccount";
import ListProduct from "../components/Admin/ListProduct";
import Profile from "../components/Admin/Profile";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import WelcomeStore from "../components/StoreIoT/WelcomeStore";
import StoreLayout from "../components/StoreIoT/StoreLayout";

/* ===========================
 PUBLIC ROUTES (NO AUTH )
=========================== */
const publicRoute = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Home, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
  { path: "/verifyOtp", component: VerifyOtp, layout: MainLayout },
  { path: "/registerCustomer", component: RegisterCustomer, layout: MainLayout },
  { path: "/StoreEmail", component: EmailOtpPage, layout: MainLayout },
  { path: "/OtpRegister", component: OtpUserInfoPage, layout: MainLayout },
  { path: "/contact", component: ContactPage, layout: MainLayout },
  //  { path: "/store/resgisterStore", component: StoreRegistration, layout: StoreLayout },
];

/* ===========================
PRIVATE ROUTES 
=========================== */
const privateRoute = [
  { path: "/admin", component: DashBoard, layout: AdminLayout, roles: [1] }, 
  { path: "/admin/list-account", component: ListAccount, layout: AdminLayout, roles: [1] },
  { path: "/admin/list-product", component: ListProduct, layout: AdminLayout, roles: [1] },
  { path: "/admin/profile", component: Profile, layout: AdminLayout, roles: [1] },

  { path: "/store/welcome", component: WelcomeStore, layout: StoreLayout, roles: [6] },
  { path: "/store/registerStore", component: StoreRegistration, layout: StoreLayout, roles: [6] }

];

export { publicRoute, privateRoute };
