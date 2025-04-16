import { Provider } from "react-redux";
import store from "./redux/store";
import { Fragment } from "react";
import { publicRoute, privateRoute } from "./routes/AppRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-bgColer">
        <Router>
          <div className="App">
            <Routes>
              {publicRoute.map((route, index) => {
                const Page = route.component;
                const Layout = route.layout ? route.layout : Fragment;
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

              {/* {privateRoute.map((route, index) => {
                const Page = route.component;
                const Layout = route.layout ? route.layout : Fragment;
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <PrivateRoute layout={Layout}>
                        <Page />
                      </PrivateRoute>
                    }
                  />
                );
              })} */}
              {privateRoute.map((route, index) => {
                const Page = route.component;
                const Layout = route.layout || Fragment;
                return (
                  <Route
                    key={`private-${index}`}
                    path={route.path}
                    element={
                      <PrivateRoute
                        allowedRoles={route.allowedRoles || []}
                        layout={Layout}
                      >
                        <Page />
                      </PrivateRoute>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
