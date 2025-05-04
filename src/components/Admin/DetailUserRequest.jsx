import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  message,
  Spin,
  Tabs,
  Skeleton,
  Modal,
  Avatar,
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
import { getTrainerBusinessLicenseDetails } from "../../redux/slices/trainerSlice.js";
import ConfirmModal from "./components/ConfirmModal.jsx";
import { debounce } from "lodash";

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
  const [showIdCard, setShowIdCard] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (id) {
      setTabLoading({ 1: true });
      dispatch(fetchRequestDetails({ id })).finally(() =>
        setTabLoading({ 1: false })
      );
    }
  }, [dispatch, id, confirmUserRequest.isSuccess]);

  const handlePreview = useCallback((imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  }, []);

  const debouncedHandleTabChange = useCallback(
    debounce((key) => {
      setActiveTab(key);
      const userId = userRequestDetail.data?.userDetails?.id;
      const role = userRequestDetail.data?.userRequestInfo?.role?.label;

      if (key === "2" && userId && !storeDetails && role !== "Trainer") {
        setTabLoading((prev) => ({ ...prev, 2: true }));
        dispatch(getStoreDetails(userId)).then((response) => {
          if (response.payload && response.payload.data) {
            setStoreDetails(response.payload.data);
          }
          setTabLoading((prev) => ({ ...prev, 2: false }));
        });
      } else if (key === "3" && userId) {
        setTabLoading((prev) => ({ ...prev, 3: true }));
        if (role === "Trainer") {
          dispatch(getTrainerBusinessLicenseDetails(userId)).then(
            (response) => {
              if (response.payload) {
                setBusinessLicense(response.payload);
              }
              setTabLoading((prev) => ({ ...prev, 3: false }));
            }
          );
        } else if (storeDetails?.id) {
          dispatch(getBusinessLicenseDetails(storeDetails.id)).then(
            (response) => {
              if (response.payload) {
                setBusinessLicense(response.payload);
              }
              setTabLoading((prev) => ({ ...prev, 3: false }));
            }
          );
        } else {
          setTabLoading((prev) => ({ ...prev, 3: false }));
        }
      }
    }, 300),
    [dispatch, userRequestDetail.data, storeDetails]
  );

  const showModal = useCallback((type) => {
    setActionType(type);
    setOpen(true);
  }, []);

  const handleOk = useCallback(async () => {
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
  }, [actionType, dispatch, remark, messageApi, userRequestDetail.data]);

  const isTrainer = useMemo(
    () => userRequestDetail.data?.userRequestInfo?.role?.label === "Trainer",
    [userRequestDetail.data]
  );

  const fullAddress = useMemo(
    () =>
      storeDetails
        ? `${storeDetails.addressName}, ${storeDetails.wardName}, ${storeDetails.districtName}, ${storeDetails.provinceName}`
        : userRequestDetail.data?.userDetails?.address || "",
    [storeDetails, userRequestDetail.data]
  );

  if (userRequestDetail.loading || storeLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  if (userRequestDetail.error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {userRequestDetail.error}
      </div>
    );
  }

  if (!userRequestDetail.data) {
    return <div className="text-center p-4">No data available.</div>;
  }

  const { userRequestInfo, userDetails } = userRequestDetail.data;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {contextHolder}
      {/* User Info */}
      {userDetails && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userDetails.fullname}
              </h2>
              <p className="text-sm text-gray-500">{userDetails.username}</p>
            </div>
            <div className="flex space-x-3">
              {userRequestInfo.userRequestStatus?.label === "Approved" ||
              userRequestInfo.userRequestStatus?.label === "Rejected" ? null : (
                <>
                  <Button
                    onClick={() => showModal("reject")}
                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => showModal("approve")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
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
        onChange={debouncedHandleTabChange}
        className="font-semibold"
      >
        {/* Tab 1: Profile */}
        <Tabs.TabPane tab="Profile" key="1">
          {tabLoading[1] ? (
            <div className="p-4">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : (
            userDetails && (
              <Row gutter={[16, 16]} className="p-4">
                <Col span={16}>
                  <Card
                    title="Information"
                    className="border border-gray-200 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">
                      <strong>ID:</strong> {userRequestInfo.id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {userRequestInfo.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Status:</strong>{" "}
                      {userRequestInfo.userRequestStatus?.label}
                    </p>
                    <p className="text-gray-700">
                      <strong>Role:</strong> {userRequestInfo.role?.label}
                    </p>
                    <p className="text-gray-700">
                      <strong>Created Date:</strong>{" "}
                      {userRequestInfo.createdDate}
                    </p>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title="Location"
                    className="border border-gray-200 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">
                      <EnvironmentOutlined className="mr-2" />
                      {userDetails.address}
                    </p>
                  </Card>
                </Col>
              </Row>
            )
          )}
        </Tabs.TabPane>

        {/* Tab 2: Store (only for non-Trainer roles) */}
        {!isTrainer && (
          <Tabs.TabPane tab="Store" key="2">
            {tabLoading[2] ? (
              <div className="p-4">
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            ) : storeDetails ? (
              <Row gutter={[16, 16]} className="p-4">
                <Col span={16}>
                  <Card
                    title="Summary"
                    className="border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="text-gray-600">{storeDetails.summary}</div>
                  </Card>
                  <Card
                    title="Description"
                    className="border border-gray-200 rounded-lg shadow-sm mt-4"
                  >
                    <div className="text-gray-600">
                      {storeDetails.description}
                    </div>
                  </Card>
                  <Card
                    title="Store Attachments"
                    className="border border-gray-200 rounded-lg shadow-sm mt-4"
                  >
                    <div className="flex flex-wrap gap-4 mt-2">
                      {storeDetails.storeAttachments?.length > 0 ? (
                        storeDetails.storeAttachments.map((attachment) => (
                          <div key={attachment.id} className="relative">
                            <img
                              src={attachment.imageUrl}
                              alt="Attachment"
                              className="w-32 h-32 object-cover rounded-lg shadow-sm cursor-pointer"
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
                        <p className="text-gray-600">
                          No attachments available.
                        </p>
                      )}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title="Information"
                    className="border border-gray-200 rounded-lg shadow-sm"
                  >
                    <Avatar
                      size={250}
                      src={
                        storeDetails?.imageUrl ||
                        userDetails.imageUrl ||
                        "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
                      }
                      alt="avatar"
                      className="border-4 border-white shadow-lg rounded-full object-cover mb-6"
                    />
                    <div className="flex flex-col gap-4 text-gray-700">
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
              <p className="p-4 text-gray-600">No store details available.</p>
            )}
          </Tabs.TabPane>
        )}

        {/* Tab 3: Business License */}
        <Tabs.TabPane tab="Business License" key="3">
          {tabLoading[3] ? (
            <div className="p-4">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : businessLicense ? (
            <Row gutter={[16, 16]} className="p-4">
              <Col span={16}>
                <Card
                  title="Business License Details"
                  className="border border-gray-200 rounded-lg shadow-sm"
                >
                  <p className="text-gray-700">
                    <strong>
                      {isTrainer ? "License Number" : "Tax Number"}:
                    </strong>{" "}
                    {businessLicense.data?.liscenseNumber ||
                      businessLicense.data?.licenseNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Issued By:</strong> {businessLicense.data?.issueBy}
                  </p>
                  <p className="text-gray-700">
                    <strong>Issue Date:</strong>{" "}
                    {businessLicense.data?.issueDate?.split("T")[0]}
                  </p>
                  <p className="text-gray-700">
                    <strong>Expired Date:</strong>{" "}
                    {businessLicense.data?.expiredDate?.split("T")[0]}
                  </p>
                </Card>
                <Card
                  title="Identification Card"
                  className="border border-gray-200 rounded-lg shadow-sm mt-4"
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
                            className="w-32 h-32 object-cover rounded-lg shadow-sm cursor-pointer"
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
                            className="w-32 h-32 object-cover rounded-lg shadow-sm cursor-pointer"
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
                  className="border border-gray-200 rounded-lg shadow-sm mt-4"
                >
                  <div className="flex flex-wrap gap-4 mt-2">
                    {businessLicense.data?.businessLicences && (
                      <div className="relative">
                        <img
                          src={businessLicense.data.businessLicences}
                          alt="Business License"
                          className="w-32 h-32 object-cover rounded-lg shadow-sm cursor-pointer"
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
                <Card
                  title={isTrainer ? "Trainer Info" : "Store Info"}
                  className="border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col gap-4 text-gray-700">
                    <span>
                      <UserOutlined className="mr-2" />{" "}
                      {isTrainer ? userDetails.fullname : storeDetails?.name}
                    </span>
                    <span>
                      <EnvironmentOutlined className="mr-2" /> {fullAddress}
                    </span>
                    {isTrainer && (
                      <span>
                        <PhoneOutlined className="mr-2" /> {userDetails.phone}
                      </span>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <p className="p-4 text-gray-600">
              No business license details available.{" "}
              {!isTrainer && "Please load store details first."}
            </p>
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* Modal để preview ảnh */}
      <Modal
        open={previewVisible}
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
