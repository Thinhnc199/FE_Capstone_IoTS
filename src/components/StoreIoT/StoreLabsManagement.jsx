import LabsTable from "./../Trainer/components/LabsTable";
import PropTypes from "prop-types"; // Thêm import PropTypes
import BreadcrumbNav from "../common/BreadcrumbNav";
const StoreLabsManagement = ({ comboId, storeId }) => {
  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "store", path: "/store" },
            { label: "labs management" },
          ]}
        />
      </div>
      <LabsTable role="store" comboId={comboId} storeId={storeId} />;
    </div>
  );
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
