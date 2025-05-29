import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tabs, Tag } from "antd";
import { getRefundRequests } from "./../redux/slices/walletSlice";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
const { TabPane } = Tabs;

const CustomerRefundManagement = () => {
  const dispatch = useDispatch();
  const { refundRequests, loading } = useSelector((state) => state.wallet);

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
      render: (amount) => `${amount.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "order Code",
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
  ];

  const handleTabChange = (key) => {
    const statusFilter = statusTabs.find((tab) => tab.key === key).statusFilter;
    dispatch(getRefundRequests({ statusFilter, pageIndex: 0, pageSize: 10 }));
  };

  return (
    <div className="mx-auto  p-8 bg-background min-h-screen container">
      <div className="max-w-6xl mb-4">
        <BreadcrumbNav
          items={[{ label: "Home", path: "/" }, { label: "Refund requests" }]}
        />
      </div>
      <div className="bg-white rounded-md p-4 overflow-hidden shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-6">Refund Requests</h1>

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
      </div>
    </div>
  );
};

export default CustomerRefundManagement;
