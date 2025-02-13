// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import RegisterEmail from "../pages/RegisterEmail";
// import VerifyOtp from "../pages/VerifyOtp";
// import MainLayout from "../layouts/MainLayout";
// import AdminLayout from "../components/Admin/AdminLayout";
// import ListAccount from "../components/Admin/ListAccount";
// import ListProduct from "../components/Admin/ListProduct";
// import DashBoard from "../components/Admin/DashBoard";
// import Profile from "../components/Admin/Profile";
// import RegisterCustomer from "../pages/RegisterCustomer";
// import ContactPage from "../pages/ContactPage";
// // import StoreRegistration from "../pages/StoreRegistration";
// import EmailOtpPage from "../pages/StoreRes/EmailOtpPage";
// import OtpUserInfoPage from "../pages/StoreRes/OtpUserInfoPage";

// const publicRoute = [
//   { path: "/", component: Home, layout: MainLayout },
//   { path: "/home", component: Home, layout: MainLayout },
//   { path: "/register", component: Register, layout: MainLayout },
//   { path: "/login", component: Login, layout: MainLayout },
//   { path: "/emailcustomer", component: RegisterEmail, layout: MainLayout },
//   { path: "/verifyOtp", component: VerifyOtp, layout: MainLayout },
//   {
//     path: "/registerCustomer",
//     component: RegisterCustomer,
//     layout: MainLayout,
//   },
//   {
//     path: "/StoreEmail",
//     component: EmailOtpPage,
//     layout: MainLayout,
//   },
//   {
//     path: "/OtpRegister", // Fixed the typo here to match your navigate path
//     component: OtpUserInfoPage,
//     layout: MainLayout,
//   },
//   // {
//   //   path: "/registerStore",
//   //   component: StoreRegistration,
//   //   layout: MainLayout,
//   // },
//   {
//     path: "/contact",
//     component: ContactPage,
//     layout: MainLayout,
//   },
//   { path: "/admin", component: DashBoard, layout: AdminLayout },
//   { path: "/admin/dashboard", component: DashBoard, layout: AdminLayout },
//   {
//     path: "/admin/list-account",
//     component: ListAccount,
//     layout: AdminLayout,
//   },
//   {
//     path: "/admin/list-product",
//     component: ListProduct,
//     layout: AdminLayout,
//   },

//   {
//     path: "/admin/Profile",
//     component: Profile,
//     layout: AdminLayout,
//   },
// ];
// // if (role == "ADMIN") {
// //   publicRoute.push({
// //     path: "/admin",
// //     component: AccountList,
// //     layout: AdminPage,
// //   });

// // }

// const privateRoute = [];
// export { publicRoute, privateRoute };
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoute, privateRoute } from "./routesConfig";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoute.map(
          ({ path, component: Component, layout: Layout }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          )
        )}

        {/* Private Routes with role-based protection */}
        {privateRoute.map(
          ({ path, component: Component, layout: Layout, roles }, index) => (
            <Route
              key={index}
              path={path}
              element={<PrivateRoute allowedRoles={roles} />}
            >
              <Route
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            </Route>
          )
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
