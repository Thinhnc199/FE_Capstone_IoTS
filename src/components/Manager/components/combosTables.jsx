import PropTypes from "prop-types";
import { useState } from "react";
import {
  EllipsisOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Table, Dropdown, message, Tag } from "antd";
import {
  activeCombos,
  deactiveCombos,
} from "./../../../redux/slices/comboSlice";

const CombosTables = ({
  items,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [modalType, setModalType] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleOpenModal = (combo, type) => {
    setSelectedCombo(combo);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCombo(null);
    setModalType(null);
  };

  // Hàm điều hướng đến trang chi tiết combo
  const handleViewComboDetail = (comboId) => {
    navigate(`/manager/combo-detail/${comboId}`);
  };

  const handleActive = () => {
    dispatch(activeCombos({ comboId: selectedCombo.id }))
      .then(() => {
        message.success("Combo activated successfully");
        handleCloseModal();
      })
      .catch((error) => {
        message.error("Failed to activate combo: " + error.message);
      });
  };

  const handleDeActive = () => {
    dispatch(deactiveCombos({ comboId: selectedCombo.id }))
      .then(() => {
        message.success("Combo deactivated successfully");
        handleCloseModal();
      })
      .catch((error) => {
        message.error("Failed to deactivate combo: " + error.message);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => handleViewComboDetail(record.id)} // Chuyển hướng khi nhấn
        >
          {text}
        </span>
      ),
    },
    {
      title: "Combo Image",
      key: "imageUrl",
      render: (text, record) => (
        <div className="w-auto h-20 flex items-center justify-center">
          <img
            src={record.imageUrl}
            alt={record.name}
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: "storeNavigationName",
      key: "storeNavigationName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      key: "price",
      render: (text, record) => <>{formatPrice(record.price)}đ</>,
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
    <div className="overflow-hidden">
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
          pageSizeOptions: [5, 10, 15, 30],
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

      {/* Modal for Active/Deactive Confirmation */}
      <Modal
        title={
          modalType === "active"
            ? "Do you want to activate this combo?"
            : "Do you want to deactivate this combo?"
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
      />
    </div>
  );
};

CombosTables.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      storeNavigationName: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      isActive: PropTypes.number.isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default CombosTables;
