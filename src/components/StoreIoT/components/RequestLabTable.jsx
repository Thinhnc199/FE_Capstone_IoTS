import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Tag, Image } from "antd";

const RequestLabTable = ({
  labs,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
    console.log("Labs received in RequestLabTable:", labs);
  const getStatusColor = (status) => {
    switch (status) {
      case 0: // Draft
        return "gray";
      case 1: // Approved
        return "green";
      case 2: // Pending_To_Approved
        return "yellow";
      case 3: // Rejected
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Approved";
      case 2:
        return "Pending To Approved";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Combo ID",
      dataIndex: "comboId",
      key: "comboId",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="Lab Image"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
  ];

  return (
    <div className="overflow-hidden">
      <Table
        columns={columns}
        dataSource={labs}
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

RequestLabTable.propTypes = {
  labs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      comboId: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
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

export default RequestLabTable;