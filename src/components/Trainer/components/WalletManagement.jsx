import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Tag,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Image,
} from "antd";
import { getTransactions } from "./../../../redux/slices/walletSlice";
import { getWalletBalance } from "./../../../redux/slices/paymentSlice";
import { fetchBanks } from "./../../../redux/slices/bankSlice";
import moment from "moment";
import BreadcrumbNav from "../../common/BreadcrumbNav";
import {
  getCashoutRequests,
  createCashoutRequest,
} from "./../../../redux/slices/walletSlice";

const WalletManagement = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.wallet);
  const {
    banks,
    loading: bankLoading,
    error: bankError,
  } = useSelector((state) => state.banks);
  const userId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { wallet } = useSelector((state) => state.payment);

  // const { Title } = Typography;

  useEffect(() => {
    dispatch(getTransactions({ pageIndex: 0, pageSize: 20 }));
    if (userId) {
      dispatch(getWalletBalance(userId));
    }
    dispatch(fetchBanks());
  }, [dispatch, userId]);

  useEffect(() => {
    if (bankError) {
      message.error(bankError);
    }
  }, [bankError]);

  const handleCashout = (values) => {
    const cashoutData = {
      ...values,
      amount: parseFloat(values.amount),
      bankName: values.bankName,
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
        message.error(error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Success"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "gray"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => moment(date).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        amount ? (
          <span className="text-green-600">
            {(amount * 1000).toLocaleString("vi-VN")} đ
          </span>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
  ];

  return (
    <div className="mx-auto container">
      <div className="max-w-6xl mb-4 container">
        <BreadcrumbNav
          items={[{ label: "Home", path: "/store" }, { label: "Wallet" }]}
        />
      </div>
      <div className="bg-white rounded-sm shadow-lg mx-auto p-4 my-4 container">
        {/* <div className="border-b mb-4 bg-white border-gray-200">
          <Title level={3} className="mb-0 text-gray-800">
            Transaction History
          </Title>
        </div> */}

        {/* Balance and Cashout Button */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg">
          <div className="flex space-x-2">
            <h2 className="text-xl font-bold font-Mainfont">
              Current Balance:
            </h2>
            <p className="text-xl font-bold font-Mainfont text-headerBg">
              {wallet?.ballance.toLocaleString() || 0} gold
            </p>
          </div>
          <Button
            type="primary"
            className="bg-headerBg"
            onClick={() => setIsModalOpen(true)}
          >
            Withdraw
          </Button>
        </div>

        {/* Transactions Table */}
        <Table
          columns={columns}
          dataSource={transactions.data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: transactions.pageIndex + 1,
            pageSize: transactions.pageSize,
            total: transactions.totalCount,
            onChange: (page) => {
              dispatch(getTransactions({ pageIndex: page - 1, pageSize: 20 }));
            },
          }}
          className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
          bordered
          style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
        />
      </div>
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
            rules={[{ required: true, message: "Please enter account number" }]}
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            name="bankName"
            label="Select Bank"
            rules={[{ required: true, message: "Please select a bank" }]}
          >
            <Select
              showSearch
              placeholder="Select a bank"
              optionFilterProp="children"
              loading={bankLoading}
              filterOption={(input, option) =>
                option.children[1]
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) ||
                option.code?.toLowerCase().includes(input.toLowerCase())
              }
              className="w-full"
            >
              {banks.map((bank) => (
                <Select.Option
                  key={bank.id}
                  value={bank.shortName}
                  code={bank.code}
                >
                  <div className="flex items-center">
                    <Image
                      src={bank.logo}
                      alt={bank.shortName}
                      width={40}
                      height={24}
                      preview={false}
                      className="mr-3"
                    />
                    <span className="flex-1 text-center">{bank.shortName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
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
  );
};

export default WalletManagement;
