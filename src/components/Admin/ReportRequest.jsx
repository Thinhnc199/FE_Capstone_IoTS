import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Card, Input, Button, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  fetchReports,
  approveReport,
  refundReport,
} from "./../../redux/slices/feedbackSlice";

const { TabPane } = Tabs;

const ReportRequest = () => {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const { reports, loading } = useSelector((state) => state.feedback);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refundQuantity, setRefundQuantity] = useState(1); // Default to 1
  const [actionType, setActionType] = useState("");

  // Memoize fetchReportData với useCallback
  const fetchReportData = useCallback(
    (statusFilter) => {
      dispatch(
        fetchReports({
          pageIndex: 0,
          pageSize: 500000,
          searchKeyword,
          statusFilter,
        })
      );
    },
    [dispatch, searchKeyword]
  );

  useEffect(() => {
    fetchReportData(0);
  }, [fetchReportData]);

  const handleSearch = () => {
    fetchReportData(getActiveTabStatus());
  };

  const getActiveTabStatus = (key = "0") => {
    return parseInt(key);
  };

  const handleTabChange = (key) => {
    fetchReportData(getActiveTabStatus(key));
  };

  const showConfirmModal = (reportId, type) => {
    setSelectedReport(reportId);
    setActionType(type);
    setRefundQuantity(1); // Reset to default when opening modal
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    if (actionType === "approve") {
      dispatch(approveReport(selectedReport));
    } else if (actionType === "refund") {
      dispatch(refundReport({ reportId: selectedReport, refundQuantity }));
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  function ReportList({ reports, loading }) {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (!reports.length) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No reports found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-100 bg-white"
            bodyStyle={{ padding: "12px" }}
            hoverable
          >
            {/* Header */}
            <h3 className="text-lg font-semibold text-headerBg line-clamp-2">
              {report.title}
            </h3>

            {/* Content */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 italic bg-blue-50 p-2 rounded-md">
                {report.content}
              </p>
            </div>
            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-900">Order ID:</span>{" "}
                  <span className="text-gray-600">{report.orderItemId}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Product Name:
                  </span>{" "}
                  <span className="text-gray-600 line-clamp-2">
                    {report.productName}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-900">Type:</span>{" "}
                  <span className="text-gray-600">
                    {getProductTypeLabel(report.productType)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Contact:</span>{" "}
                  <span className="text-gray-600">{report.contactNumber}</span>
                </p>
              </div>
            </div>
            <p>
              <span className="font-medium text-gray-900">Order Code:</span>{" "}
              <span className="text-gray-600">{report.orderItemId}</span>
            </p>
            <p>
              <span className="font-medium text-gray-900">Name:</span>{" "}
              <span className="text-gray-600">{report.createdByFullname}</span>
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Create by email:
              </span>{" "}
              <span className="text-gray-600">{report.createdByEmail}</span>
            </p>
            <p>
              <span className="font-medium text-gray-900">Created:</span>{" "}
              <span className="text-gray-600">
                {new Date(report.createdDate).toLocaleString()}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-900">Store:</span>{" "}
              <span
                className="text-textColer cursor-pointer hover:underline hover:text-blue-700 transition-colors"
                // onClick={() => navigate(`/admin/user-detail/${report.storeId}`)}
              >
                {report.storeName}
              </span>
            </p>
            {/* Nút hành động */}
            {report.status === 0 && (
              <div className="mt-6 flex gap-3">
                <Button
                  type="primary"
                  className="w-full bg-headerBg hover:bg-blue-800 transition-colors rounded-lg font-medium"
                  onClick={() => showConfirmModal(report.id, "approve")}
                >
                  Approve
                </Button>
                <Button
                  danger
                  className="w-full hover:bg-red-700 transition-colors rounded-lg font-medium"
                  onClick={() => showConfirmModal(report.id, "refund")}
                >
                  Refund
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  ReportList.propTypes = {
    reports: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        orderItemId: PropTypes.number.isRequired,
        productId: PropTypes.number.isRequired,
        productType: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        createdByEmail: PropTypes.string.isRequired,
        createdByFullname: PropTypes.string.isRequired,
        contactNumber: PropTypes.string.isRequired,
        storeId: PropTypes.number.isRequired,
        storeName: PropTypes.string.isRequired,
        createdDate: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
      })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  return (
    <div className="p-4 mx-auto min-h-screen">
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
        onChange={handleTabChange}
        className="bg-white rounded-lg shadow p-6"
      >
        <TabPane tab="Pending" key="0">
          <ReportList
            reports={reports.filter((r) => r.status === 0)}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Approved" key="1">
          <ReportList
            reports={reports.filter((r) => r.status === 1)}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Refunded" key="2">
          <ReportList
            reports={reports.filter((r) => r.status === 2)}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={`Confirm ${actionType === "approve" ? "Approval" : "Refund"}`}
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
        }}
      >
        <p>Are you sure you want to {actionType} this report?</p>
        {actionType === "refund" && (
          <div style={{ marginTop: 16 }}>
            <label>Refund Quantity: </label>
            <Input
              type="number"
              min="1"
              value={refundQuantity}
              onChange={(e) =>
                setRefundQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{ width: 80, marginLeft: 8 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportRequest;
