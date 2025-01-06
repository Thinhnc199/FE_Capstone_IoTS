import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
// const role = localStorage.getItem("userRole");

const publicRoute = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/home", component: Home, layout: MainLayout },
  { path: "/register", component: Register, layout: MainLayout },
  { path: "/login", component: Login, layout: MainLayout },
  // { path: "/test", component: Login, layout: null },
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
