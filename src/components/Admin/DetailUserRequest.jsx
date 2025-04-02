import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Tabs,
  Button,
  Card,
  Col,
  Row,
  message,
  Spin,
  Modal,
} from "antd";
import {
  fetchRequestDetails,
  approveUserRequests,
  rejectUserRequests,
} from "../../redux/slices/userRequestSlice.js";
import {
  getStoreDetails,
  getBusinessLicenseDetails,
} from "../../redux/slices/storeRegistrationSlice.js";
import ConfirmModal from "./components/ConfirmModal.jsx";

const DetailUserRequest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userRequestDetail, confirmUserRequest } = useSelector(
    (state) => state.userrequest
  );
  const { loading: storeLoading } = useSelector(
    (state) => state.storeRegistration
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState("1");
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState("");
  const [storeDetails, setStoreDetails] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [tabLoading, setTabLoading] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [showIdCard, setShowIdCard] = useState(false); // Trạng thái hiển thị ID Card
  const [previewVisible, setPreviewVisible] = useState(false); // Trạng thái Modal preview
  const [previewImage, setPreviewImage] = useState(""); // Hình ảnh được preview

  useEffect(() => {
    if (id) {
      setTabLoading((prev) => ({ ...prev, 1: true }));
      dispatch(fetchRequestDetails({ id })).finally(() =>
        setTabLoading((prev) => ({ ...prev, 1: false }))
      );

      const userId = userRequestDetail.data?.userDetails?.id || id;
      setTabLoading((prev) => ({ ...prev, 2: true }));
      dispatch(getStoreDetails(userId)).then((response) => {
        if (response.payload && response.payload.data) {
          setStoreDetails(response.payload.data);
        }
        setTabLoading((prev) => ({ ...prev, 2: false }));
      });
    }
  }, [dispatch, id, confirmUserRequest.isSuccess]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const userId = userRequestDetail.data?.userDetails?.id;

    if (key === "2" && userId && !storeDetails) {
      setTabLoading((prev) => ({ ...prev, 2: true }));
      dispatch(getStoreDetails(userId)).then((response) => {
        if (response.payload && response.payload.data) {
          setStoreDetails(response.payload.data);
        }
        setTabLoading((prev) => ({ ...prev, 2: false }));
      });
    } else if (key === "3" && storeDetails?.id && !businessLicense) {
      setTabLoading((prev) => ({ ...prev, 3: true }));
      dispatch(getBusinessLicenseDetails(storeDetails.id)).then((response) => {
        if (response.payload) {
          setBusinessLicense(response.payload);
        }
        setTabLoading((prev) => ({ ...prev, 3: false }));
      });
    }
  };

  const showModal = (type) => {
    setActionType(type);
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      if (actionType === "approve") {
        await dispatch(
          approveUserRequests({
            id: userRequestDetail.data.userRequestInfo.id,
            remark,
          })
        ).unwrap();
        messageApi.success(`Success to ${actionType} user request`);
      } else if (actionType === "reject") {
        await dispatch(
          rejectUserRequests({
            id: userRequestDetail.data.userRequestInfo.id,
            remark,
          })
        ).unwrap();
        messageApi.success(`Success to ${actionType} user request`);
      }
      setOpen(false);
      setRemark("");
    } catch (error) {
      messageApi.error(`Error: ${error}`);
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  if (userRequestDetail.loading || storeLoading)
    return <Spin tip="Loading..." />;
  if (userRequestDetail.error) return <p>Error: {userRequestDetail.error}</p>;
  if (!userRequestDetail.data) return <p>No data available.</p>;

  const { userRequestInfo, userDetails } = userRequestDetail.data;
  const fullAddress = storeDetails
    ? `${storeDetails.addressName}, ${storeDetails.wardName}, ${storeDetails.districtName}, ${storeDetails.provinceName}`
    : "";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-md border overflow-hidden">
      {contextHolder}
      {/* Avatar & User Info */}
      <div className="relative">
        <img
          src={
            storeDetails?.imageUrl ||
            "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
          }
          alt="Background"
          className="w-full h-72 object-cover"
        />
      </div>
      {userDetails && (
        <div className="relative flex gap-2 items-end -mt-16 pb-4 border-b pl-4">
          <Avatar
            size={150}
            src={
              storeDetails?.imageUrl ||
              "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
            }
            alt="avatar"
            className="border-4 border-white shadow-lg rounded-full object-cover"
          />
          <div className="flex items-center w-full px-4 justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{userDetails.fullname}</h2>
              <h5 className="text-sm font-semibold text-gray-600">
                {userDetails.username}
              </h5>
            </div>
            <div className="space-x-2">
              {userRequestInfo.userRequestStatus?.label ===
              "Approved" ? null : (
                <>
                  <Button onClick={() => showModal("reject")}>Reject</Button>
                  <Button type="primary" onClick={() => showModal("approve")}>
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="p-4 font-semibold"
      >
        {/* Tab 1: Profile */}
        <Tabs.TabPane tab="Profile" key="1">
          {tabLoading[1] ? (
            <div className="flex justify-center p-4">
              <Spin tip="Loading Profile..." />
            </div>
          ) : (
            userDetails && (
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
                      <strong>Created Date:</strong>{" "}
                      {userRequestInfo.createdDate}
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
            )
          )}
        </Tabs.TabPane>

        {/* Tab 2: Store */}
        <Tabs.TabPane tab="Store" key="2">
          {tabLoading[2] ? (
            <div className="flex justify-center p-4">
              <Spin tip="Loading Store Details..." />
            </div>
          ) : storeDetails ? (
            <Row gutter={16} className="p-4">
              <Col span={16}>
                <Card title="Summary" className="border border-gray-200">
                  <div className="text-gray-500">{storeDetails.summary}</div>
                </Card>
                <Card
                  title="Description"
                  className="border border-gray-200 mt-5"
                >
                  <div className="text-gray-500">
                    {storeDetails.description}
                  </div>
                </Card>
                <Card
                  title="Store Attachments"
                  className="border border-gray-200 mt-5"
                >
                  <div className="flex flex-wrap gap-4 mt-2">
                    {storeDetails.storeAttachments?.length > 0 ? (
                      storeDetails.storeAttachments.map((attachment) => (
                        <div key={attachment.id} className="relative">
                          <img
                            src={attachment.imageUrl}
                            alt="Attachment"
                            className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer"
                            onClick={() => handlePreview(attachment.imageUrl)}
                          />
                          <Button
                            type="link"
                            icon={<EyeOutlined />}
                            className="absolute top-1 right-1"
                            onClick={() => handlePreview(attachment.imageUrl)}
                          />
                        </div>
                      ))
                    ) : (
                      <p>No attachments available.</p>
                    )}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Information" className="border border-gray-200">
                  <div className="flex flex-col gap-4 text-gray-800">
                    <span>
                      <UserOutlined className="mr-2" /> {storeDetails.name}
                    </span>
                    <span>
                      <EnvironmentOutlined className="mr-2" /> {fullAddress}
                    </span>
                    <span>
                      <PhoneOutlined className="mr-2" />{" "}
                      {storeDetails.contactNumber}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <p>No store details available.</p>
          )}
        </Tabs.TabPane>

        {/* Tab 3: Business License */}
        <Tabs.TabPane tab="Business License" key="3">
          {tabLoading[3] ? (
            <div className="flex justify-center p-4">
              <Spin tip="Loading Business License..." />
            </div>
          ) : businessLicense ? (
            <Row gutter={16} className="p-4">
              <Col span={16}>
                <Card
                  title="Business License Details"
                  className="border border-gray-200"
                >
                  <p>
                    <strong>License Number:</strong>{" "}
                    {businessLicense.data?.liscenseNumber}
                  </p>
                  <p>
                    <strong>Issued By:</strong> {businessLicense.data?.issueBy}
                  </p>
                  <p>
                    <strong>Issue Date:</strong>{" "}
                    {businessLicense.data?.issueDate?.split("T")[0]}
                  </p>
                  <p>
                    <strong>Expired Date:</strong>{" "}
                    {businessLicense.data?.expiredDate?.split("T")[0]}
                  </p>
                </Card>
                <Card
                  title="Identification Card"
                  className="border border-gray-200 mt-5"
                  extra={
                    <Button
                      type="link"
                      onClick={() => setShowIdCard(!showIdCard)}
                    >
                      {showIdCard ? "Hide" : "Show"}
                    </Button>
                  }
                >
                  {showIdCard && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {businessLicense.data?.frontIdentification && (
                        <div className="relative">
                          <img
                            src={businessLicense.data.frontIdentification}
                            alt="Front Identification"
                            className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer"
                            onClick={() =>
                              handlePreview(
                                businessLicense.data.frontIdentification
                              )
                            }
                          />
                          <span className="block text-center mt-1 text-gray-600">
                            Front ID
                          </span>
                          <Button
                            type="link"
                            icon={<EyeOutlined />}
                            className="absolute top-1 right-1"
                            onClick={() =>
                              handlePreview(
                                businessLicense.data.frontIdentification
                              )
                            }
                          />
                        </div>
                      )}
                      {businessLicense.data?.backIdentification && (
                        <div className="relative">
                          <img
                            src={businessLicense.data.backIdentification}
                            alt="Back Identification"
                            className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer"
                            onClick={() =>
                              handlePreview(
                                businessLicense.data.backIdentification
                              )
                            }
                          />
                          <span className="block text-center mt-1 text-gray-600">
                            Back ID
                          </span>
                          <Button
                            type="link"
                            icon={<EyeOutlined />}
                            className="absolute top-1 right-1"
                            onClick={() =>
                              handlePreview(
                                businessLicense.data.backIdentification
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
                <Card
                  title="Business License Document"
                  className="border border-gray-200 mt-5"
                >
                  <div className="flex flex-wrap gap-4 mt-2">
                    {businessLicense.data?.businessLicences && (
                      <div className="relative">
                        <img
                          src={businessLicense.data.businessLicences}
                          alt="Business License"
                          className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer"
                          onClick={() =>
                            handlePreview(businessLicense.data.businessLicences)
                          }
                        />
                        <span className="block text-center mt-1 text-gray-600">
                          Business License
                        </span>
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          className="absolute top-1 right-1"
                          onClick={() =>
                            handlePreview(businessLicense.data.businessLicences)
                          }
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Store Info" className="border border-gray-200">
                  <div className="flex flex-col gap-4 text-gray-800">
                    <span>
                      <UserOutlined className="mr-2" /> {storeDetails?.name}
                    </span>
                    <span>
                      <EnvironmentOutlined className="mr-2" /> {fullAddress}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <p>
              No business license details available. Please load store details
              first.
            </p>
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* Modal để preview ảnh */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

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
