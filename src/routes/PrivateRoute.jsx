import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ layout: Layout = Fragment }) => {
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/Access-Restricted" />
  );
};

PrivateRoute.propTypes = {
  layout: PropTypes.elementType,
};

export default PrivateRoute;

