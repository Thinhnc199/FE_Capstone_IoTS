import PropTypes from "prop-types";
import { useState } from "react";
import {
  EllipsisOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Modal, Button, Table, Dropdown, message, Tag } from "antd";
import {
  activeProducts,
  deactiveProducts,
} from "../../../redux/slices/productSlice";

const ProductsTables = ({
  items,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

    setModalType(null);
  };

  const handleActive = () => {
    dispatch(activeProducts({ id: selectedUser.id }));
    message.success("Item activated successfully");
    handleCloseModal();
  };

  const handleDeActive = () => {
    dispatch(deactiveProducts({ id: selectedUser.id }));
    message.success("Item deactivated successfully");
    handleCloseModal();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: " Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: " Product",
      key: "Product",
      render: (text, record) => (
        <div className="w-auto h-20 flex items-center justify-center">
          <img
            src={record.imageUrl}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      title: " Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Device Type",

    //   key: "deviceType",
    //   render: (text, record) => (
    //     <Tag color={record.deviceType === 1 ? "green" : "red"}>
    //       {record.deviceType === 1 ? "New" : "Like new"}
    //     </Tag>
    //   ),
    // },

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
    <div className="overflow-hidden ">
      <Table
        columns={columns}
        dataSource={items}
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
        bordered
        className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white  [&_.ant-pagination]:p-2"
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
        title={
          modalType === "active"
            ? "Do you wanna active product ?"
            : "Do you wanna deactive product ?"
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,

          <Button
            key="confirm"
            type="primary"
            onClick={modalType === "active" ? handleActive : handleDeActive}
          >
            Confirm
          </Button>,
        ]}
      ></Modal>
    </div>
  );
};

ProductsTables.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      deviceType: PropTypes.string.isRequired,
      mcU_MPU: PropTypes.string.isRequired,

      isActive: PropTypes.number.isRequired,
      isHardwareInformation: PropTypes.number.isRequired,
      isNetworkConnection: PropTypes.number.isRequired,
      isSoftwareOrOperations: PropTypes.number.isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default ProductsTables;
