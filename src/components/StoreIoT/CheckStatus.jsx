import { useEffect, useState } from "react";
import { Spin, Tooltip, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../api/apiConfig";

const statusColors = {
  "Pending to Approved": "gold",
  "Approved": "green",
  "Pending to Verify OTP": "gray",
  "Rejected": "red",
};

const CheckStatus = () => {
  const [status, setStatus] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await api.get(`/api/user-request/get-user-request-details-by-user-id/${userId}`);
        const userRequest = response.data.data.userRequestInfo;

        setStatus(userRequest?.userRequestStatus?.label);
        setRemark(userRequest?.remark);
      } catch (error) {
        console.error("Error fetching user status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStatus();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const showRemark = () => {
    Modal.info({
      title: "Remark Details",
      content: <p>{remark || "No additional remarks available."}</p>,
      okText: "Close",
    });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center" }}>
      <span>Welcome - Status: </span>
      <span style={{ color: statusColors[status] || "black", marginLeft: "10px" }}>{status || "No status available"}</span>

      {status === "Rejected" && (
        <Tooltip title="Click to view remark">
          <ExclamationCircleOutlined
            style={{ color: "red", marginLeft: "10px", cursor: "pointer" }}
            onClick={showRemark}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default CheckStatus;
