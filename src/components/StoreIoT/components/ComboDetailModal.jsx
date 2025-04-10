import { Modal, Image, Tabs, Card, Row, Col, Table } from "antd";
import {
  InfoCircleOutlined,
  FileTextOutlined,
  TagsOutlined,
  ShopOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import PropTypes from "prop-types"; // Import PropTypes

const { Text } = Typography;

const ComboDetailModal = ({ visible, onCancel, combo }) => {
  const columns = [
    { title: "Device Name", dataIndex: "deviceName", key: "deviceName" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Original Price",
      dataIndex: "originalPrice",
      key: "originalPrice",
    },
  ];

  return (
    <Modal
      title={combo?.name || "Loading..."}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      {combo && (
        <div className="flex gap-5">
          <div className="flex-1">
            <Image
              width={300}
              src={combo.imageUrl}
              alt="combo"
              className="rounded-lg"
            />
            {Array.isArray(combo.attachmentsList) &&
              combo.attachmentsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {combo.attachmentsList.map((attachment) => (
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
          </div>
          <div className="flex-2">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
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
                    <strong>Store:</strong> {combo.storeNavigationName}
                  </p>
                  <p>
                    <strong>Summary:</strong> {combo.summary}
                  </p>
                  <p>
                    <DollarCircleOutlined className="text-blue-500 mr-2" />
                    <strong>Price:</strong>{" "}
                    <Text className="text-blue-500 text-lg font-bold">
                      {combo.price}
                    </Text>
                  </p>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p>
                        <strong>Quantity:</strong> {combo.quantity}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Rating:</strong> {combo.rating} ⭐
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <FileTextOutlined /> Description
                  </span>
                }
                key="2"
              >
                <p>{combo.description}</p>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <TagsOutlined /> Specifications
                  </span>
                }
                key="3"
              >
                <p>{combo.specifications}</p>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <FileTextOutlined /> Notes
                  </span>
                }
                key="4"
              >
                <p>{combo.notes}</p>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      )}
      {combo?.deviceComboList?.length > 0 && (
        <Table
          title={() => "Device List"}
          dataSource={combo.deviceComboList}
          columns={columns}
          rowKey="deviceComboId"
          pagination={false}
        />
      )}
    </Modal>
  );
};

// Khai báo PropTypes
ComboDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  combo: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    attachmentsList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        imageUrl: PropTypes.string,
      })
    ),
    storeNavigationName: PropTypes.string,
    summary: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    specifications: PropTypes.string,
    notes: PropTypes.string,
    deviceComboList: PropTypes.arrayOf(
      PropTypes.shape({
        deviceName: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        deviceComboId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
};

export default ComboDetailModal;