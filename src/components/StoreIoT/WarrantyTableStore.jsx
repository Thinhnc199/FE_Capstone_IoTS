import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getWarrantyPagination,
  getWarrantyById,
  // confirmWarrantySuccess,
} from "../../redux/slices/warrantySlice";
import { ProductTypeReverse } from "./../../redux/constants";
import BreadcrumbNav from "../common/BreadcrumbNav";
const { TabPane } = Tabs;
const { Title } = Typography;

const WarrantyTableStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { warranties, pagination, loading, error } = useSelector(
    (state) => state.warranty || {}
  );

  // Lấy role từ localStorage
  // const userRole = parseInt(localStorage.getItem("role"), 10); // Sửa lại để parse đúng từ string

  // Hàm gọi API phân trang theo status
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
      navigate(`/store/warranty-detail/${id}`);
    });
  };

  // Hàm xử lý xác nhận bảo hành thành công
  // const handleConfirmSuccess = async (id) => {
  //   try {
  //     await dispatch(confirmWarrantySuccess(id)).unwrap();
  //     message.success("Warranty confirmed successfully!");
  //     fetchWarranties(1); // Cập nhật lại danh sách Approved
  //   } catch (error) {
  //     message.error(
  //       "Failed to confirm warranty: " + (error.message || "Unknown error")
  //     );
  //   }
  // };

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
      render: (type) => ProductTypeReverse[type] || "Unknown",
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) =>
    //     userRole === 5 && record.status === 1 ? (
    //       <Button
    //         type="primary"
    //         onClick={() => handleConfirmSuccess(record.id)}
    //         loading={loading}
    //       >
    //         Confirm Success
    //       </Button>
    //     ) : null,
    // },
  ];

  const handleTabChange = (key) => {
    fetchWarranties(parseInt(key));
  };

  const getTabData = (status) => {
    return warranties.filter((warranty) => warranty.status === status);
  };

  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/store" },
            { label: "store", path: "/store" },
            { label: "warranties request" },
          ]}
        />
      </div>
      <div className=" mx-auto  bg-white">
        <div className="p-4 border-b mb-4 border-gray-200">
          <div className=" border-b  bg-white  border-gray-200">
            <Title level={4} className="mb-0 text-gray-800">
              Warranties Request
            </Title>
          </div>

          <div>
            <Title level={2} style={{ marginBottom: "20px" }}></Title>
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
      </div>{" "}
    </div>
  );
};

export default WarrantyTableStore;
