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
}) => {
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
      title: "Id",
      key: "id",
      render: (text, record) => <div key={record.id}>{record.id}</div>,
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.id || 0) - Number(b.id || 0),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) =>
        record.role.id == Roles.STORE ? (
          <Link to={`/admin/userRequest/${record.id}`}>{text}</Link>
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
