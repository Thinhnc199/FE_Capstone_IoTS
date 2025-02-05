import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";

const RequestTable = ({
  userRequest,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
}) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [selectedUser, setSelectedUser] = useState(null);
  //   const [selectedRole, setSelectedRole] = useState(null);
  //   const [modalType, setModalType] = useState(null);
  //   const dispatch = useDispatch();

  const getRoleColor = (label) => {
    switch (label) {
      case "Store":
        return "orange";
      case "Customer":
        return "default";
      case "Trainer":
        return "green";
      case "Manager":
        return "yellow";
      case "Staff":
        return "blue";
      case "Admin":
        return "purple";
      default:
        return "default";
    }
  };
  const getStatusColor = (label) => {
    switch (label) {
      case 4:
        return "default";
      case 3:
        return "red";
      case 2:
        return "green";
      case 1:
        return "yellow";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <Link to={`/admin/userRequest/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (text, record) => (
        <Tag color={getRoleColor(record.role.label)}>{record.role.label}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Tag color={getStatusColor(record.userRequestStatus.id)}>
          {record.userRequestStatus.label}
        </Tag>
      ),
    },
    {
      title: "createdDate",
      dataIndex: "createdDate",
      key: "createdDate",
    },
  ];
  return (
    <div className="overflow-x-auto">
      request table
      <Table
        columns={columns}
        dataSource={userRequest}
        rowKey={(record) => record.id}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: totalCount,
          onChange: onPageChange,
        }}
        bordered
        style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
      />
    </div>
  );
};

RequestTable.propTypes = {
  userRequest: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      userRequestStatus: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default RequestTable;
