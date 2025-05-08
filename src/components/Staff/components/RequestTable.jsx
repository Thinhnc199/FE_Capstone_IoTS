
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Tag, Select, Row, Col } from "antd";
import { Roles } from "../../../redux/constants";
import dayjs from "dayjs";
import { useState } from "react";

const { Option } = Select;

const RequestTable = ({
  userRequest,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [filteredRole, setFilteredRole] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState(null);
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
        record.role.id === Roles.STORE || record.role.id === Roles.TRAINER ? (
          <Link to={`/staff/user-request/${record.id}`}>{text}</Link>
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
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  const roleOptions = [
    { value: "Store", label: "Store" },
    { value: "Customer", label: "Customer" },
    { value: "Trainer", label: "Trainer" },
    { value: "Manager", label: "Manager" },
    { value: "Staff", label: "Staff" },
    { value: "Admin", label: "Admin" },
  ];

  const statusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Rejected" },
    { value: 4, label: "Pending to Verify" },
  ];

  // Hàm lọc dữ liệu dựa trên Role và Status
  const filteredData = userRequest.filter((record) => {
    const roleMatch = filteredRole ? record.role.label === filteredRole : true;
    const statusMatch = filteredStatus
      ? record.userRequestStatus.id === filteredStatus
      : true;
    return roleMatch && statusMatch;
  });

  return (
    <div className="overflow-hidden">
      {/* Bộ lọc Role và Status */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            placeholder="Filter by Role"
            style={{ width: "100%" }}
            allowClear
            onChange={(value) => setFilteredRole(value)}
          >
            {roleOptions.map((role) => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            placeholder="Filter by Status"
            style={{ width: "100%" }}
            allowClear
            onChange={(value) => setFilteredStatus(value)}
          >
            {statusOptions.map((status) => (
              <Option key={status.value} value={status.value}>
                {status.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
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
            {Math.min(pageIndex * pageSize, filteredData.length)} of{" "}
            {totalCount}
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
      userRequestStatus: PropTypes.shape({
        id: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      }).isRequired,
      role: PropTypes.shape({
        id: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      }).isRequired,
      createdDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default RequestTable;
