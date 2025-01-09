import { Provider } from "react-redux";
import store from "./redux/store";
import { Fragment } from "react";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import { publicRoute } from "./routes/AppRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <Router>
          <div className="App">
            <Routes>
              {publicRoute.map((route, index) => {
                const Page = route.component;
                let Layout = MainLayout;

                if (route.layout == AdminLayout) {
                  Layout = AdminLayout;
                } else if (route.layout == null) {
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
            </Routes>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
