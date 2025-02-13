// import { Provider } from "react-redux";
// import store from "./redux/store";
// import { Fragment } from "react";
// import MainLayout from "./layouts/MainLayout";
// import AdminLayout from "./components/Admin/AdminLayout";
// import { publicRoute } from "./routes/routesConfig";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// const App = () => {
//   return (
//     <Provider store={store}>
//       <div className="min-h-screen bg-gray-100">
//         <Router>
//           <div className="App">
//             <Routes>
//               {publicRoute.map((route, index) => {
//                 const Page = route.component;
//                 let Layout = MainLayout;

//                 if (route.layout === AdminLayout) {
//                   Layout = AdminLayout;
//                 } else if (route.layout === null) {
//                   Layout = Fragment;
//                 }
//                 return (
//                   <Route
//                     key={index}
//                     path={route.path}
//                     element={
//                       <Layout>
//                         <Page />
//                       </Layout>
//                     }
//                   />
//                 );
//               })}
//             </Routes>
//           </div>
//         </Router>
//       </div>
//     </Provider>
//   );
// };

// export default App;
import { Provider } from "react-redux";
import store from "./redux/store";
import { Fragment } from "react";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import { publicRoute, privateRoute } from "./routes/routesConfig"; // ✅ Import private routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute"; // ✅ Import PrivateRoute

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <Router>
          <div className="App">
            <Routes>
              {/* ✅ Render Public Routes */}
              {publicRoute.map((route, index) => {
                const Page = route.component;
                let Layout = MainLayout;

                if (route.layout === AdminLayout) {
                  Layout = AdminLayout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}

              {/* ✅ Render Private Routes with Role-Based Protection */}
              {privateRoute.map(({ path, component: Component, layout: Layout, roles }, index) => (
                <Route key={index} element={<PrivateRoute allowedRoles={roles} />}>
                  <Route
                    path={path}
                    element={
                      <Layout>
                        <Component />
                      </Layout>
                    }
                  />
                </Route>
              ))}
            </Routes>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
