import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComboDetails } from "./../../redux/slices/comboSlice";
import {
  Card,
  Row,
  Col,
  Image,
  Tabs,
  Table,
  Spin,
  Typography,
  notification,
  // Carousel,
} from "antd";
import {
  InfoCircleOutlined,
  FileTextOutlined,
  TagsOutlined,
  ShopOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text } = Typography;
const { TabPane } = Tabs;

const ComboDetailPage = () => {
  const { comboId } = useParams();
  const dispatch = useDispatch();
  const { selectedCombo, loading, error } = useSelector((state) => state.combo);

  useEffect(() => {
    if (comboId) {
      dispatch(fetchComboDetails(comboId))
        .unwrap()
        .catch((err) => {
          notification.error({
            message: "Error",
            description: "Failed to fetch combo details: " + err.message,
          });
        });
    }
  }, [dispatch, comboId]);

  const columns = [
    { title: "Device Name", dataIndex: "deviceName", key: "deviceName" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
      key: "originalPrice",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
    },
  ];

  // Nếu đang tải, hiển thị Spin
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading combo details..." />
      </div>
    );
  }

  // Nếu có lỗi, hiển thị thông báo
  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  // Nếu không có dữ liệu
  if (!selectedCombo) {
    return <div className="p-4 text-center">No combo details available.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">
        {selectedCombo.data.name || "Combo Details"}
      </h1>

      <Row gutter={[24, 24]}>
        {/* Cột hình ảnh */}
        <Col span={8}>
          <Image
            width="100%"
            src={selectedCombo.data.imageUrl}
            alt={selectedCombo.data.name}
            className="rounded-lg"
          />
          {Array.isArray(selectedCombo.data.attachmentsList) &&
            selectedCombo.data.attachmentsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCombo.data.attachmentsList.map((attachment) => (
                  <Image
                    key={attachment.id}
                    width={80}
                    src={attachment.imageUrl}
                    alt="attachment"
                    className="rounded"
                  />
                ))}
              </div>
            )}
        </Col>

        {/* Cột thông tin */}
        <Col span={16}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined /> General Info
                </span>
              }
              key="1"
            >
              <Card>
                <p>
                  <ShopOutlined className="text-blue-500 mr-2" />
                  <strong>Store:</strong>{" "}
                  {selectedCombo.data.storeNavigationName}
                </p>
                <p>
                  <strong>Summary:</strong> {selectedCombo.data.summary}
                </p>
                <p>
                  <DollarCircleOutlined className="text-blue-500 mr-2" />
                  <strong>Price:</strong>{" "}
                  <Text className="text-blue-500 text-lg font-bold">
                    {selectedCombo.data.price.toLocaleString("vi-VN")} VND
                  </Text>
                </p>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Quantity:</strong> {selectedCombo.data.quantity}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Rating:</strong> {selectedCombo.data.rating} ⭐
                    </p>
                  </Col>
                </Row>
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined /> Description
                </span>
              }
              key="2"
            >
              <p>{selectedCombo.data.description}</p>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <TagsOutlined /> Specifications
                </span>
              }
              key="3"
            >
              <p>{selectedCombo.data.specifications}</p>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined /> Notes
                </span>
              }
              key="4"
            >
              <p>{selectedCombo.data.notes}</p>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Bảng danh sách thiết bị */}
      {selectedCombo.data.deviceComboList?.length > 0 && (
        <div className="mt-6">
          <Table
            title={() => <h3 className="font-semibold">Device List</h3>}
            dataSource={selectedCombo.data.deviceComboList}
            columns={columns}
            rowKey="deviceComboId"
            pagination={false}
            bordered
          />
        </div>
      )}
    </div>
  );
};

ComboDetailPage.propTypes = {
  comboId: PropTypes.string,
};

export default ComboDetailPage;
