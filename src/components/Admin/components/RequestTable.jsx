import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import { Roles } from "../../../redux/constants";
const RequestTable = ({
  userRequest,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
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
      render: (text, record) =>
        record.role.id == Roles.STORE ? (
          <Link to={`/admin/user-request/${record.id}`}>{text}</Link>
        ) : (
          <div key={record.id}>{text}</div>
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
    <div className="overflow-hidden">
      <Table
        columns={columns}
        dataSource={userRequest}
        rowKey={(record) => record.id}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: totalCount,
          onChange: onPageChange,
          showSizeChanger: true,
          pageSizeOptions: [10, 15, 30],
          onShowSizeChange: (current, size) => onPageSizeChange(size),
        }}
        className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
        bordered
        style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
      />
      <div className="flex justify-between items-center -mt-14 p-2">
        <p>
          <span className="font-medium">
            {(pageIndex - 1) * pageSize + 1} to{" "}
            {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
          </span>
        </p>
      </div>
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
  onPageSizeChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default RequestTable;
