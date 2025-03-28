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
import TrainerIotLayout from "../components/Trainer/TrainerIotLayout";
import TrainerRegister from "../components/Trainer/TrainerResgister";
import TrainerLayout from "../components/Trainer/TrainerLayout";
import DashBoardTrainer from "../components/Trainer/DashBoardTrainer";
import DashBoardStore from "../components/StoreIoT/DashBoardStore";
import WalletStore from "../components/StoreIoT/WalletStore";
import ListProductStore from "../components/StoreIoT/ListProductStore";
import Test from "../components/test";
import AccessRestricted from "../pages/AccessRestricted";
import CheckStatus from "../components/StoreIoT/CheckStatus";
import SubmissionSuccess from "../components/StoreIoT/SubmissionSuccess";
import RegisterCustomer from "../pages/RegisterCustomer";
import CategoryManagement from "../components/Admin/ProductsManageAdmin/CategoryManagement";
import HistoryOrder from "../pages/HistoryOrder";
import ComboTable from "../components/StoreIoT/components/ComboTable";
import Teststore from "../components/StoreIoT/Teststore";
import Checkout from "../pages/Checkout/Checkout";
import DetailProducts from "../pages/DetailProducts";
import ViewAllProduct from "../pages/ViewAllProduct";
import CartProducts from "../pages/CartProducts";
import ComboList from "../pages/Home/components/ComboList";
import ComboDetail from "../pages/ComboDetail";
import ComboUpdatePage from "../components/StoreIoT/components/ComboUpdatePage";
import AddressSelector from "../components/StoreIoT/components/AddressSelector";
import CreateProductPage from "../components/StoreIoT/CreateProductPage";
import CheckProcessOrder from "../pages/CheckProcessOrder";
import CreateLab from "../components/Trainer/CreateLab";

import AboutIoTs from "../pages/AboutIoTs";
import LabRequest from "../components/StoreIoT/LabRequest";
import LabDetail from "../components/StoreIoT/LabDetail";
import StoreLabsManagement from "../components/StoreIoT/StoreLabsManagement";
import ComboLabsManagement from "../components/StoreIoT/ComboLabsManagement";
import ProfilePage from "../pages/Profile/ProfilePage";
import StoreInfoPage from "../pages/StoreInfoPage";
import CustomerLabsManagement from "../pages/labs/CustomerLabsManagement";
import CustomerLabDetail from "../pages/labs/CustomerLabDetail";
import TrainerLabsManagement from "../components/Trainer/TrainerLabsManagement";
import LabDetailTrainer from "../components/Trainer/LabDetailTrainer";
import NewCreateLab from "../components/Trainer/NewCreLab";
import ComboPage from "../pages/Home/ComboPage";
import ManageHistoryOrder from "../components/StoreIoT/ManageHistoryOrder";
const publicRoute = [
  { path: "/test", component: Test, layout: TrainerLayout },
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Home, layout: MainLayout },
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  { path: "/about", component: AboutIoTs, layout: MainLayout },
  { path: "/combos", component: ComboPage, layout: MainLayout },
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
    path: "/view-all",
    component: ViewAllProduct,
    layout: MainLayout,
  },
  {
    path: "/cart",
    component: CartProducts,
    layout: MainLayout,
  },
  {
    path: "/checkout",
    component: Checkout,
    layout: null,
  },
  {
    path: "/history-order",
    component: HistoryOrder,
    layout: MainLayout,
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: MainLayout,
  },
  {
    path: "/shop-infomation/:id",
    component: StoreInfoPage,
    layout: MainLayout,
  },
  {
    path: "/checkout-process-order",
    component: CheckProcessOrder,
    layout: null,
  },
  {
    path: "/detail/:id",
    component: DetailProducts,
    layout: MainLayout,
  },
  {
    path: "/combo-list",
    component: ComboList,
    layout: MainLayout,
  },
  {
    path: "/detail-combo/:comboId",
    component: ComboDetail,
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
    layout: AdminLayout,
  },

  // Store
  {
    path: "/store",
    component: DashBoardStore,
    layout: StoreIotLayout,
  },
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
    path: "/payment-packages",
    component: PaymentMembershipPage,
    layout: StoreLayout,
  },

  {
    path: "/store/dashboard",
    component: DashBoardStore,
    layout: StoreIotLayout,
  },
  {
    path: "/store/list",
    component: DashBoardStore,
    layout: StoreIotLayout,
  },
  {
    path: "/store/manage-order",
    component: ManageHistoryOrder,
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
    path: "/store/create-product",
    component: CreateProductPage,
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
  {
    path: "/store/combo-managerment",
    component: ComboTable,
    layout: StoreIotLayout,
  },
  {
    path: "/store/test-managerment",
    component: Teststore,
    layout: StoreLayout,
  },
  // /combo/update/${comboId}
  {
    path: "/store/combo/update/:comboId",
    component: ComboUpdatePage,
    layout: StoreIotLayout,
  },
  {
    path: "/store/address",
    component: AddressSelector,
    layout: StoreLayout,
  },

  {
    path: "/store/lab-request",
    component: LabRequest,
    layout: StoreIotLayout,
  },
  {
    path: "/store/detail-labRequest/:labId",
    component: LabDetail,
    layout: StoreIotLayout,
  },
  {
    path: "/store/labs-management",
    component: StoreLabsManagement,
    layout: StoreIotLayout,
  },
  {
    path: "/store/combo-labs",
    component: ComboLabsManagement,
    layout: StoreIotLayout,
  },
  {
    path: "/labs-management",
    component: CustomerLabsManagement,
    layout: MainLayout,
  },
  {
    path: "/customer/lab-details/:labId",
    component: CustomerLabDetail,
    layout: MainLayout,
  },

  {
    path: "/trainer",
    component: DashBoardTrainer,
    layout: TrainerIotLayout,
  },
  {
    path: "/trainer/dashboard",
    component: DashBoardTrainer,
    layout: TrainerIotLayout,
  },
  {
    path: "/payment-packages",
    component: PaymentMembershipPage,
    layout: TrainerLayout,
  },
  {
    path: "/trainer/registerTrainer",
    component: TrainerRegister,
    layout: TrainerLayout,
  },
  {
    path: "/trainer/update-lab/:labId",
    component: CreateLab,
    layout: TrainerIotLayout,
  },
  {
    path: "/trainer/create-lab",
    component: NewCreateLab,
    layout: TrainerIotLayout,
  },
  {
    path: "/trainer/labs-management",
    component: TrainerLabsManagement,
    layout: TrainerIotLayout,
  },
  {
    path: "/trainer/detail-lab/:labId",
    component: LabDetailTrainer,
    layout: TrainerIotLayout,
  },
  {
    path: "/test-his",
    component: Register,
    layout: MainLayout,
  },
];

const privateRoute = [];
// if (allowedroles === Roles.ADMIN ) {
//   publicRoute.push({
//     path: "/admin",
//     component: AccountList,
//     layout: AdminPage,
//   });
// }
// if (allowedroles == Roles.STORE) {
//   publicRoute.push({
//     path: "/admin",
//     component: AccountList,
//     layout: AdminPage,
//   });
// }
// const privateRoute = [
//   // Admin Routes
//   {
//     path: "/admin",
//     component: DashBoard,
//     layout: AdminLayout,

//     allowedRoles: ["ADMIN"],
//   },

export { publicRoute, privateRoute };
