import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { verifyAccounts } from "../redux/slices/accountSlice.js";

const VerifyAccount = () => {
  const { id: requestId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    dispatch(
      verifyAccounts({ otp: values.otp, requestId, password: values.password })
    )
      .unwrap()
      .then(() => {
        message.success("Account verified successfully!");
        // Thêm setTimeout để chuyển hướng sau 1 giây
        setTimeout(() => {
          navigate("/login"); // Chuyển hướng về trang login
        }, 1000); // 1000ms = 1 giây
      })
      .catch((err) => {
        message.error(`Error: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Verify Your Account
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="otp"
            label="OTP"
            rules={[{ required: true, message: "Please enter OTP" }]}
          >
            <Input placeholder="Enter OTP" />
          </Form.Item>
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: "Please enter new password" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: "Please confirm password" }]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
