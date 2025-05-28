// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, Tabs, Button, Modal, message, Tag, Input } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import {
//   fetchReports,
//   approveReport,
//   refundReport,
// } from "../../redux/slices/feedbackSlice";
// import moment from "moment";

// const { TabPane } = Tabs;

// const ReportRequests = () => {
//   const dispatch = useDispatch();
//   const { reports, loading, pageIndex, pageSize, totalCount } = useSelector(
//     (state) => state.feedback
//   );
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [refundQuantity, setRefundQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("0");

//   const statusTabs = [
//     { key: "0", title: "Pending", statusFilter: 0 },
//     { key: "1", title: "Approved", statusFilter: 1 },
//     { key: "2", title: "Refunded", statusFilter: 2 },
//   ];

//   const getProductTypeLabel = (type) => {
//     switch (type) {
//       case 1:
//         return "DEVICE";
//       case 2:
//         return "COMBO";
//       case 3:
//         return "LAB";
//       default:
//         return "UNKNOWN";
//     }
//   };

//   const fetchData = (params = {}) => {
//     const currentTab = statusTabs.find((tab) => tab.key === activeTab);

//     dispatch(
//       fetchReports({
//         payload: {
//           pageIndex: params.page || pageIndex,
//           pageSize: params.pageSize || pageSize,
//           searchKeyword,
//         },
//         statusFilter: currentTab.statusFilter,
//       })
//     );
//   };

//   useEffect(() => {
//     fetchData();
//   }, [searchKeyword, activeTab]);

//   const handleSearch = () => {
//     fetchData({ page: 1 });
//   };

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   const handleAction = (record, type) => {
//     setSelectedReport(record);
//     setActionType(type);
//     setIsModalOpen(true);
//   };

//   const handleConfirm = () => {
//     if (actionType === "approve") {
//       dispatch(approveReport(selectedReport.id))
//         .unwrap()
//         .then(() => {
//           message.success("Report approved successfully!");
//           fetchData();
//         })
//         .catch((error) => {
//           message.error(error || "Failed to approve report");
//         });
//     } else if (actionType === "refund") {
//       dispatch(refundReport({ reportId: selectedReport.id, refundQuantity }))
//         .unwrap()
//         .then(() => {
//           message.success("Report refunded successfully!");
//           fetchData();
//         })
//         .catch((error) => {
//           message.error(error || "Failed to refund report");
//         });
//     }
//     setIsModalOpen(false);
//   };

//   const columns = [
//     {
//       title: "Report ID",
//       dataIndex: "orderItemId",
//       key: "orderItemId",
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//       ellipsis: true,
//     },

//     {
//       title: "Product Name",
//       dataIndex: "productName",
//       key: "productName",
//       ellipsis: true,
//     },
//     {
//       title: "Type",
//       dataIndex: "productType",
//       key: "productType",
//       render: (type) => getProductTypeLabel(type),
//     },
//     {
//       title: "Contact",
//       dataIndex: "contactNumber",
//       key: "contactNumber",
//     },
//     {
//       title: "Created By",
//       dataIndex: "createdByFullname",
//       key: "createdByFullname",
//       render: (text, record) => (
//         <div>
//           <div>{text}</div>
//           <div className="text-xs text-gray-500">{record.createdByEmail}</div>
//         </div>
//       ),
//     },
//     {
//       title: "Created Date",
//       dataIndex: "createdDate",
//       key: "createdDate",
//       render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
//     },
//     {
//       title: "Store",
//       dataIndex: "storeName",
//       key: "storeName",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusItem = statusTabs.find(
//           (tab) => tab.statusFilter === status
//         );
//         const text = statusItem ? statusItem.title : "Unknown";

//         let color;
//         switch (status) {
//           case 1: // Approved
//             color = "green";
//             break;
//           case 2: // Refunded
//             color = "blue";
//             break;
//           case 0: // Pending
//             color = "orange";
//             break;
//           default:
//             color = "default";
//         }

//         return <Tag color={color}>{text}</Tag>;
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 200,
//       render: (_, record) =>
//         record.status === 0 && (
//           <div className="flex gap-2">
//             <Button
//               type="primary"
//               size="small"
//               className="bg-green-600 hover:bg-green-700"
//               onClick={() => handleAction(record, "approve")}
//             >
//               Approve
//             </Button>
//             <Button
//               danger
//               size="small"
//               onClick={() => handleAction(record, "refund")}
//             >
//               Refund
//             </Button>
//           </div>
//         ),
//     },
//   ];

//   return (
//     <div className="p-4 min-h-screen">
//       <div className="bg-white rounded-md p-4 overflow-hidden shadow-lg">
//         <div className="mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">
//           <h1 className="text-2xl font-bold text-black">Report Requests</h1>
//           <Input
//             placeholder="Search reports..."
//             prefix={<SearchOutlined />}
//             value={searchKeyword}
//             onChange={(e) => setSearchKeyword(e.target.value)}
//             onPressEnter={handleSearch}
//             className="w-full sm:w-64"
//             style={{ borderRadius: "8px" }}
//           />
//         </div>

//         <Tabs
//           defaultActiveKey="0"
//           activeKey={activeTab}
//           onChange={handleTabChange}
//         >
//           {statusTabs.map((tab) => (
//             <TabPane tab={tab.title} key={tab.key}>
//               <Table
//                 columns={columns}
//                 dataSource={reports || []}
//                 loading={loading}
//                 rowKey="id"
//                 pagination={{
//                   current: pageIndex,
//                   pageSize: pageSize,
//                   total: totalCount,
//                   onChange: (page, pageSize) => {
//                     fetchData({ page, pageSize });
//                   },
//                 }}
//                 className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
//                 bordered
//                 style={{ borderColor: "#1E90FF" }}
//               />
//             </TabPane>
//           ))}
//         </Tabs>

//         {/* Action Modal */}
//         <Modal
//           title={`Confirm ${actionType === "approve" ? "Approval" : "Refund"}`}
//           open={isModalOpen}
//           onOk={handleConfirm}
//           onCancel={() => setIsModalOpen(false)}
//           okText="Confirm"
//           cancelText="Cancel"
//           okButtonProps={{
//             style: {
//               backgroundColor: actionType === "approve" ? "#52c41a" : "#1890ff",
//               borderColor: actionType === "approve" ? "#52c41a" : "#1890ff",
//             },
//           }}
//         >
//           <p>
//             Are you sure you want to {actionType} this report from{" "}
//             {selectedReport?.createdByFullname}?
//           </p>
//           {actionType === "refund" && (
//             <div style={{ marginTop: 16 }}>
//               <label>Refund Quantity: </label>
//               <Input
//                 type="number"
//                 min="1"
//                 value={refundQuantity}
//                 onChange={(e) =>
//                   setRefundQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                 }
//                 style={{ width: 80, marginLeft: 8 }}
//               />
//             </div>
//           )}
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default ReportRequests;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Tabs, Button, Modal, message, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  fetchReports,
  approveReport,
  refundReport,
} from "../../redux/slices/feedbackSlice";
import moment from "moment";

const { TabPane } = Tabs;

const ReportRequests = () => {
  const dispatch = useDispatch();
  const { reports, pageIndex, pageSize, totalCount } = useSelector(
    (state) => state.feedback
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("");
  const [refundQuantity, setRefundQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("0");

  const statusTabs = [
    { key: "0", title: "Pending", statusFilter: 0 },
    { key: "1", title: "Approved", statusFilter: 1 },
    { key: "2", title: "Refunded", statusFilter: 2 },
  ];

  const getProductTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "DEVICE";
      case 2:
        return "COMBO";
      case 3:
        return "LAB";
      default:
        return "UNKNOWN";
    }
  };

  const fetchData = (params = {}) => {
    const currentTab = statusTabs.find((tab) => tab.key === activeTab);

    dispatch(
      fetchReports({
        payload: {
          pageIndex: params.page || pageIndex,
          pageSize: params.pageSize || pageSize,
          searchKeyword,
        },
        statusFilter: currentTab.statusFilter,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [searchKeyword, activeTab]);

  const handleSearch = () => {
    fetchData({ page: 1 });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const showConfirmModal = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setRefundQuantity(1); // Reset refund quantity when opening modal
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (actionType === "approve") {
      dispatch(approveReport(selectedReport.id))
        .unwrap()
        .then(() => {
          message.success("Report approved successfully!");
          fetchData();
        })
        .catch((error) => {
          message.error(error || "Failed to approve report");
        });
    } else if (actionType === "refund") {
      dispatch(refundReport({ reportId: selectedReport.id, refundQuantity }))
        .unwrap()
        .then(() => {
          message.success("Report refunded successfully!");
          fetchData();
        })
        .catch((error) => {
          message.error(error || "Failed to refund report");
        });
    }
    setIsModalOpen(false);
  };

  const calculateRefundAmount = () => {
    if (!selectedReport) return 0;
    return selectedReport.price * refundQuantity;
  };
  const handlePageChange = (page, pageSize) => {
    fetchData({ page, pageSize });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-md p-4 overflow-hidden shadow-lg">
        <div className="mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">
          <h1 className="text-2xl font-bold text-black">Report Requests</h1>
          <Input
            placeholder="Search reports..."
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className="w-full sm:w-64"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <Tabs
          defaultActiveKey="0"
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          {statusTabs.map((tab) => (
            <TabPane tab={tab.title} key={tab.key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 ">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-100 bg-white"
                    bodyStyle={{ padding: "12px" }}
                    hoverable
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-headerBg line-clamp-2">
                        {report.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 italic bg-blue-50 p-2 rounded-md">
                        {report.content}
                      </p>
                    </div>
                    <p>
                      <span className="font-medium text-gray-900">
                        Product Name:
                      </span>{" "}
                      <span
                        className="text-gray-600 line-clamp-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "3em",
                        }}
                      >
                        {report.productName}
                      </span>
                    </p>
                    {/* Thông tin chi tiết */}
                    <p className="my-2">
                      <span className="font-medium text-gray-900">
                        Order Code:
                      </span>{" "}
                      <span className="text-gray-600">{report.orderCode}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-2 ">
                        <p>
                          <span className="font-medium text-gray-900">
                            Type:
                          </span>{" "}
                          <span className="text-gray-600">
                            {getProductTypeLabel(report.productType)}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Name:
                          </span>{" "}
                          <span className="text-gray-600">
                            {report.createdByFullname}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2 ">
                        <p>
                          <span className="font-medium text-gray-900">
                            Price:
                          </span>{" "}
                          <span className="text-gray-600 wrap no">
                            {report.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Contact:
                          </span>{" "}
                          <span className="text-gray-600 wrap no">
                            {report.contactNumber}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      <p>
                        <span className="font-medium text-gray-900">
                          Email:
                        </span>{" "}
                        <span className="text-gray-600">
                          {report.createdByEmail}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">
                          Created:
                        </span>{" "}
                        <span className="text-gray-600">
                          {moment(report.createdDate).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">
                          Store:
                        </span>{" "}
                        <span className="text-blue-600 cursor-pointer hover:underline">
                          {report.storeName}
                        </span>
                      </p>
                    </div>

                    {/* Nút hành động */}
                    {report.status === 0 && (
                      <div className="mt-6 flex gap-3">
                        <Button
                          type="primary"
                          className="w-full bg-headerBg hover:bg-blue-800 transition-colors rounded-lg font-medium"
                          onClick={() => showConfirmModal(report, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          danger
                          className="w-full hover:bg-red-700 transition-colors rounded-lg font-medium"
                          onClick={() => showConfirmModal(report, "refund")}
                        >
                          Refund
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {/* <div className="flex justify-center mt-4">
                <Button
                  disabled={pageIndex === 1}
                  onClick={() => fetchData({ page: pageIndex - 1 })}
                  className="mr-2"
                >
                  Previous
                </Button>
                <span className="mx-4 flex items-center">Page {pageIndex}</span>
                <Button
                  disabled={reports.length < pageSize}
                  onClick={() => fetchData({ page: pageIndex + 1 })}
                >
                  Next
                </Button>
              </div> */}
              <div className="flex justify-end mt-4">
                <Pagination
                  current={pageIndex}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `Total ${total} reports`}
                  style={{ marginTop: 16 }}
                />
              </div>
            </TabPane>
          ))}
        </Tabs>

        {/* Action Modal */}
        <Modal
          title={`Confirm ${actionType === "approve" ? "Approval" : "Refund"}`}
          open={isModalOpen}
          onOk={handleConfirm}
          onCancel={() => setIsModalOpen(false)}
          okText="Confirm"
          cancelText="Cancel"
          okButtonProps={{
            style: {
              backgroundColor: actionType === "approve" ? "#52c41a" : "#1890ff",
              borderColor: actionType === "approve" ? "#52c41a" : "#1890ff",
            },
          }}
        >
          <p>
            Are you sure you want to {actionType} this report from{" "}
            {selectedReport?.createdByFullname}?
          </p>
          {actionType === "refund" && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label>Refund Quantity: </label>
                <Input
                  type="number"
                  min="1"
                  value={refundQuantity}
                  onChange={(e) =>
                    setRefundQuantity(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  style={{ width: 80, marginLeft: 8 }}
                />
              </div>
              <div>
                <span>Refund Amount: </span>
                <span style={{ fontWeight: "bold" }}>
                  {calculateRefundAmount().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                {refundQuantity > 1 && (
                  <span style={{ color: "#888", marginLeft: 8 }}>
                    (
                    {selectedReport?.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                    × {refundQuantity})
                  </span>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReportRequests;
