import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import ListAccount from "../components/Admin/ListAccount";
import ListProduct from "../components/Admin/ListProduct";
import DashBoard from "../components/Admin/DashBoard";
import Profile from "../components/Admin/Profile";
// const role = localStorage.getItem("userRole");
import DetailAccount from "../components/Admin/DetailAccount";
const publicRoute = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Home, layout: MainLayout },
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  { path: "/admin", component: DashBoard, layout: AdminLayout },
  { path: "/admin/dashboard", component: DashBoard, layout: AdminLayout },
  {
    path: "/admin/list-account",
    component: ListAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/list-product",
    component: ListProduct,
    layout: AdminLayout,
  },
  {
    path: "/admin/list-account/:id",
    component: DetailAccount,
    layout: AdminLayout,
  },
  {
    path: "/admin/Profile",
    component: Profile,
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
