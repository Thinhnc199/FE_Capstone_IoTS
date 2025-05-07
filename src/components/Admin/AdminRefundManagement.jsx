import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Button, Modal, message,Tag } from "antd";
import { getRefundRequests, handleRefundRequest } from "./../../redux/slices/walletSlice";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;

const AdminRefundManagement = () => {
  const dispatch = useDispatch();
  const { refundRequests, loading } = useSelector((state) => state.wallet);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const statusTabs = [
    { key: "0", title: "Pending", statusFilter: 0 },
    { key: "1", title: "Handled", statusFilter: 1 },
  ];

  useEffect(() => {
    // Initial load with Pending tab
    dispatch(
      getRefundRequests({ statusFilter: 0, pageIndex: 0, pageSize: 10 })
    );
  }, [dispatch]);

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${(amount).toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Created By",
      dataIndex: ["createdByNavigation", "fullname"],
      key: "createdBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusItem = statusTabs.find(
          (tab) => tab.statusFilter === status
        );
        const text = statusItem ? statusItem.title : "Unknown";

        let color;
        switch (status) {
          case 1: // Handled
            color = "green";
            break;
          case 0: // Pending
            color = "gray";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) =>
        record.status === 0 && (
          <div className="flex gap-2 justify-center">
            <Button
              type="primary"
              size="small"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              icon={<CheckCircleOutlined />}
              onClick={() => handleAction(record)}
            >
              Handle
            </Button>
          </div>
        ),
    },
  ];

  const handleAction = (record) => {
    setSelectedRequest(record);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    dispatch(handleRefundRequest(selectedRequest.id))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        dispatch(
          getRefundRequests({
            statusFilter:
              statusTabs.find((tab) => tab.key === Tabs.activeKey)?.statusFilter || 0,
            pageIndex: 0,
            pageSize: 10,
          })
        );
        message.success("Refund request handled successfully!");
      })
      .catch((error) => {
        console.error("Handle error:", error);
        message.error(error?.response?.data?.message || "Failed to handle refund request");
      });
  };

  const handleTabChange = (key) => {
    const statusFilter = statusTabs.find((tab) => tab.key === key).statusFilter;
    dispatch(getRefundRequests({ statusFilter, pageIndex: 0, pageSize: 10 }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-md p-4 overflow-hidden shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-6">
          Refund Requests Management
        </h1>

        <Tabs defaultActiveKey="0" onChange={handleTabChange}>
          {statusTabs.map((tab) => (
            <TabPane tab={tab.title} key={tab.key}>
              <Table
                columns={columns}
                dataSource={refundRequests.data}
                loading={loading}
                rowKey="id"
                pagination={{
                  current: refundRequests.pageIndex + 1,
                  pageSize: refundRequests.pageSize,
                  total: refundRequests.totalCount,
                  onChange: (page) => {
                    dispatch(
                      getRefundRequests({
                        statusFilter: tab.statusFilter,
                        pageIndex: page - 1,
                        pageSize: 10,
                      })
                    );
                  },
                }}
                className="[&_.ant-table-thead_th]:!bg-blue-600 [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
                bordered
                style={{ borderColor: "#1E90FF" }}
              />
            </TabPane>
          ))}
        </Tabs>

        {/* Action Modal */}
        <Modal
          title="Confirm Handle Refund Request"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          footer={null}
        >
          {selectedRequest && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Request Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Amount:</span>
                  <p className="text-gray-900">
                    {(selectedRequest.amount).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <p className="text-gray-900">{selectedRequest.orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Account Name:</span>
                  <p className="text-gray-900">{selectedRequest.accountName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Account Number:</span>
                  <p className="text-gray-900">{selectedRequest.accountNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Bank Name:</span>
                  <p className="text-gray-900">{selectedRequest.bankName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Requested By:</span>
                  <p className="text-gray-900">
                    {selectedRequest.createdByNavigation?.fullname}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Requested At:</span>
                  <p className="text-gray-900">
                    {selectedRequest.createdDate
                      ? moment(selectedRequest.createdDate).format(
                          "DD-MM-YYYY HH:mm:ss"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="primary"
            className="w-full bg-blue-600"
            onClick={handleSubmit}
            loading={loading}
          >
            Confirm Handle
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default AdminRefundManagement;