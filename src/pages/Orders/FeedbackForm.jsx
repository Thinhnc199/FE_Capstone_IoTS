// import {
//   Modal,
//   Form,
//   Input,
//   Rate,
//   Button,
//   notification,
//   Divider,
//   Row,
//   Col,
//   Space,
//   Card,
// } from "antd";
// import PropTypes from "prop-types";
// import { useDispatch } from "react-redux";
// import { createFeedback } from "./../../redux/slices/feedbackSlice";

// const FeedbackForm = ({ visible, onClose, sellerGroup, fetchHistoryOrder }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   const handleSubmit = async (values) => {
//     const feedbackData = {
//       orderId: sellerGroup.orderId,
//       sellerId: sellerGroup.sellerId,
//       sellerRole: sellerGroup.sellerRole,
//       feedbackList: sellerGroup.items.map((item) => ({
//         orderItemId: item.orderItemId,
//         comment: values[`comment_${item.orderItemId}`],
//         rating: values[`rating_${item.orderItemId}`],
//       })),
//     };

//     try {
//       await dispatch(createFeedback(feedbackData)).unwrap();
//       notification.success({
//         message: "Feedback Submitted",
//         description: "Thank you for your feedback!",
//         placement: "topRight",
//       });
//       form.resetFields();
//       onClose();
//       fetchHistoryOrder();
//     } catch (error) {
//       notification.error({
//         message: "Submission Failed",
//         description: error || "Something went wrong. Please try again.",
//         placement: "topRight",
//       });
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div style={{ fontSize: "22px", fontWeight: "600", color: "#1f2937" }}>
//           Feedback for {sellerGroup?.sellerName}
//         </div>
//       }
//       visible={visible}
//       onCancel={onClose}
//       footer={
//         <div style={{ textAlign: "center" }}>
//           <Space>
//             <Button
//               onClick={onClose}
//               style={{ borderRadius: "6px", padding: "6px 16px" }}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               onClick={() => form.submit()}
//               style={{ borderRadius: "6px", padding: "6px 16px" }}
//             >
//               Submit Feedback
//             </Button>
//           </Space>
//         </div>
//       }
//       width={700}
//       style={{ borderRadius: "12px" }}
//       bodyStyle={{ backgroundColor: "#f9fafb", padding: "24px" }}
//     >
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         {sellerGroup?.items.map((item, index) => (
//           <Card
//             key={item.orderItemId}
//             style={{
//               marginBottom: "24px",
//               borderRadius: "8px",
//               boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
//               backgroundColor: "#fff",
//             }}
//             bodyStyle={{ padding: "16px" }}
//           >
//             <Row gutter={16} align="middle">
//               <Col span={5}>
//                 <img
//                   src={item.imageUrl}
//                   alt={item.nameProduct}
//                   style={{
//                     width: "100%",
//                     height: "auto",
//                     maxHeight: "80px",
//                     objectFit: "cover",
//                     borderRadius: "6px",
//                     border: "1px solid #e5e7eb",
//                     transition: "transform 0.3s",
//                   }}
//                   onMouseOver={(e) =>
//                     (e.target.style.transform = "scale(1.05)")
//                   }
//                   onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//                 />
//               </Col>
//               <Col span={19}>
//                 <h4
//                   style={{
//                     margin: 0,
//                     fontSize: "16px",
//                     fontWeight: "500",
//                     color: "#374151",
//                   }}
//                 >
//                   {item.nameProduct}
//                 </h4>
//                 <p
//                   style={{
//                     color: "#6b7280",
//                     fontSize: "14px",
//                     margin: "4px 0 0",
//                   }}
//                 >
//                   Quantity: {item.quantity} | Price:{" "}
//                   {item.price.toLocaleString("vi-VN")}₫
//                 </p>
//               </Col>
//             </Row>

//             <Space
//               direction="vertical"
//               size="middle"
//               style={{ width: "100%", marginTop: "16px" }}
//             >
//               <Form.Item
//                 label={
//                   <span style={{ fontWeight: "500", color: "#4b5563" }}>
//                     Rating
//                   </span>
//                 }
//                 name={`rating_${item.orderItemId}`}
//                 rules={[{ required: true, message: "Please provide a rating" }]}
//                 style={{ textAlign: "center" }}
//               >
//                 <Rate
//                   allowHalf
//                   style={{
//                     fontSize: "32px",
//                     color: "#fadb14",
//                     transition: "transform 0.2s",
//                   }}
//                   className="custom-rate"
//                 />
//               </Form.Item>
//               <Form.Item
//                 label={
//                   <span style={{ fontWeight: "500", color: "#4b5563" }}>
//                     Comment
//                   </span>
//                 }
//                 name={`comment_${item.orderItemId}`}
//                 rules={[
//                   { required: true, message: "Please provide a comment" },
//                 ]}
//               >
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Share your thoughts about this product..."
//                   style={{
//                     resize: "none",
//                     borderRadius: "6px",
//                     borderColor: "#d1d5db",
//                     padding: "8px 12px",
//                     transition: "border-color 0.3s",
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
//                   onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//                 />
//               </Form.Item>
//             </Space>

//             {index < sellerGroup.items.length - 1 && (
//               <Divider style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />
//             )}
//           </Card>
//         ))}
//       </Form>
//     </Modal>
//   );
// };

// FeedbackForm.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   sellerGroup: PropTypes.shape({
//     orderId: PropTypes.number,
//     sellerId: PropTypes.number.isRequired,
//     sellerName: PropTypes.string.isRequired,
//     sellerRole: PropTypes.number.isRequired,
//     items: PropTypes.arrayOf(
//       PropTypes.shape({
//         orderItemId: PropTypes.number.isRequired,
//         nameProduct: PropTypes.string.isRequired,
//         imageUrl: PropTypes.string,
//         quantity: PropTypes.number.isRequired,
//         price: PropTypes.number.isRequired,
//       })
//     ).isRequired,
//   }).isRequired,
//   fetchHistoryOrder: PropTypes.func.isRequired,
// };

// export default FeedbackForm;
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
  Card,
  Alert,
} from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createFeedback } from "./../../redux/slices/feedbackSlice";
import { useState } from "react";

const FeedbackForm = ({ visible, onClose, sellerGroup, fetchHistoryOrder }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [hasLowRating, setHasLowRating] = useState(false);

  // Watch for rating changes to determine if we need to show bank info
  const handleValuesChange = (changedValues, allValues) => {
    const ratings = sellerGroup.items.map(
      (item) => allValues[`rating_${item.orderItemId}`]
    );

    const lowRatingExists = ratings.some((rating) => rating && rating < 2);
    setHasLowRating(lowRatingExists);
  };

  const handleSubmit = async (values) => {
    const feedbackData = {
      orderId: sellerGroup.orderId,
      sellerId: sellerGroup.sellerId,
      sellerRole: sellerGroup.sellerRole,
      feedbackList: sellerGroup.items.map((item) => ({
        orderItemId: item.orderItemId,
        comment: values[`comment_${item.orderItemId}`],
        rating: values[`rating_${item.orderItemId}`],
      })),
    };

    // Add bank info if there's a low rating
    if (hasLowRating) {
      feedbackData.bankName = values.bankName;
      feedbackData.accountName = values.accountName;
      feedbackData.accountNumber = values.accountNumber;
    }

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
        description: error || "Something went wrong. Please try again.",
        placement: "topRight",
      });
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "22px", fontWeight: "600", color: "#1f2937" }}>
          Feedback for {sellerGroup?.sellerName}
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              onClick={onClose}
              style={{ borderRadius: "6px", padding: "6px 16px" }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              style={{ borderRadius: "6px", padding: "6px 16px" }}
            >
              Submit Feedback
            </Button>
          </Space>
        </div>
      }
      width={700}
      style={{ borderRadius: "12px" }}
      bodyStyle={{ backgroundColor: "#f9fafb", padding: "24px" }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        {sellerGroup?.items.map((item, index) => (
          <Card
            key={item.orderItemId}
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Row gutter={16} align="middle">
              <Col span={5}>
                <img
                  src={item.imageUrl}
                  alt={item.nameProduct}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    transition: "transform 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
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
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    margin: "4px 0 0",
                  }}
                >
                  Quantity: {item.quantity} | Price:{" "}
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
              </Col>
            </Row>

            <Space
              direction="vertical"
              size="middle"
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
                style={{ textAlign: "center" }}
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
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </Form.Item>
            </Space>

            {index < sellerGroup.items.length - 1 && (
              <Divider style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />
            )}
          </Card>
        ))}

        {hasLowRating && (
          <Card
            style={{
              marginTop: "24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
              borderLeft: "4px solid #ef4444",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Alert
              message="Refund Information Required"
              description="Since you rated one or more items below 2 stars, please provide your bank account details for possible refund."
              type="warning"
              showIcon
              style={{ marginBottom: "16px" }}
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Bank Name"
                  name="bankName"
                  rules={[
                    {
                      required: hasLowRating,
                      message: "Please input your bank name",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Vietcombank, Techcombank" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Account Name"
                  name="accountName"
                  rules={[
                    {
                      required: hasLowRating,
                      message: "Please input account name",
                    },
                  ]}
                >
                  <Input placeholder="Account holder name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Account Number"
              name="accountNumber"
              rules={[
                {
                  required: hasLowRating,
                  message: "Please input account number",
                },
                {
                  pattern: /^\d+$/,
                  message: "Account number should contain only numbers",
                },
              ]}
            >
              <Input placeholder="Bank account number" />
            </Form.Item>
          </Card>
        )}
      </Form>
    </Modal>
  );
};

FeedbackForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sellerGroup: PropTypes.shape({
    orderId: PropTypes.number,
    sellerId: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    sellerRole: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        orderItemId: PropTypes.number.isRequired,
        nameProduct: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  fetchHistoryOrder: PropTypes.func.isRequired,
};

export default FeedbackForm;
