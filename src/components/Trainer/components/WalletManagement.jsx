// // WalletManagement.jsx

// WalletManagement.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { getTransactions } from "./../../../redux/slices/walletSlice";
import { getWalletBalance } from "./../../../redux/slices/paymentSlice";
import moment from "moment";

const WalletManagement = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.wallet);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getTransactions({ pageIndex: 0, pageSize: 20 }));
    if (userId) {
      dispatch(getWalletBalance(userId));
    }
  }, [dispatch, userId]);

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
      title: "Balance",
      dataIndex: "currentBallance",
      key: "currentBallance",
      render: (balance) => (balance ? `${balance.toLocaleString()}` : "N/A"),
    },
  ];

  return (
    <div className="max-h-screen bg-white rounded-sm shadow-sm mx-auto p-4 my-4 container">
      {/* <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg"> */}
      {/* Transaction History Title */}
      <div className="bg-white rounded-md p-4 mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-black">Transaction History</h1>
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
    // </div>
  );
};

export default WalletManagement;
