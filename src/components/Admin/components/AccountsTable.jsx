import PropTypes from "prop-types";
import { useState } from "react";
import {
  EllipsisOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Modal, Button, Select, Table, Dropdown, message, Tag } from "antd";
import {
  activeUsers,
  deActiveUsers,
  updateRole,
} from "../../../redux/slices/accountSlice";

const { Option } = Select;
const AccountsTable = ({
  users,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
  roles,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();

  const handleOpenModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedRole(null);
    setModalType(null);
  };

  const handleActive = () => {
    dispatch(activeUsers({ id: selectedUser.id }));
    message.success("User activated successfully");
    handleCloseModal();
  };

  const handleDeActive = () => {
    dispatch(deActiveUsers({ id: selectedUser.id }));
    message.success("User deactivated successfully");
    handleCloseModal();
  };

  const handleUpdateRole = () => {
    if (selectedUser && selectedRole) {
      dispatch(updateRole({ id: selectedUser.id, roleIdList: [selectedRole] }));
      message.success("User role updated successfully");
      handleCloseModal();
    }
  };

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "roles",
      render: (text, record) => (
        <>
          {record.roles?.map((role) =>
            role && role.label ? (
              <Tag color={getRoleColor(role.label)} key={role.id}>
                {role.label}
              </Tag>
            ) : null
          )}
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Active" : "Deactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: [
              record.isActive
                ? {
                    key: "2",
                    label: (
                      <span onClick={() => handleOpenModal(record, "deactive")}>
                        <CloseCircleOutlined className="text-red-500 mr-2" />
                        Deactivate
                      </span>
                    ),
                  }
                : {
                    key: "1",
                    label: (
                      <span onClick={() => handleOpenModal(record, "active")}>
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        Activate
                      </span>
                    ),
                  },
              {
                key: "3",
                label: (
                  <span onClick={() => handleOpenModal(record, "updateRole")}>
                    <EditOutlined className="text-black mr-2" />
                    Update Role
                  </span>
                ),
              },
            ],
          }}
          trigger={["click"]}
        >
          <EllipsisOutlined />
        </Dropdown>
      ),
    },
  ];
  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={users}
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
      <Modal
        title={modalType === "updateRole" ? "Update User Role" : "Confirmation"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          modalType === "updateRole" ? (
            <Button key="update" type="primary" onClick={handleUpdateRole}>
              Update
            </Button>
          ) : (
            <Button
              key="confirm"
              type="primary"
              onClick={modalType === "active" ? handleActive : handleDeActive}
            >
              Confirm
            </Button>
          ),
        ]}
      >
        {modalType === "updateRole" ? (
          <Select
            className="w-full"
            placeholder="Select a role"
            onChange={(value) => setSelectedRole(value)}
          >
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.label}
              </Option>
            ))}
          </Select>
        ) : (
          <p>Are you sure you want to {modalType} this user?</p>
        )}
      </Modal>
    </div>
  );
};

AccountsTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      isActive: PropTypes.number.isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AccountsTable;
