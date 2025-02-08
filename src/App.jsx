import { Provider } from "react-redux";
import store from "./redux/store";
import { Fragment } from "react";
// import MainLayout from "./layouts/MainLayout";
// import AdminLayout from "./components/Admin/AdminLayout";
import { publicRoute } from "./routes/AppRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
            </Routes>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
