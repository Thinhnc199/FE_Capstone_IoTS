import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types"; 

const PrivateRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.userAuth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(parseInt(role))) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.array.isRequired,
};

export default PrivateRoute;
