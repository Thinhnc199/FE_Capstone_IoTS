import PropTypes from "prop-types"; // Thêm import PropTypes
import LabsTable from "./components/LabsTable";

const TrainerLabsManagement = ({ userId }) => {
  return <LabsTable role="trainer" userId={userId} />;
};

TrainerLabsManagement.propTypes = {
  userId: PropTypes.number,
};

TrainerLabsManagement.defaultProps = {
  userId: 0,
};

export default TrainerLabsManagement;