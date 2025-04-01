// WalletManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Button, Modal, Form, Input, Tag, message } from "antd";
import {
  getCashoutRequests,
  createCashoutRequest,
} from "./../../redux/slices/walletSlice";
import { getWalletBalance } from "./../../redux/slices/paymentSlice";

const { TabPane } = Tabs;

const WalletStore = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cashoutRequests, loading } = useSelector((state) => state.wallet);
  const { wallet } = useSelector((state) => state.payment);
  const userId = localStorage.getItem("userId");

  const statusTabs = [
    { key: "0", title: "Pending", statusFilter: 0 },
    { key: "1", title: "Success", statusFilter: 1 },
    { key: "2", title: "Rejected", statusFilter: 2 },
    { key: "3", title: "Other", statusFilter: 3 },
  ];

  useEffect(() => {
    // Initial load with Pending tab
    dispatch(
      getCashoutRequests({
        statusFilter: 0,
        pageIndex: 0,
        pageSize: 10,
        userId,
      })
    );
    if (userId) {
      dispatch(getWalletBalance(userId));
    }
  }, [dispatch, userId]);

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
  ];

  const handleTabChange = (key) => {
    const statusFilter = statusTabs.find((tab) => tab.key === key).statusFilter;
    dispatch(
      getCashoutRequests({ statusFilter, pageIndex: 0, pageSize: 10, userId })
    );
  };

  const handleCashout = (values) => {
    const cashoutData = {
      ...values,
      amount: parseFloat(values.amount),
    };
    dispatch(createCashoutRequest(cashoutData))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        dispatch(getWalletBalance(userId));
        dispatch(
          getCashoutRequests({ statusFilter: 0, pageIndex: 0, pageSize: 10 })
        );
        message.success("Withdrawal request submitted successfully!");
      })
      .catch((error) => {
        console.error("Cashout error:", error);
        message.error("Failed to submit withdrawal request:", error);
      });
  };

  return (
    <div className="p-6 bg-mainColer min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Balance and Cashout Button */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
          <div>
            <h2 className="text-xl font-bold text-textColer">
              Current Balance: {wallet?.ballance.toLocaleString() || 0} gold
            </h2>
          </div>
          <Button
            type="primary"
            className="bg-headerBg"
            onClick={() => setIsModalOpen(true)}
          >
            Withdraw
          </Button>
        </div>

        {/* Cashout Requests Table */}
        <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
          <h1 className="text-2xl font-bold text-black mb-6">
            Cashout Management
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
        </div>

        {/* Cashout Modal */}
        <Modal
          title="Withdrawal Request"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleCashout}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                { required: true, message: "Please enter amount" },
                {
                  validator: (_, value) =>
                    value <= (wallet?.ballance || 0)
                      ? Promise.resolve()
                      : Promise.reject("Amount cannot exceed current balance"),
                },
              ]}
            >
              <Input
                type="number"
                addonAfter=",000đ"
                min={0}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                { required: true, message: "Please enter contact number" },
                { pattern: /^[0-9]+$/, message: "Please enter valid number" },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="accountName"
              label="Account Name"
              rules={[{ required: true, message: "Please enter account name" }]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[
                { required: true, message: "Please enter account number" },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="bankName"
              label="Bank Name"
              rules={[{ required: true, message: "Please enter bank name" }]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-headerBg"
                loading={loading}
              >
                Submit Withdrawal
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default WalletStore;
