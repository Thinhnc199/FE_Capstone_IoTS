import PropTypes from "prop-types";
import LabsTable from "./Trainer/components/LabsTable";

const CustomerLabsManagement = ({ userId }) => {
  return <LabsTable role="customer" userId={userId} />;
};

CustomerLabsManagement.propTypes = {
  userId: PropTypes.number,
};

CustomerLabsManagement.defaultProps = {
  userId: 0,
};

export default CustomerLabsManagement;
