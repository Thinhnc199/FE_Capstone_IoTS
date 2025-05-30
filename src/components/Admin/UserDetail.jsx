import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  EyeOutlined,
  // SearchOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { Card, Tabs, Button, Spin, Table, message, Modal, Alert } from "antd";
import { fetchUserById } from "./../../redux/slices/accountSlice.js";
import {
  getStoreDetails,
  getBusinessLicenseDetails,
} from "./../../redux/slices/storeRegistrationSlice.js";
import { getTrainerBusinessLicenseDetails } from "./../../redux/slices/trainerSlice.js";
import { fetchActivityLog } from "./../../redux/slices/feedbackSlice.js";
import { Roles } from "./../../redux/constants.js";
import moment from "moment";
const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detailUser, loading, error } = useSelector((state) => state.accounts);
  const { loading: storeLoading } = useSelector(
    (state) => state.storeRegistration
  );
  const { activityLog } = useSelector((state) => state.feedback);
  const [messageApi, contextHolder] = message.useMessage();
  // const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activityError, setActivityError] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [tabLoading, setTabLoading] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [storeDetails, setStoreDetails] = useState(null);
  const [businessLicenseStore, setBusinessLicense] = useState(null);
  const [businessLicenseTrainer, setBusinessLicenseTrainer] = useState(null);
  const currentUserRole = localStorage.getItem("role");
  const isAdmin = parseInt(currentUserRole) === Roles.ADMIN;

  useEffect(() => {
    if (id) {
      setTabLoading((prev) => ({ ...prev, 1: true }));
      dispatch(fetchUserById({ id }))
        .unwrap()
        .catch((err) => messageApi.error(`Failed to fetch user: ${err}`))
        .finally(() => setTabLoading((prev) => ({ ...prev, 1: false })));
    }
  }, [dispatch, id, messageApi]);

  useEffect(() => {
    if (detailUser && id) {
      const userId = detailUser.id;
      const userRole = detailUser.roles?.[0]?.id;

      if (userRole === Roles.STORE) {
        setTabLoading((prev) => ({ ...prev, 2: true }));
        dispatch(getStoreDetails(userId))
          .unwrap()
          .then((response) => {
            if (response && response.data) {
              setStoreDetails(response.data);
              const storeId = response.data.id;
              if (storeId) {
                setTabLoading((prev) => ({ ...prev, 3: true }));
                dispatch(getBusinessLicenseDetails(storeId))
                  .unwrap()
                  .then((businessLicense) => {
                    if (businessLicense)
                      setBusinessLicense(businessLicense.data);
                  })
                  .catch((err) =>
                    messageApi.error(`Failed to fetch business license: ${err}`)
                  )
                  .finally(() =>
                    setTabLoading((prev) => ({ ...prev, 3: false }))
                  );
              }
            }
          })
          .catch((err) =>
            messageApi.error(`Failed to fetch store details: ${err}`)
          )
          .finally(() => setTabLoading((prev) => ({ ...prev, 2: false })));
      } else if (userRole === Roles.TRAINER) {
        setTabLoading((prev) => ({ ...prev, 3: true }));
        // dispatch(getTrainerBusinessLicenseDetails(userId))
        //   .unwrap()
        dispatch(getTrainerBusinessLicenseDetails(userId))
          .then((response) => {
            if (response.payload && response.payload.data) {
              setBusinessLicenseTrainer(response.payload.data);
            }
          })
          .catch((err) =>
            messageApi.error(`Failed to fetch trainer business license: ${err}`)
          )
          .finally(() => setTabLoading((prev) => ({ ...prev, 3: false })));
      }
    }
  }, [dispatch, detailUser, id, messageApi]);

  // const handleTabChange = (key) => {
  //   setActiveTab(key);
  //   if (!detailUser) return;

  //   const userId = detailUser.id;

  //   if (key === "2" && isAdmin && !activityLog.length) {
  //     setTabLoading((prev) => ({ ...prev, 4: true }));
  //     dispatch(
  //       fetchActivityLog({
  //         userId,
  //         payload: { pageIndex: 0, pageSize: 20, searchKeyword: "" },
  //       })
  //     )
  //       .unwrap()
  //       .catch((err) =>
  //         messageApi.error(`Failed to fetch activity log: ${err}`)
  //       )
  //       .finally(() => setTabLoading((prev) => ({ ...prev, 4: false })));
  //   }
  // };
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (!detailUser) return;

    const userId = detailUser.id;

    if (key === "2" && isAdmin) {
      setTabLoading((prev) => ({ ...prev, 4: true }));
      setActivityError(null);
      dispatch(
        fetchActivityLog({
          userId,
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            // searchKeyword,
          },
        })
      )
        .unwrap()
        .then((response) => {
          setPagination((prev) => ({
            ...prev,
            total: response.data.totalCount,
          }));
        })
        .catch((err) => {
          setActivityError(
            `Failed to fetch activity log: ${err.message || err}`
          );
          messageApi.error(
            `Failed to fetch activity log: ${err.message || err}`
          );
        })
        .finally(() => setTabLoading((prev) => ({ ...prev, 4: false })));
    }
  };

  // // Add function to handle search
  // const handleSearch = (value) => {
  //   setSearchKeyword(value);
  //   setPagination((prev) => ({ ...prev, current: 1 }));
  //   handleTabChange("2");
  // };

  // // Add function to handle refresh
  // const handleRefresh = () => {
  //   setSearchKeyword("");
  //   setPagination((prev) => ({ ...prev, current: 1 }));
  //   handleTabChange("2");
  // };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  if (loading || storeLoading)
    return (
      <Spin
        tip="Loading..."
        className="flex justify-center items-center h-screen"
      />
    );
  if (error)
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!detailUser)
    return <p className="text-center mt-10">No data available.</p>;

  const userRole = detailUser.roles?.[0]?.id;
  const fullAddress = storeDetails
    ? `${storeDetails.addressName}, ${storeDetails.wardName}, ${storeDetails.districtName}, ${storeDetails.provinceName}`
    : "";

  const activityColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Content", dataIndex: "content", key: "content" },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const tabs = [
    {
      key: "1",
      label: "User Information",
      children: (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          {/* General Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              General Information
            </h2>
            {tabLoading[1] ? (
              <Spin tip="Loading Profile..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong className="text-gray-900">ID:</strong>{" "}
                    {detailUser.id}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Email:</strong>{" "}
                    {detailUser.email}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Phone:</strong>{" "}
                    {detailUser.phone}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Gender:</strong>{" "}
                    {detailUser.gender === 1 ? "Male" : "Female"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Created Date:</strong>{" "}
                    {detailUser.createdDate}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Is Active:</strong>{" "}
                    {detailUser.isActive === 1 ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Address:</strong>{" "}
                    <EnvironmentOutlined className="text-blue-500 mr-1" />{" "}
                    {detailUser.address || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Store Information */}
          {userRole === Roles.STORE && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                Store Information
              </h2>
              {tabLoading[2] ? (
                <div className="flex justify-center py-6">
                  <Spin size="large" tip="Loading Store Details..." />
                </div>
              ) : storeDetails ? (
                <div className="space-y-6">
                  {/* Store Details Card */}
                  <Card className="border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              storeDetails?.imageUrl ||
                              detailUser.imageUrl ||
                              "https://clever.webpixels.io/img/people/img-profile.jpg"
                            }
                            alt="Store"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                            onClick={() =>
                              handlePreview(storeDetails?.imageUrl)
                            }
                          />
                          <div>
                            <p className="text-lg font-semibold text-gray-800">
                              {storeDetails.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Store Profile
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 flex items-center">
                          <EnvironmentOutlined className="text-blue-500 mr-2" />
                          <span>{fullAddress}</span>
                        </p>
                        <p className="text-gray-700 flex items-center">
                          <PhoneOutlined className="text-blue-500 mr-2" />
                          <span>{storeDetails.contactNumber}</span>
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <strong className="text-gray-900 font-medium">
                            Summary
                          </strong>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {storeDetails.summary}
                          </p>
                        </div>
                        <div>
                          <strong className="text-gray-900 font-medium">
                            Description
                          </strong>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {storeDetails.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  {/* Attachments Card */}
                  <Card className="border border-gray-200 rounded-lg shadow-sm p-6">
                    <strong className="text-gray-900 font-medium mb-4 block">
                      Attachments
                    </strong>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {storeDetails.storeAttachments?.length > 0 ? (
                        storeDetails.storeAttachments.map((attachment) => (
                          <div key={attachment.id} className="relative group">
                            <img
                              src={attachment.imageUrl}
                              alt="Attachment"
                              className="w-full h-32 object-cover rounded-md shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                              onClick={() => handlePreview(attachment.imageUrl)}
                            />
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => handlePreview(attachment.imageUrl)}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-full">
                          No attachments available.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No store details available.
                </p>
              )}
            </section>
          )}

          {/* Business License */}
          {(userRole === Roles.STORE || userRole === Roles.TRAINER) && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Business License
              </h2>
              {tabLoading[3] ? (
                <Spin tip="Loading Business License..." />
              ) : (userRole === Roles.STORE && businessLicenseStore) ||
                (userRole === Roles.TRAINER && businessLicenseTrainer) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <strong className="text-gray-900">TAX Number:</strong>{" "}
                      {(userRole === Roles.STORE
                        ? businessLicenseStore?.liscenseNumber
                        : businessLicenseTrainer?.liscenseNumber) || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Issued By:</strong>{" "}
                      {(userRole === Roles.STORE
                        ? businessLicenseStore?.issueBy
                        : businessLicenseTrainer?.issueBy) || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Issue Date:</strong>{" "}
                      {(userRole === Roles.STORE
                        ? businessLicenseStore?.issueDate
                        : businessLicenseTrainer?.issueDate
                      )?.split("T")[0] || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Expired Date:</strong>{" "}
                      {(userRole === Roles.STORE
                        ? businessLicenseStore?.expiredDate
                        : businessLicenseTrainer?.expiredDate
                      )?.split("T")[0] || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <strong className="text-gray-900">
                        Identification Card:
                      </strong>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {((userRole === Roles.STORE &&
                          businessLicenseStore?.frontIdentification) ||
                          (userRole === Roles.TRAINER &&
                            businessLicenseTrainer?.frontIdentification)) && (
                          <div className="relative group">
                            <img
                              src={
                                userRole === Roles.STORE
                                  ? businessLicenseStore.frontIdentification
                                  : businessLicenseTrainer?.frontIdentification
                              }
                              alt="Front ID"
                              className="w-full h-32 object-cover rounded-md shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.frontIdentification
                                    : businessLicenseTrainer?.frontIdentification
                                )
                              }
                            />
                            <span className="block text-center text-gray-600 mt-1">
                              Front ID
                            </span>
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.frontIdentification
                                    : businessLicenseTrainer?.frontIdentification
                                )
                              }
                            />
                          </div>
                        )}
                        {((userRole === Roles.STORE &&
                          businessLicenseStore?.backIdentification) ||
                          (userRole === Roles.TRAINER &&
                            businessLicenseTrainer?.backIdentification)) && (
                          <div className="relative group">
                            <img
                              src={
                                userRole === Roles.STORE
                                  ? businessLicenseStore.backIdentification
                                  : businessLicenseTrainer?.backIdentification
                              }
                              alt="Back ID"
                              className="w-full h-32 object-cover rounded-md shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.backIdentification
                                    : businessLicenseTrainer?.backIdentification
                                )
                              }
                            />
                            <span className="block text-center text-gray-600 mt-1">
                              Back ID
                            </span>
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.backIdentification
                                    : businessLicenseTrainer?.backIdentification
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">
                        Business License:
                      </strong>
                      <div className="mt-2">
                        {((userRole === Roles.STORE &&
                          businessLicenseStore?.businessLicences) ||
                          (userRole === Roles.TRAINER &&
                            businessLicenseTrainer?.businessLicences)) && (
                          <div className="relative group">
                            <img
                              src={
                                userRole === Roles.STORE
                                  ? businessLicenseStore.businessLicences
                                  : businessLicenseTrainer?.businessLicences
                              }
                              alt="Business License"
                              className="w-50 h-50 object-cover rounded-md shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.businessLicences
                                    : businessLicenseTrainer?.businessLicences
                                )
                              }
                            />
                            <Button
                              type="link"
                              // icon={<EyeOutlined />}
                              className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                handlePreview(
                                  userRole === Roles.STORE
                                    ? businessLicenseStore.businessLicences
                                    : businessLicenseTrainer?.businessLicences
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No business license details available.
                </p>
              )}
            </section>
          )}
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: "2",
            label: "Activity Log",
            children: (
              <div className="p-6 bg-white rounded-lg shadow-sm">
                {/* <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search by title or content"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onPressEnter={() => handleSearch(searchKeyword)}
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  type="primary"
                >
                  Refresh
                </Button>
              </div> */}
                {activityError && (
                  <Alert
                    message="Error"
                    description={activityError}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}
                {tabLoading[4] ? (
                  <Spin tip="Loading Activity Log..." />
                ) : (
                  <Table
                    columns={activityColumns}
                    dataSource={activityLog}
                    rowKey="id"
                    pagination={{
                      current: pagination.current,
                      pageSize: pagination.pageSize,
                      total: pagination.total,
                      onChange: (page, pageSize) => {
                        setPagination((prev) => ({
                          ...prev,
                          current: page,
                          pageSize,
                        }));
                        handleTabChange("2");
                      },
                    }}
                  />
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-6xl mx-auto bg-mainColer shadow-lg rounded-lg overflow-hidden font-Mainfont">
      {contextHolder}

      {/* Header Section */}
      <div className="bg-headerBg text-white p-6 flex items-center">
        {/* <Avatar
          size={120}
          src={
            detailUser.imageUrl ||
            storeDetails?.imageUrl ||
            "https://clever.webpixels.io/img/people/img-profile.jpg"
          }
          className="border-4 border-white"
        /> */}
        <div className="ml-6">
          <h1 className="text-3xl font-bold">{detailUser.fullname}</h1>
          <p className="text-lg">{detailUser.username}</p>
          <p className="text-sm">{detailUser.roles?.[0]?.label || "N/A"}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabs}
        className="p-4"
      />

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UserDetail;
