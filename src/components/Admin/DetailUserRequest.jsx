import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Avatar, Tabs, Button, Card, Col, Row, Modal, Input } from "antd";
import {
  fetchRequestDetails,
  fetchStoreDetails,
  approveUserRequests,
  rejectUserRequests,
} from "../../redux/slices/userRequestSlice.js";

const DetailUserRequest = () => {
  const img =
    "https://firebasestorage.googleapis.com/v0/b/iot-trading-system-firebase.firebasestorage.app/o/image%2F030db93a-1141-4e9a-828b-2bdbd509219c.png.png?alt=media&token=29c75e05-bbf8-4dc5-bc53-6648f01e9031";
  const avatar = "https://clever.webpixels.io/img/people/img-profile.jpg";
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userRequestDetail, storeDetail } = useSelector(
    (state) => state.userrequest
  );
  const [activeTab, setActiveTab] = useState("1");
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState("");
  const showModal = (type) => {
    setActionType(type);
    setOpen(true);
  };
  const handleOk = async () => {
    if (actionType === "approve") {
      await dispatch(approveUserRequests({ remark, id: userRequestInfo.id }));
    } else if (actionType === "reject") {
      await dispatch(rejectUserRequests({ remark, id: userRequestInfo.id }));
    }

    setOpen(false);
    setRemark("");
    dispatch(fetchRequestDetails({ id })); // Cập nhật lại dữ liệu sau khi thao tác
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await dispatch(fetchRequestDetails({ id }));
      }
    };

    fetchData();
  }, [dispatch, id]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "2" && userRequestDetail.data.userDetails.id) {
      dispatch(
        fetchStoreDetails({ userId: userRequestDetail.data.userDetails.id })
      );
    }
  };

  if (userRequestDetail.loading) return <p>Loading...</p>;
  if (userRequestDetail.error) return <p>Error: {userRequestDetail.error}</p>;
  if (!userRequestDetail.data) return <p>No data available.</p>;

  const { userRequestInfo, userDetails } = userRequestDetail.data;
  const storeDetails = storeDetail.data;
  function HandleApprove(value) {
    dispatch(approveUserRequests({ remark: value, id: userRequestInfo.id }));
  }
  const items = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Store",
    },
    {
      key: "3",
      label: "More",
    },
  ];

  return (
    <div className="max-w mx-auto bg-bgColer shadow-md rounded-sm overflow-hidden">
      {/* Background Image */}
      <div className="relative">
        <img src={img} alt="Background" className="w-full h-72 object-cover" />
      </div>
      {/* Avatar & User Info */}

      {userDetails ? (
        <div className="relative flex gap-2 items-end -mt-16 pb-4 border-b pl-4">
          <div className="relative">
            <Avatar
              size={150}
              src={avatar}
              className="border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex items-center w-full px-4 justify-between ">
            <div className="">
              <h2 className="text-3xl font-semibold">{userDetails.fullname}</h2>
              <h5 className="text-sm font-semibold text-gray-600">
                {userDetails.username}
              </h5>
            </div>

            <div className="space-x-2">
              <Button onClick={() => showModal("reject")}>Reject</Button>
              <Button type="primary" onClick={() => showModal("approve")}>
                Approve
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p>No request information found.</p>
      )}

      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={handleTabChange}
        className="p-4 font-semibold"
      />

      {userDetails && activeTab === "1" && (
        <Row gutter={16} className="p-4">
          <Col span={16}>
            <Card
              title="Information"
              bordered={false}
              className="border border-gray-200"
            >
              <p>
                <strong>ID:</strong> {userRequestInfo.id}
              </p>
              <p>
                <strong>Email:</strong> {userRequestInfo.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {userRequestInfo.userRequestStatus?.label}
              </p>
              <p>
                <strong>Role:</strong> {userRequestInfo.role?.label}
              </p>
              <p>
                <strong>Created Date:</strong> {userRequestInfo.createdDate}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Location"
              bordered={true}
              className="font-medium border border-gray-200"
            >
              <EnvironmentOutlined /> {userDetails.address}
            </Card>
          </Col>
        </Row>
      )}

      {activeTab === "2" && storeDetails && (
        <Row gutter={16} className="p-4 ">
          <Col span={16}>
            <Card title="Name Store" className="border border-gray-200">
              <p>{storeDetails.name}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {storeDetails.storeAttachments?.length > 0 ? (
                  storeDetails.storeAttachments.map((attachment) => (
                    <img
                      key={attachment.id}
                      src={attachment.imageUrl}
                      alt={`Attachment ${attachment.id}`}
                      className="w-32 h-32 object-cover rounded-lg shadow"
                    />
                  ))
                ) : (
                  <p>No attachments available.</p>
                )}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Location"
              bordered={true}
              className="font-medium border border-gray-200"
            >
              <EnvironmentOutlined /> {userDetails.address}
            </Card>
          </Col>
        </Row>
      )}

      <div>
        <Modal
          title={
            actionType === "approve"
              ? "Approve User Request ?"
              : "Reject User Request ?"
          }
          className=""
          open={open}
          onOk={handleOk}
          onCancel={() => setOpen(false)}
        >
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Nhập lý do..."
          />
        </Modal>
      </div>
    </div>
  );
};

export default DetailUserRequest;
