// AdminWalletManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Button, Modal, Form, Input, Tag, message } from "antd";
import {
  getCashoutRequests,
  approveCashoutRequest,
  rejectCashoutRequest,
} from "./../../redux/slices/walletSlice";
import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;

const AdminWalletManagement = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);

  const { cashoutRequests, loading } = useSelector((state) => state.wallet);

  const statusTabs = [
    { key: "0", title: "Pending", statusFilter: 0 },
    { key: "1", title: "Success", statusFilter: 1 },
    { key: "2", title: "Rejected", statusFilter: 2 },
    { key: "3", title: "Other", statusFilter: 3 },
  ];

  useEffect(() => {
    // Initial load with Pending tab
    dispatch(
      getCashoutRequests({ statusFilter: 0, pageIndex: 0, pageSize: 10 })
    );
  }, [dispatch]);

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${(amount * 1000).toLocaleString("vi-VN")}đ`,
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
      dataIndex: "createdByNavigationFullname",
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
          case 1: // Success
            color = "green";
            break;
          case 2: // Rejected
            color = "red";
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
              className="bg-green-600 hover:bg-green-700 transition-colors"
              icon={<CheckCircleOutlined />}
              onClick={() => handleAction(record, "approve")}
            >
              Approve
            </Button>

            <Button
              danger
              size="small"
              className="hover:bg-red-700 transition-colors"
              icon={<CloseCircleOutlined />}
              onClick={() => handleAction(record, "reject")}
            >
              Reject
            </Button>
          </div>
        ),
    },
  ];

  const handleAction = (record, type) => {
    setSelectedRequest(record);
    setActionType(type);
    setIsModalOpen(true);
    if (type === "approve") {
      form.resetFields();
    }
  };

  const handleSubmit = (values) => {
    if (actionType === "approve") {
      dispatch(approveCashoutRequest(selectedRequest.id))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          dispatch(
            getCashoutRequests({
              statusFilter:
                statusTabs.find((tab) => tab.key === Tabs.activeKey)
                  ?.statusFilter || 0,
              pageIndex: 0,
              pageSize: 10,
            })
          );
          message.success("Cashout request approved successfully!");
        })
        .catch((error) => {
          console.error("Approve error:", error);
          message.error("Failed to approve cashout request:", error);
        });
    } else if (actionType === "reject") {
      dispatch(
        rejectCashoutRequest({
          id: selectedRequest.id,
          remark: values.remark,
        })
      )
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          form.resetFields();
          dispatch(
            getCashoutRequests({
              statusFilter:
                statusTabs.find((tab) => tab.key === Tabs.activeKey)
                  ?.statusFilter || 0,
              pageIndex: 0,
              pageSize: 10,
            })
          );
          message.success("Cashout request rejected successfully!");
        })
        .catch((error) => {
          console.error("Reject error:", error);
          message.error("Failed to reject cashout request:", error);
        });
    }
  };
  // const handleSubmit = (values) => {
  //   if (actionType === 'approve') {
  //     dispatch(approveCashoutRequest(selectedRequest.id))
  //       .unwrap()
  //       .then(() => {
  //         setIsModalOpen(false);
  //         dispatch(getCashoutRequests({
  //           statusFilter: statusTabs.find(tab => tab.key === Tabs.activeKey)?.statusFilter || 0,
  //           pageIndex: 0,
  //           pageSize: 10
  //         }));

  //       });
  //   } else if (actionType === 'reject') {
  //     dispatch(rejectCashoutRequest({
  //       id: selectedRequest.id,
  //       remark: values.remark
  //     }))
  //       .unwrap()
  //       .then(() => {
  //         setIsModalOpen(false);
  //         form.resetFields();
  //         dispatch(getCashoutRequests({
  //           statusFilter: statusTabs.find(tab => tab.key === Tabs.activeKey)?.statusFilter || 0,
  //           pageIndex: 0,
  //           pageSize: 10
  //         }));
  //       });
  //   }
  // };

  const handleTabChange = (key) => {
    const statusFilter = statusTabs.find((tab) => tab.key === key).statusFilter;
    dispatch(getCashoutRequests({ statusFilter, pageIndex: 0, pageSize: 10 }));
  };

  return (
    <div className="p-6 bg-mainColer min-h-screen">
      <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-6">
          Cashout Requests Management
        </h1>

        <Tabs defaultActiveKey="0" onChange={handleTabChange}>
          {statusTabs.map((tab) => (
            <TabPane tab={tab.title} key={tab.key}>
              <Table
                columns={columns}
                dataSource={cashoutRequests.data}
                loading={loading}
                rowKey="id"
                pagination={{
                  current: cashoutRequests.pageIndex + 1,
                  pageSize: cashoutRequests.pageSize,
                  total: cashoutRequests.totalCount,
                  onChange: (page) => {
                    dispatch(
                      getCashoutRequests({
                        statusFilter: tab.statusFilter,
                        pageIndex: page - 1,
                        pageSize: 10,
                      })
                    );
                  },
                }}
                className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
                bordered
                style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
              />
            </TabPane>
          ))}
        </Tabs>

        {/* Action Modal */}
        <Modal
          title={
            actionType === "approve" ? "Confirm Approval" : "Reject Request"
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
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
                    {(selectedRequest.amount * 1000).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Account Name:
                  </span>
                  <p className="text-gray-900">{selectedRequest.accountName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Account Number:
                  </span>
                  <p className="text-gray-900">
                    {selectedRequest.accountNumber}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Bank Name:</span>
                  <p className="text-gray-900">{selectedRequest.bankName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Requested By:
                  </span>
                  <p className="text-gray-900">
                    {selectedRequest.createdByNavigationFullname}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Requested At:
                  </span>
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

          {actionType === "reject" && (
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="remark"
                label="Reason for Rejection"
                rules={[{ required: true, message: "Please provide a reason" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  Submit Rejection
                </Button>
              </Form.Item>
            </Form>
          )}

          {actionType === "approve" && (
            <Button
              type="primary"
              className="w-full bg-green-600"
              onClick={() => handleSubmit()}
              loading={loading}
            >
              Confirm Approval
            </Button>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminWalletManagement;
