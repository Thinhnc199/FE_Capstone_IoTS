import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getLabAdminPagination } from "./../../../redux/slices/labSlice";

const LabsTable = ({
  items,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearchKeyword(value);
    dispatch(
      getLabAdminPagination({
        pageIndex: 1,
        pageSize: 10,
        searchKeyword: value,
      })
    )
      .then(() => message.success("Search completed"))
      .catch((error) => message.error("Search failed: " + error.message));
  };

  const handleViewLabDetail = (labId) => {
    navigate(`/admin/labs-management/${labId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => handleViewLabDetail(record.id)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Image",
      key: "imageUrl",
      render: (text, record) => (
        <div className="w-auto h-20 flex items-center justify-center">
          <img
            src={record.imageUrl || "https://via.placeholder.com/50"}
            alt={record.title}
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
    },
    {
      title: "Combo",
      dataIndex: "comboNavigationName",
      key: "comboNavigationName",
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Price",
      key: "price",
      render: (text, record) => (
        <>{record.price.toLocaleString("vi-VN")} VND</>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => {
        switch (record.status) {
          case 1:
            return <Tag color="green">Active</Tag>;
          case 2:
            return <Tag color="yellow">Pending</Tag>;
          case 3:
            return <Tag color="red">Rejected</Tag>;
          default:
            return <Tag color="grey">Draft</Tag>;
        }
      },
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Labs Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/labs-management/create")}
        >
          Create Lab
        </Button>
      </div>

      <Input
        placeholder="Search by title..."
        value={searchKeyword}
        onChange={(e) => handleSearch(e.target.value)}
        allowClear
        className="w-1/3 mb-4"
      />

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
        className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
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

LabsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      summary: PropTypes.string,
      comboNavigationName: PropTypes.string,
      storeName: PropTypes.string,
      price: PropTypes.number.isRequired,
      status: PropTypes.number.isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default LabsTable;