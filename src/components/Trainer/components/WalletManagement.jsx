// WalletManagement.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Tag } from 'antd';
import { createCashoutRequest, getTransactions } from './../../../redux/slices/walletSlice';
import { getWalletBalance } from './../../../redux/slices/paymentSlice'; 
import moment from 'moment';

const WalletManagement = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { transactions, loading } = useSelector((state) => state.wallet);
  const { wallet } = useSelector((state) => state.payment); 
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    dispatch(getTransactions({ pageIndex: 0, pageSize: 20 }));
    if (userId) {
      dispatch(getWalletBalance(userId));
    }
  }, [dispatch, userId]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()} gold`,
    },
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={
            status === 'Success' ? 'green' : 
            status === 'Rejected' ? 'red' : 'gray'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => moment(date).format('DD-MM-YYYY HH:mm:ss'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Balance',
      dataIndex: 'currentBallance',
      key: 'currentBallance',
      render: (balance) => balance ? `${balance.toLocaleString()} gold` : 'N/A',
    },
  ];

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
        dispatch(getWalletBalance(userId)); // Refresh balance
      })
      .catch((error) => {
        console.error('Cashout error:', error);
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
          className="bg-white rounded-lg shadow"
        />

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
                { required: true, message: 'Please enter amount' },
                {
                  validator: (_, value) =>
                    value <= (wallet?.ballance || 0)
                      ? Promise.resolve()
                      : Promise.reject('Amount cannot exceed current balance'),
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
                { required: true, message: 'Please enter contact number' },
                { pattern: /^[0-9]+$/, message: 'Please enter valid number' },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="accountName"
              label="Account Name"
              rules={[{ required: true, message: 'Please enter account name' }]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[{ required: true, message: 'Please enter account number' }]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.Item
              name="bankName"
              label="Bank Name"
              rules={[{ required: true, message: 'Please enter bank name' }]}
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

export default WalletManagement;