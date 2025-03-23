import LabsTable from "./../Trainer/components/LabsTable";
import PropTypes from "prop-types"; // Thêm import PropTypes


const StoreLabsManagement = ({ comboId, storeId }) => {
  return <LabsTable role="store" comboId={comboId} storeId={storeId} />;
};

StoreLabsManagement.propTypes = {
  comboId: PropTypes.number,
  storeId: PropTypes.number,
};

StoreLabsManagement.defaultProps = {
  comboId: 0,
  storeId: 0,
};

export default StoreLabsManagement;