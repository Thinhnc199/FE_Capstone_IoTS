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
const PrivateRoute = ({
  allowedRoles = [],
  layout: Layout = Fragment,
  children,
}) => {
  const { isAuthenticated, role } = useSelector((state) => ({
    isAuthenticated: !!state.userAuth.token,
    role: state.userAuth.role,
  }));

  if (!isAuthenticated) {
    return <Navigate to="/Access-Restricted" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(Number(role))) {
    return <Navigate to="/Access-Restricted" />;
  }

  return <Layout>{children}</Layout>;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.number),
  layout: PropTypes.elementType,
  children: PropTypes.node,
};

export default PrivateRoute;
