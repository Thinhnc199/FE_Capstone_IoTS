import Home from "../pages/Home/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterEmail from "../pages/RegisterEmail";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import StaffLayout from "../components/Staff/StaffLayout";
import ManagerLayout from "../components/Manager/ManagerLayout";
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
import AccessRestricted from "../pages/AccessRestricted";
import CheckStatus from "../components/StoreIoT/CheckStatus";
import SubmissionSuccess from "../components/StoreIoT/SubmissionSuccess";
import RegisterCustomer from "../pages/RegisterCustomer";
import CategoryManagement from "../components/Admin/ProductsManageAdmin/CategoryManagement";

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
import WalletManagement from "../components/Trainer/components/WalletManagement";
import AdminWalletManagement from "../components/Admin/AdminWalletManagement";
import CheckProcessOrderCash from "../pages/CheckProcessOrderCash";
import ChatPage from "../pages/Chat/ChatPage";
import UserDetail from "../components/Admin/UserDetail";
import WarrantyTable from "../pages/Orders/WarrantyTable";
import WarrantyTableStore from "../components/StoreIoT/WarrantyTableStore";
import WarrantyDetail from "../pages/Orders/WarrantyDetail";
import WalletTrainer from "../components/Trainer/WalletTrainer";
import ManageHistoryOrderTrainer from "../components/Trainer/ManageHistoryOrderTrainer";
// import ManageHistoryOrderAdmin from "../components/Admin/ManageHistoryOrderAdmin";
import ReportRequest from "../components/Admin/ReportRequest";

import UpdateProductPage from "../components/StoreIoT/UpdateProductPage";
import CombosManagement from "../components/Admin/CombosManagement";
import HistoryOrders from "../pages/Historyorder/HistoryOrder";
import ComboDetailPage from "../components/Admin/ComboDetailPage";
import LabsManagement from "../components/Admin/LabsManagement";
import LabDetailAdmin from "../components/Admin/LabDetailAdmin";
import ListAccountManage from "../components/Staff/ListAccountManage";
import StoreAccountManage from "../components/Staff/StoreAccountManage";
import TrainerAccountManage from "../components/Staff/TrainerAccountManage";
import CustomerAccountManage from "../components/Staff/CustomerAccountManage";
import DashBoardStaff from "../components/Staff/DashBoardStaff";
import ChatStore from "../components/StoreIoT/ChatStore";
import { Roles } from "../redux/constants";
import DeviceDetail from "../components/StoreIoT/DeviceDetail";
import CheckProcessOrderMobile from "../pages/CheckProcessOrderMobile";
import AdminRefundManagement from "../components/Admin/AdminRefundManagement";
import CustomerRefundManagement from "./../pages/CustomerRefundManagement";
import ListUserResquest from "../components/Staff/ListUserRequest";
import LabManage from "../components/Manager/LabManage";
import LabDetailManage from "../components/Manager/LabDetailManage";
import ManageCombo from "../components/Manager/ManageCombo";
import GeneralSettings from "../components/Admin/GeneralSettings";
import HistoryOrder from "../components/Admin/HistoryOrder";
const publicRoute = [
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },

  { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
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
    path: "/checkout-process-order",
    component: CheckProcessOrder,
    layout: null,
  },
  {
    path: "/checkout-process-order-by-mobile",
    component: CheckProcessOrderMobile,
    layout: null,
  },
  {
    path: "/checkout-order-success",
    component: CheckProcessOrderCash,
    layout: null,
  },
  {
    path: "/contact",
    component: ContactPage,
    layout: MainLayout,
  },
  {
    path: "/about",
    component: AboutIoTs,
    layout: MainLayout,
  },
];

const privateRoute = [
  //customer
  {
    path: "/",
    component: Home,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  {
    path: "/home",
    component: Home,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  {
    path: "/history-order",
    component: HistoryOrders,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/labs-management",
    component: CustomerLabsManagement,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/customer/lab-details/:labId",
    component: CustomerLabDetail,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/detail/:id",
    component: DetailProducts,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  {
    path: "/combo-list",
    component: ComboList,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/detail-combo/:comboId",
    component: ComboDetail,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  {
    path: "/transaction-history",
    component: WalletManagement,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/warranties",
    component: WarrantyTable,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/warranty-detail/:id",
    component: WarrantyDetail,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/refunds",
    component: CustomerRefundManagement,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/shop-infomation/:id",
    component: StoreInfoPage,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },

  {
    path: "/view-all",
    component: ViewAllProduct,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  {
    path: "/cart",
    component: CartProducts,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/checkout",
    component: Checkout,
    layout: null,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/chat",
    component: ChatPage,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },
  {
    path: "/chat/:id",
    component: ChatPage,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER],
  },

  {
    path: "/combos",
    component: ComboPage,
    layout: MainLayout,
    allowedRoles: [Roles.CUSTOMER, "UNAUTHENTICATED"],
  },
  // Admin Routes
  {
    path: "/admin",
    component: DashBoard,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/dashboard",
    component: DashBoard,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/GeneralSettings",
    component: GeneralSettings,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/list-account",
    component: ListAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/admin-account",
    component: AdminAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/staff-account",
    component: StaffAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/manager-account",
    component: ManagerAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/customer-account",
    component: CustomerAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/store-account",
    component: StoreAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/trainer-account",
    component: TrainerAccount,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/list-product",
    component: ListProducts,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/list-product/detail-product/:id",
    component: DeviceDetail,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/category-management",
    component: CategoryManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/history-order",
    component: HistoryOrder,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  // {
  //   path: "/admin/manage-history-order",
  //   component: ManageHistoryOrderAdmin,
  //   layout: AdminLayout,
  //   allowedRoles: [Roles.ADMIN],
  // },

  {
    path: "/admin/Profile",
    component: Profile,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/create-manager-staff",
    component: CreateManagerStaff,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/user-request",
    component: UserRequest,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/user-request/:id",
    component: DetailUserRequest,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/cashout-requests",
    component: AdminWalletManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/refund-requests",
    component: AdminRefundManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/user-detail/:id",
    component: UserDetail,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/report-request",
    component: ReportRequest,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/combos-management",
    component: CombosManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/combos-management/:comboId",
    component: ComboDetailPage,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/labs-management",
    component: LabsManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/labs-detail/:labId",
    component: LabsManagement,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  {
    path: "/admin/detail-lab/:labId",
    component: LabDetailAdmin,
    layout: AdminLayout,
    allowedRoles: [Roles.ADMIN],
  },
  // Store Routes
  {
    path: "/store",
    component: DashBoardStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/registerStore",
    component: StoreRegistration,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/welcome",
    component: WelcomeStore,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/payment-packages",
    component: PaymentMembershipPage,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE, Roles.TRAINER],
  },

  {
    path: "/store/dashboard",
    component: DashBoardStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/list",
    component: DashBoardStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/manage-order",
    component: ManageHistoryOrder,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/cashout-management",
    component: WalletStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/list-product",
    component: ListProductStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/create-product",
    component: CreateProductPage,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/list-product/edit/:id",
    component: UpdateProductPage,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/status",
    component: CheckStatus,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/submission-Success",
    component: SubmissionSuccess,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/combo-managerment",
    component: ComboTable,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/test-managerment",
    component: Teststore,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },
  // /combo/update/${comboId}
  {
    path: "/store/combo/update/:comboId",
    component: ComboUpdatePage,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/address",
    component: AddressSelector,
    layout: StoreLayout,
    allowedRoles: [Roles.STORE],
  },

  {
    path: "/store/lab-request",
    component: LabRequest,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/detail-labRequest/:labId",
    component: LabDetail,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/labs-management",
    component: StoreLabsManagement,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/combo-labs",
    component: ComboLabsManagement,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/transaction-history",
    component: WalletManagement,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/warranties-request",
    component: WarrantyTableStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  {
    path: "/store/warranty-detail/:id",
    component: WarrantyDetail,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },
  // {
  //   path: "/store/chat/:id",
  //   component: ChatStore,
  //   layout: StoreIotLayout,
  //   allowedRoles: [Roles.STORE],
  // },
  {
    path: "/store/chat",
    component: ChatStore,
    layout: StoreIotLayout,
    allowedRoles: [Roles.STORE],
  },

  // Trainer Routes

  {
    path: "/trainer",
    component: DashBoardTrainer,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/dashboard",
    component: DashBoardTrainer,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },

  {
    path: "/trainer/registerTrainer",
    component: TrainerRegister,
    layout: TrainerLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/update-lab/:labId",
    component: CreateLab,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/create-lab",
    component: NewCreateLab,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/manage-history-order",
    component: ManageHistoryOrderTrainer,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/labs-management",
    component: TrainerLabsManagement,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/detail-lab/:labId",
    component: LabDetailTrainer,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },

  {
    path: "/trainer/wallet",
    component: WalletManagement,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  {
    path: "/trainer/cashout-management",
    component: WalletTrainer,
    layout: TrainerIotLayout,
    allowedRoles: [Roles.TRAINER],
  },
  //Manager Routes
  {
    path: "/manager/dashboard",
    component: DashBoard,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager",
    component: DashBoard,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },

  {
    path: "/manager/combos-management",
    component: ManageCombo,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/combo-detail/:comboId",
    component: ComboDetailPage,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/labs-management",
    component: LabManage,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/labs-detail/:labId",
    component: LabDetailManage,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/list-product",
    component: ListProducts,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/list-product/detail-product/:id",
    component: DeviceDetail,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },
  {
    path: "/manager/category-management",
    component: CategoryManagement,
    layout: ManagerLayout,
    allowedRoles: [Roles.MANAGER],
  },

  //Staff Staff
  {
    path: "/staff/list-account",
    component: ListAccountManage,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },

  {
    path: "/staff/dashboard",
    component: DashBoardStaff,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff",
    component: DashBoardStaff,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/store-account",
    component: StoreAccountManage,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/trainer-account",
    component: TrainerAccountManage,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/customer-account",
    component: CustomerAccountManage,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/user-request",
    component: ListUserResquest,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/user-request/:id",
    component: DetailUserRequest,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
  {
    path: "/staff/user-detail/:id",
    component: UserDetail,
    layout: StaffLayout,
    allowedRoles: [Roles.STAFF],
  },
];

export { publicRoute, privateRoute };
