import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Tabs, Button, Card, Col, Row, message } from "antd";
import {
  fetchRequestDetails,
  fetchStoreDetails,
  approveUserRequests,
  rejectUserRequests,
} from "../../redux/slices/userRequestSlice.js";
import ConfirmModal from "./components/ConfirmModal.jsx";
const DetailUserRequest = () => {
  const img =
    "https://i.postimg.cc/SxKL6YTm/Nature-HD-2560-x-1440-Image.jpg' border='0' alt='Nature-HD-2560-x-1440-Image";
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userRequestDetail, storeDetail, confirmUserRequest } = useSelector(
    (state) => state.userrequest
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState("1");
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchRequestDetails({ id }));
  }, [dispatch, id, confirmUserRequest.isSuccess]);

  // console.log(
  //   "yye",
  //   userRequestDetail.data.userRequestInfo.userRequestStatus.label
  // );

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "2" && userRequestDetail.data?.userDetails?.id) {
      dispatch(
        fetchStoreDetails({ userId: userRequestDetail.data.userDetails.id })
      );
    }
  };
  useEffect(() => {
    if (confirmUserRequest.isSuccess !== null) {
      console.log("confirmUserRequest", confirmUserRequest);
    }
  }, [confirmUserRequest]);
  const showModal = (type) => {
    setActionType(type);
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      if (actionType === "approve") {
        const result = await dispatch(
          approveUserRequests({
            id: userRequestDetail.data.userRequestInfo.id,
            remark,
          })
        ).unwrap();

        messageApi.success(`Success to ${actionType} user request`);
        console.log("test ss", result.message);

        setOpen(false);
      } else if (actionType === "reject") {
        const result = await dispatch(
          rejectUserRequests({
            id: userRequestDetail.data.userRequestInfo.id,
            remark,
          })
        ).unwrap();

        console.log("confirmUserRequest", result.message);
        messageApi.success(`Success to ${actionType} user request`);
        setOpen(false);
      }

      setRemark("");
    } catch (error) {
      messageApi.error(`Error: ${error}`);
    }
  };

  if (userRequestDetail.loading) return <p>Loading...</p>;
  if (userRequestDetail.error) return <p>Error: {userRequestDetail.error}</p>;
  if (!userRequestDetail.data) return <p>No data available.</p>;

  const { userRequestInfo, userDetails } = userRequestDetail.data;
  const storeDetails = storeDetail.data;
  console.log("userDetails", userDetails);
  console.log("userRequestInfo", userRequestInfo);
  console.log("storeDetails", storeDetails);

  return (
    <div className="max-w mx-auto bg-white rounded-md border overflow-hidden">
      {contextHolder}
      {/* Avatar & User Info */}
      <div className="relative">
        <img src={img} alt="Background" className="w-full h-72 object-cover" />
      </div>
      {userDetails && (
        <div className="relative flex gap-2 items-end -mt-16 pb-4 border-b pl-4">
          <div>
            {" "}
            <Avatar
              size={150}
              src="https://clever.webpixels.io/img/people/img-profile.jpg"
              alt="avata"
              className="border-4 border-white shadow-lg rounded-full object-cover "
            />
          </div>

          <div className="flex items-center w-full px-4 justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{userDetails.fullname}</h2>
              <h5 className="text-sm font-semibold text-gray-600">
                {userDetails.username}
              </h5>
            </div>
            <div className="space-x-2">
              {userRequestDetail?.data?.userRequestInfo?.userRequestStatus
                ?.label === "Approved" ? (
                <></>
              ) : (
                <>
                  <Button onClick={() => showModal("reject")}>Reject</Button>
                  <Button type="primary" onClick={() => showModal("approve")}>
                    Approve
                  </Button>
                </>
              )}

              {/* <>
                <Button onClick={() => showModal("reject")}>Reject</Button>
                <Button type="primary" onClick={() => showModal("approve")}>
                  Approve
                </Button>
              </> */}
            </div>
          </div>
        </div>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="p-4 font-semibold"
      >
        <Tabs.TabPane tab="Profile" key="1">
          {userDetails && (
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
                  className="border border-gray-200"
                >
                  <EnvironmentOutlined /> {userDetails.address}
                </Card>
              </Col>
            </Row>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Store" key="2">
          {storeDetails && (
            <Row gutter={16} className="p-4 ">
              <Col span={16}>
                <Card title="Description" className="border border-gray-200 ">
                  <div className="flex flex-col gap-4 text-gray-500">
                    {storeDetails.description}
                  </div>
                </Card>

                <Card title="My files" className="border border-gray-200 mt-5">
                  <div className="flex flex-wrap gap-4 mt-2">
                    {storeDetails.storeAttachments?.length > 0 ? (
                      storeDetails.storeAttachments.map((attachment) => (
                        <img
                          key={attachment.id}
                          src={attachment.imageUrl}
                          alt="Attachment"
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
                  title="Information"
                  bordered={true}
                  className="border border-gray-200 "
                >
                  <div className="flex flex-col gap-4 text-gray-800 ">
                    <span>
                      <UserOutlined className="mr-2" /> {storeDetails.name}
                    </span>
                    <span>
                      <EnvironmentOutlined className="mr-2" />
                      {storeDetails.address}
                    </span>
                    <span>
                      <PhoneOutlined className="mr-2" />
                      {storeDetails.contactNumber}
                    </span>

                    <span>
                      <EnvironmentOutlined /> {storeDetails.address}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="business lincense" key="3">
          {storeDetails && (
            <Row gutter={16} className="p-4">
              <Col span={16}>
                <Card title="Name Store" className="border border-gray-200">
                  <div className="flex flex-wrap gap-4 mt-2">
                    {storeDetails.storeAttachments?.length > 0 ? (
                      storeDetails.storeAttachments.map((attachment) => (
                        <img
                          key={attachment.id}
                          src={attachment.imageUrl}
                          alt="Attachment"
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
                  className="border border-gray-200"
                >
                  <EnvironmentOutlined /> {userDetails.address}
                </Card>
              </Col>
            </Row>
          )}
        </Tabs.TabPane>
      </Tabs>

      <ConfirmModal
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        actionType={actionType}
        remark={remark}
        setRemark={setRemark}
      />
    </div>
  );
};

export default DetailUserRequest;
