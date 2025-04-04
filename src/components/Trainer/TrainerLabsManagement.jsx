import PropTypes from "prop-types"; // Thêm import PropTypes
import LabsTable from "./components/LabsTable";
import BreadcrumbNav from "../common/BreadcrumbNav";
const TrainerLabsManagement = ({ userId }) => {
  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "trainer", path: "/trainer" },
            { label: "labs management" },
          ]}
        />
      </div>
      <LabsTable role="trainer" userId={userId}></LabsTable>
    </div>
  );
};

TrainerLabsManagement.propTypes = {
  userId: PropTypes.number,
};

TrainerLabsManagement.defaultProps = {
  userId: 0,
};

export default TrainerLabsManagement;
