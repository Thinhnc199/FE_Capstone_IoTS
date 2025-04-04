import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Spin, Typography, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getWarrantyPagination,
  getWarrantyById,
  confirmWarrantySuccess,
} from "../../redux/slices/warrantySlice";
import { ProductType } from "./../../redux/constants";

const { TabPane } = Tabs;
const { Title } = Typography;

const WarrantyTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { warranties, pagination, loading, error } = useSelector(
    (state) => state.warranty || {}
  );

  const userRole = parseInt(localStorage.getItem("role"), 10);

  const fetchWarranties = (status, updatedPagination = pagination) => {
    dispatch(
      getWarrantyPagination({
        pageIndex: updatedPagination.pageIndex,
        pageSize: updatedPagination.pageSize,
        searchKeyword: "",
        statusFilter: status,
      })
    );
  };

  useEffect(() => {
    fetchWarranties(0);
  }, [dispatch]);

  const handleProductClick = (id) => {
    dispatch(getWarrantyById(id)).then(() => {
      if (userRole === 5) {
        navigate(`/warranty-detail/${id}`);
      } else if (userRole === 6) {
        navigate(`/store/warranty-detail/${id}`);
      } else {
        message.error("Unauthorized access or invalid role");
      }
    });
  };

  const handleConfirmSuccess = async (id) => {
    try {
      await dispatch(confirmWarrantySuccess(id)).unwrap();
      message.success("Warranty confirmed successfully!");
      fetchWarranties(1);
    } catch (error) {
      message.error(
        "Failed to confirm warranty: " + (error.message || "Unknown error")
      );
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <a
          onClick={() => handleProductClick(record.id)}
          style={{ color: "#1890ff" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Product Type",
      dataIndex: "productType",
      key: "productType",
      render: (type) => ProductType[type] || "Unknown",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Created By Email",
      dataIndex: "createdByEmail",
      key: "createdByEmail",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        userRole === 5 && record.status === 1 ? (
          <Button
            type="primary"
            onClick={() => handleConfirmSuccess(record.id)}
            loading={loading}
          >
            Confirm Success
          </Button>
        ) : null,
    },
  ];

  const handleTabChange = (key) => {
    fetchWarranties(parseInt(key));
  };

  const getTabData = (status) => {
    return warranties.filter((warranty) => warranty.status === status);
  };

  return (
    <div className="container mx-auto py-12 px-6 bg-mainColer">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div style={{ padding: "20px" }}>
          <Title level={2} style={{ marginBottom: "20px" }}>
            Warranties Request
          </Title>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          <Tabs defaultActiveKey="0" onChange={handleTabChange}>
            <TabPane tab="Pending" key="0">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={getTabData(0)}
                  rowKey="id"
                  pagination={{
                    current: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    total: pagination.totalCount,
                    onChange: (page) =>
                      fetchWarranties(0, {
                        ...pagination,
                        pageIndex: page - 1,
                      }),
                  }}
                  className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white  [&_.ant-pagination]:p-2"
                  style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
                />
              </Spin>
            </TabPane>
            <TabPane tab="Approved" key="1">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={getTabData(1)}
                  rowKey="id"
                  pagination={{
                    current: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    total: pagination.totalCount,
                    onChange: (page) =>
                      fetchWarranties(1, {
                        ...pagination,
                        pageIndex: page - 1,
                      }),
                  }}
                />
              </Spin>
            </TabPane>
            <TabPane tab="Rejected" key="2">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={getTabData(2)}
                  rowKey="id"
                  pagination={{
                    current: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    total: pagination.totalCount,
                    onChange: (page) =>
                      fetchWarranties(2, {
                        ...pagination,
                        pageIndex: page - 1,
                      }),
                  }}
                />
              </Spin>
            </TabPane>
            <TabPane tab="Success" key="3">
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={getTabData(3)}
                  rowKey="id"
                  pagination={{
                    current: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    total: pagination.totalCount,
                    onChange: (page) =>
                      fetchWarranties(3, {
                        ...pagination,
                        pageIndex: page - 1,
                      }),
                  }}
                />
              </Spin>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WarrantyTable;
