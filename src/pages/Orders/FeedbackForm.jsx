import {
  Modal,
  Form,
  Input,
  Rate,
  Button,
  notification,
  Divider,
  Row,
  Col,
  Space,
} from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createFeedback } from "./../../redux/slices/feedbackSlice";

const FeedbackForm = ({ visible, onClose, order, fetchHistoryOrder }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const feedbackData = {
      orderId: order.orderId,
      sellerId: order.orderDetailsGrouped[0].sellerId,
      sellerRole: order.orderDetailsGrouped[0].sellerRole,
      feedbackList: order.orderDetailsGrouped[0].items.map((item) => ({
        orderItemId: item.orderItemId,
        comment: values[`comment_${item.orderItemId}`],
        rating: values[`rating_${item.orderItemId}`],
      })),
    };

    try {
      await dispatch(createFeedback(feedbackData)).unwrap();
      notification.success({
        message: "Feedback Submitted",
        description: "Thank you for your feedback!",
        placement: "topRight",
      });
      form.resetFields();
      onClose();
      fetchHistoryOrder();
    } catch (error) {
      notification.error({
        message: "Submission Failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        placement: "topRight",
      });
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "22px", fontWeight: "600", color: "#1f2937" }}>
          Feedback for Order #{order?.orderId}
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          style={{ borderRadius: "6px", padding: "6px 16px" }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          style={{ borderRadius: "6px", padding: "6px 16px" }}
        >
          Submit Feedback
        </Button>,
      ]}
      width={650}
      // bodyStyle={{ padding: "32px", backgroundColor: "#f9fafb" }}
      style={{ borderRadius: "12px" }}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {order?.orderDetailsGrouped[0]?.items.map((item, index) => (
          <div
            key={item.orderItemId}
            style={{
              marginBottom: "32px",
              padding: "8px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Thông tin sản phẩm */}
            <Row gutter={16} align="middle">
              <Col span={5}>
                <img
                  src={item.imageUrl}
                  alt={item.nameProduct}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "70px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Col>
              <Col span={19}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  {item.nameProduct}
                </h4>
              </Col>
            </Row>

            {/* Form đánh giá */}
            <Space
              direction="vertical"
              size="large"
              style={{ width: "100%", marginTop: "16px" }}
            >
              <Form.Item
                label={
                  <span style={{ fontWeight: "500", color: "#4b5563" }}>
                    Rating
                  </span>
                }
                name={`rating_${item.orderItemId}`}
                rules={[{ required: true, message: "Please provide a rating" }]}
                style={{ textAlign: "center" }} // Căn giữa label và Rate
              >
                <Rate
                  allowHalf
                  style={{
                    fontSize: "32px",
                    color: "#fadb14",
                    transition: "transform 0.2s",
                  }}
                  className="custom-rate"
                />
              </Form.Item>
              <Form.Item
                label={
                  <span style={{ fontWeight: "500", color: "#4b5563" }}>
                    Comment
                  </span>
                }
                name={`comment_${item.orderItemId}`}
                rules={[
                  { required: true, message: "Please provide a comment" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Share your thoughts about this product..."
                  style={{
                    resize: "none",
                    borderRadius: "6px",
                    borderColor: "#d1d5db",
                    padding: "8px 12px",
                  }}
                />
              </Form.Item>
            </Space>

            
            {index < order.orderDetailsGrouped[0].items.length - 1 && (
              <Divider style={{ margin: "24px 0", borderColor: "#e5e7eb" }} />
            )}
          </div>
        ))}
      </Form>
    </Modal>
  );
};

// Khai báo PropTypes để kiểm tra kiểu dữ liệu của props
FeedbackForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    orderDetailsGrouped: PropTypes.arrayOf(
      PropTypes.shape({
        sellerId: PropTypes.number.isRequired,
        sellerRole: PropTypes.number.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            orderItemId: PropTypes.number.isRequired,
            nameProduct: PropTypes.string.isRequired,
            imageUrl: PropTypes.string,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  fetchHistoryOrder: PropTypes.func.isRequired,
};

export default FeedbackForm;
