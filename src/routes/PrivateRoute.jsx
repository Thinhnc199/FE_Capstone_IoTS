// import { Fragment } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import PropTypes from "prop-types";

// const PrivateRoute = ({ layout: Layout = Fragment }) => {
//   const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);

//   return isAuthenticated ? (
//     <Layout>
//       <Outlet />
//     </Layout>
//   ) : (
//     <Navigate to="/Access-Restricted" />
//   );
// };

// PrivateRoute.propTypes = {
//   layout: PropTypes.elementType,
// };

// export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { Roles } from "../redux/constants";
const PrivateRoute = ({
  allowedRoles = [],
  layout: Layout = Fragment,
  children,
}) => {
  const { isAuthenticated, role } = useSelector((state) => ({
    isAuthenticated: !!state.userAuth.token,
    role: state.userAuth.role,
  }));
  const getRedirectPathByRole = (role) => {
    switch (Number(role)) {
      case Roles.ADMIN:
        return "/admin";
      case Roles.STAFF:
        return "/staff";
      case Roles.MANAGER:
        return "/manager";
      case Roles.STORE:
        return "/store";
      case Roles.TRAINER:
        return "/trainer";
      case Roles.CUSTOMER:
        return "/";
      default:
        return "/";
    }
  };
  // if (allowedRoles.length === 0) {
  //   return <Layout>{children}</Layout>;
  // }
  if (!isAuthenticated) {
    return allowedRoles.includes("UNAUTHENTICATED") ? (
      <Layout>{children}</Layout>
    ) : (
      <Navigate to="/login" />
    );
  }

  // Đã đăng nhập: kiểm tra role
  const rolesToCheck = allowedRoles.filter((r) => r !== "UNAUTHENTICATED");
  if (rolesToCheck.length > 0 && !rolesToCheck.includes(Number(role))) {
    return <Navigate to={getRedirectPathByRole(role)} replace />;
  }
  return <Layout>{children}</Layout>;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.array,
  layout: PropTypes.elementType,
  children: PropTypes.node,
};

export default PrivateRoute;
