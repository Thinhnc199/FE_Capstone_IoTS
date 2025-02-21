import {
  Button,
  Form,
  Input,
  Upload,
  notification,
  Spin,
  Steps,
  Modal,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  submitStoreInfo,
  submitStoreDocuments,
  submitStoreApproval,
  getStoreDetails,
  getBusinessLicenseDetails,
} from "../../redux/slices/storeRegistrationSlice";
import { useState, useEffect } from "react";
import { uploadFiles, getUserRequestDetails } from "../../api/apiConfig";

import { useNavigate } from "react-router-dom";
const { Step } = Steps;

const StoreRegistration = () => {
  const dispatch = useDispatch();
  const { requestStatus, loading } = useSelector(
    (state) => state.storeRegistration
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeAttachments, setStoreAttachments] = useState([]);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    frontIdentification: null,
    backIdentification: null,
    businessLicences: null,
  });
  const [storeDetails, setStoreDetails] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  // const [isEditable, setIsEditable] = useState(false);
  const [storeId, setStoreId] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [form] = Form.useForm();
  const [formStep2] = Form.useForm();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          // console.log("Fetching store details for userId:", userId);

          const storeResponse = await dispatch(getStoreDetails(userId));

          if (storeResponse.payload && storeResponse.payload.data) {
            setStoreDetails(storeResponse.payload.data);
            setStoreId(storeResponse.payload.data.id); // Set storeId

            // console.log("Store details received:", storeResponse.payload.data);

            if (storeResponse.payload.data.id) {
              console.log(
                "Fetching business license for storeId:",
                storeResponse.payload.data.id
              );
              const businessLicenseResponse = await dispatch(
                getBusinessLicenseDetails(storeResponse.payload.data.id)
              );

              if (businessLicenseResponse.payload) {
                setBusinessLicense(businessLicenseResponse.payload);
                // console.log(
                //   "Business license data:",
                //   businessLicenseResponse.payload
                // );
              } else {
                notification.error({
                  message: "Error fetching business license details",
                });
              }
            }
          } else {
            notification.error({ message: "Error fetching store details" });
          }
        } catch (error) {
          console.error(
            "Error fetching store or business license details:",
            error
          );
          notification.error({
            message: "Error fetching store or business license details",
            description: error.message,
          });
        }
      } else {
        notification.error({ message: "User ID not found in localStorage" });
      }
    };

    fetchStoreDetails();
  }, [dispatch]);

  useEffect(() => {
    if (currentStep === 2) {
      const fetchStoreAndLicenseDetails = async () => {
        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            const storeResponse = await dispatch(getStoreDetails(userId));
            if (storeResponse.payload && storeResponse.payload.data) {
              setStoreDetails(storeResponse.payload.data);
            } else {
              notification.error({
                message: "Error fetching store details",
              });
            }

            const businessLicenseResponse = await dispatch(
              getBusinessLicenseDetails(storeDetails.id)
            );
            if (businessLicenseResponse.payload) {
              setBusinessLicense(businessLicenseResponse.payload);
            } else {
              notification.error({
                message: "Error fetching business license details",
              });
            }
          } catch (error) {
            console.error("Error fetching details:", error);
            notification.error({
              message: "Error fetching store and business license details",
              description: error.message,
            });
          }
        }
      };

      fetchStoreAndLicenseDetails();
    }
  }, [currentStep, dispatch, storeDetails?.id]);

  useEffect(() => {
    if (storeDetails) {
      form.setFieldsValue({
        name: storeDetails.name,
        contactNumber: storeDetails.contactNumber,
        address: storeDetails.address,
        summary: storeDetails.summary,
        description: storeDetails.description,
      });
    }
  }, [storeDetails, form]);

  useEffect(() => {
    if (businessLicense) {
      formStep2.setFieldsValue({
        liscenseNumber: businessLicense.data?.liscenseNumber,
        issueBy: businessLicense.data?.issueBy,
        issueDate: businessLicense.data?.issueDate?.split("T")[0],
        expiredDate: businessLicense.data?.expiredDate?.split("T")[0],
      });

      setDocuments({
        frontIdentification: businessLicense.data.frontIdentification || null,
        backIdentification: businessLicense.data.backIdentification || null,
        businessLicences: businessLicense.data.businessLicences || null,
      });
    }
  }, [businessLicense, formStep2]);

  const handleUpload = async (file) => {
    try {
      const imageUrl = await uploadFiles(file);
      // console.log("Uploaded Image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      notification.error({
        message: "Upload Failed",
        description: error.message,
      });
      return null;
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await getUserRequestDetails(userId);
        const userRequestStatus =
          response?.data?.userRequestInfo?.userRequestStatus?.label;

        if (userRequestStatus) {
          dispatch({
            type: "storeRegistration/setRequestStatus",
            payload: userRequestStatus,
          }); // ✅ Fixed
        } else {
          console.warn("User request status is undefined in API response.");
        }

        if (userRequestStatus === "Pending to Approved") {
          setCurrentStep(3);
        }
        if (userRequestStatus === "Approved") {
          navigate("/store/payment-packages");
        }
      } catch (error) {
        console.error("Error fetching user request status:", error);
      }
    };

    checkUserStatus();
  }, [dispatch, navigate]);

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  useEffect(() => {
    if (storeDetails?.storeAttachments) {
      setExistingAttachments(
        storeDetails.storeAttachments.map((att) => att.imageUrl)
      );
    }
  }, [storeDetails]);

  // Xử lý thêm ảnh
  const handleAddAttachment = (file) => {
    setStoreAttachments((prev) => [...prev, file]);
  };

  const handleRemoveAttachment = (index, isExisting = false) => {
    if (isExisting) {
      setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
    } else {
      setStoreAttachments(storeAttachments.filter((_, i) => i !== index));
    }
  };

  // Xử lý gửi dữ liệu
  const handleStoreDetailsSubmit = async (values) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      notification.error({ message: "User is not logged in!" });
      return;
    }

    let logoUrl = storeDetails?.imageUrl;
    if (storeLogo) {
      logoUrl =
        typeof storeLogo === "string"
          ? storeLogo
          : await handleUpload(storeLogo);
    }

    if (!logoUrl) {
      notification.error({ message: "Please upload store logo!" });
      return;
    }

    // Upload chỉ những ảnh mới
    const newAttachmentsUrls = await Promise.all(
      storeAttachments.map(async (file) =>
        typeof file === "string" ? file : await handleUpload(file)
      )
    );

    if (newAttachmentsUrls.includes(null)) {
      notification.error({ message: "Some attachments failed to upload!" });
      return;
    }

    // Kết hợp hình ảnh cũ và mới
    const allAttachments = [...existingAttachments, ...newAttachmentsUrls];
    const storeData = {
      ...values,
      imageUrl: logoUrl,
      storeAttachments: allAttachments.map((url) => ({ imageUrl: url })),
    };
    try {
      const storeInfo = await dispatch(submitStoreInfo({ userId, storeData }));
      if (storeInfo.payload && storeInfo.payload.id) {
        setCurrentStep(1);
        // Fetch store details again to get storeId
        const userId = localStorage.getItem("userId");
        const storeResponse = await dispatch(getStoreDetails(userId));
        if (storeResponse.payload && storeResponse.payload.data) {
          setStoreId(storeResponse.payload.data.id); // Set storeId
        }
      }
      notification.success({
        message: "Store details submitted successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.message,
      });
    }
  };

  const handleDocumentSubmit = async (values) => {
    if (!storeId) {
      notification.error({ message: "Store ID is not available!" });
      return;
    }

    try {
      // Check if the user has uploaded new documents, otherwise use the existing URLs
      const frontIdUrl = documents.frontIdentification
        ? documents.frontIdentification instanceof File
          ? await handleUpload(documents.frontIdentification)
          : documents.frontIdentification
        : null;

      const backIdUrl = documents.backIdentification
        ? documents.backIdentification instanceof File
          ? await handleUpload(documents.backIdentification)
          : documents.backIdentification
        : null;

      const businessLicenseUrl = documents.businessLicences
        ? documents.businessLicences instanceof File
          ? await handleUpload(documents.businessLicences)
          : documents.businessLicences
        : null;

      if (!frontIdUrl || !backIdUrl || !businessLicenseUrl) {
        notification.error({ message: "Documents uploaded Fail, try again!" });
        return;
      }

      const documentData = {
        storeId: storeId,
        frontIdentification: frontIdUrl,
        backIdentification: backIdUrl,
        businessLicences: businessLicenseUrl,
        liscenseNumber: values.liscenseNumber,
        issueBy: values.issueBy,
        issueDate: values.issueDate,
        expiredDate: values.expiredDate,
      };

      // console.log("Dữ liệu JSON gửi lên:", documentData);

      const response = await dispatch(submitStoreDocuments(documentData));

      if (submitStoreDocuments.fulfilled.match(response)) {
        notification.success({ message: "Documents uploaded successfully!" });
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Submit Failed",
          description: response.error.message || "An error occurred",
        });
      }
    } catch (error) {
      console.error("API Error:", error.response);
      notification.error({
        message: "Submit Failed",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleSubmitApproval = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      notification.error({
        message: "User ID not found!",
      });
      return;
    }

    try {
      const storeResponse = await dispatch(getStoreDetails(userId));
      if (storeResponse.payload && storeResponse.payload.data) {
        setStoreDetails(storeResponse.payload.data);
        setStoreId(storeResponse.payload.data.id);
      }

      const businessLicenseResponse = await dispatch(
        getBusinessLicenseDetails(storeId)
      );
      if (businessLicenseResponse.payload) {
        setBusinessLicense(businessLicenseResponse.payload);
      } else {
        notification.error({
          message: "Error fetching business license details",
        });
        return;
      }

      // Now proceed to submit the store for approval using the latest data
      const userRequestResponse = await getUserRequestDetails(userId);
      const requestId = userRequestResponse.data.userRequestInfo.id;

      if (!requestId) {
        notification.error({
          message: "Request ID not found!",
        });
        return;
      }
      console.log(
        "Submitting store request approval for requestId:",
        requestId
      );
      await dispatch(submitStoreApproval(requestId));
      dispatch({
        type: "storeRegistration/setRequestStatus",
        payload: "Pending to Approved",
      }); 

      notification.success({
        message: "Store registration submitted for approval!",
      });
      setCurrentStep(3);
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-blue-600">Store Registration</h1>
      <Steps current={currentStep} className="my-4">
        <Step title="Store Details" />
        <Step title="Upload Documents" />
        <Step title="Submit for Approval" />
      </Steps>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Spin size="large" />
            <p className="mt-2 text-gray-600">Loading Data ...</p>
          </div>
        </div>
      )}

      {/* <div className="bg-white shadow-lg rounded-lg p-6"> */}
      {/* Step 1: Store Details */}
      {currentStep === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
            🏪 Store Details
          </h2>

          <Form
            form={form}
            onFinish={handleStoreDetailsSubmit}
            layout="vertical"
            className="mt-5 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Store Name */}
              <Form.Item
                label="Store Name"
                name="name"
                rules={[
                  { required: true, message: "Please input store name!" },
                ]}
              >
                <Input
                  placeholder="Enter store name"
                  className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </Form.Item>

              {/* Contact Number */}
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[
                  { required: true, message: "Please input contact number!" },
                ]}
              >
                <Input
                  placeholder="Enter contact number"
                  className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </Form.Item>

              {/* Address */}
              <Form.Item
                label="Address"
                name="address"
                className="col-span-2"
                rules={[{ required: true, message: "Please input address!" }]}
              >
                <Input
                  placeholder="Enter store address"
                  className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </Form.Item>

              {/* Summary */}
              <Form.Item
                label="Summary"
                name="summary"
                className="col-span-2"
                rules={[
                  { required: true, message: "Please provide a summary!" },
                  {
                    max: 255,
                    message: "Summary cannot exceed 255 characters!",
                  },
                ]}
              >
                <Input
                  maxLength={255}
                  placeholder="Brief summary about the store"
                  className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </Form.Item>
            </div>
            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please provide a description!" },
                {
                  max: 550,
                  message: "Description cannot exceed 550 characters!",
                },
              ]}
            >
              <Input.TextArea
                maxLength={550}
                placeholder="Describe your store in detail"
                className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                rows={4}
              />
            </Form.Item>

            {/* Upload Store Logo */}
            {/* Upload Store Logo */}
            <Form.Item label="Store Logo">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setStoreLogo(file);
                  return false;
                }}
              >
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <UploadOutlined className="text-blue-500 text-4xl mb-2" />
                  <p className="text-gray-500 text-sm">
                    Click or drag file to upload
                  </p>
                </div>
              </Upload>

              <div className="mt-4 flex justify-center">
                {storeLogo ? (
                  <img
                    src={URL.createObjectURL(storeLogo)}
                    alt="Store Logo"
                    className="w-40 h-40 object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
                    onClick={() =>
                      handleImagePreview(URL.createObjectURL(storeLogo))
                    }
                  />
                ) : storeDetails?.imageUrl ? (
                  <img
                    src={storeDetails.imageUrl}
                    alt="Store Logo"
                    className="w-40 h-40 object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleImagePreview(storeDetails.imageUrl)}
                  />
                ) : null}
              </div>
            </Form.Item>

            {/* Upload Store Attachments */}
            <Form.Item label="Store Attachments">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAddAttachment(file);
                  return false;
                }}
              >
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <UploadOutlined className="text-blue-500 text-4xl mb-2" />
                  <p className="text-gray-500 text-sm">
                    Click or drag files to upload
                  </p>
                </div>
              </Upload>

              {/* Hiển thị danh sách ảnh đã tải lên */}
              <div className="mt-4 flex flex-wrap gap-4">
                {/* Ảnh mới được upload */}
                {storeAttachments.map((file, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Attachment"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
                      onClick={() =>
                        handleImagePreview(URL.createObjectURL(file))
                      }
                    />
                    <Button
                      type="danger"
                      icon={<CloseCircleOutlined style={{ color: "white" }} />}
                      onClick={() => handleRemoveAttachment(index, false)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
                    />
                  </div>
                ))}

                {/* Ảnh cũ từ API */}
                {existingAttachments.map((url, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={url}
                      alt="Attachment"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
                      onClick={() => handleImagePreview(url)}
                    />
                    <Button
                      type="danger"
                      icon={<CloseCircleOutlined style={{ color: "white" }} />}
                      onClick={() => handleRemoveAttachment(index, true)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
                    />
                  </div>
                ))}
              </div>

              {/* Modal xem ảnh lớn hơn */}
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                centered
              >
                <img
                  alt="Preview"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Next
              </Button>
            </div>
            {/* <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Next
            </Button> */}
          </Form>
        </div>
      )}

      {/* Step 2: Upload Documents */}
      {currentStep === 1 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
            📜 Upload Business Documents
          </h2>
          <Form
            form={formStep2}
            onFinish={handleDocumentSubmit}
            layout="vertical"
            className="mt-5"
          >
            <Form.Item label="Front Identification">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setDocuments((prev) => ({
                    ...prev,
                    frontIdentification: file,
                  }));
                  return false;
                }}
              >
                <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition ">
                  <UploadOutlined className="text-blue-500 text-3xl" />
                  <p className="text-gray-500">Click or drag files to upload</p>
                </div>
              </Upload>
              <div className="mt-4 flex justify-center">
                {documents.frontIdentification && (
                  <img
                    src={
                      documents.frontIdentification instanceof File
                        ? URL.createObjectURL(documents.frontIdentification)
                        : documents.frontIdentification
                    }
                    alt="Front ID"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-600 mt-2"
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item label="Back Identification">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setDocuments((prev) => ({
                    ...prev,
                    backIdentification: file,
                  }));
                  return false;
                }}
              >
                <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <UploadOutlined className="text-blue-500 text-3xl" />
                  <p className="text-gray-500">Click or drag files to upload</p>
                </div>
              </Upload>
              <div className="mt-4 flex justify-center">
                {documents.backIdentification && (
                  <img
                    src={
                      documents.backIdentification instanceof File
                        ? URL.createObjectURL(documents.backIdentification)
                        : documents.backIdentification
                    }
                    alt="Back ID"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-600 mt-2"
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item label="Business Licenses">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setDocuments((prev) => ({
                    ...prev,
                    businessLicences: file,
                  }));
                  return false;
                }}
              >
                <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <UploadOutlined className="text-blue-500 text-3xl" />
                  <p className="text-gray-500">Click or drag files to upload</p>
                </div>
              </Upload>
              <div className="mt-4 flex justify-center">
                {documents.businessLicences && (
                  <img
                    src={
                      documents.businessLicences instanceof File
                        ? URL.createObjectURL(documents.businessLicences)
                        : documents.businessLicences
                    }
                    alt="Business License"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-600 mt-2"
                  />
                )}
              </div>
            </Form.Item>

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="License Number"
                name="liscenseNumber"
                rules={[
                  { required: true, message: "Please input license number!" },
                ]}
              >
                <Input placeholder="Enter license number" />
              </Form.Item>

              <Form.Item
                label="Issued By"
                name="issueBy"
                rules={[{ required: true, message: "Please input issuer!" }]}
              >
                <Input placeholder="Issuer of the license" />
              </Form.Item>

              <Form.Item label="Issue Date" name="issueDate">
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Expired Date" name="expiredDate">
                <Input type="date" />
              </Form.Item>
            </div>

            <div className="flex justify-between">
              <Button
                type="default"
                onClick={() => setCurrentStep(0)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Next
              </Button>
            </div>
            {/* <Button type="primary" htmlType="submit" className="w-full mt-4">
              Next
            </Button> */}
          </Form>
        </div>
      )}

      {/* Step 3: Submit */}
      {currentStep === 2 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            Review Your Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Store Details */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-3">
                🏪 Store Details
              </h3>
              <p className="mb-1">
                <strong>Name:</strong> {storeDetails?.name}
              </p>
              <p className="mb-1">
                <strong>Contact:</strong> {storeDetails?.contactNumber}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {storeDetails?.address}
              </p>
              <p className="mb-1">
                <strong>Summary:</strong> {storeDetails?.summary}
              </p>
              <p className="mb-3">
                <strong>Description:</strong> {storeDetails?.description}
              </p>

              {storeDetails?.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={storeDetails.imageUrl}
                    alt="Store Logo"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Business License */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-3">
                📜 Business License
              </h3>
              <p className="mb-1">
                <strong>License Number:</strong>{" "}
                {businessLicense.data?.liscenseNumber}
              </p>
              <p className="mb-1">
                <strong>Issued By:</strong> {businessLicense.data?.issueBy}
              </p>
              <p className="mb-1">
                <strong>Issue Date:</strong>{" "}
                {businessLicense.data?.issueDate?.split("T")[0]}
              </p>
              <p className="mb-3">
                <strong>Expired Date:</strong>{" "}
                {businessLicense.data?.expiredDate?.split("T")[0]}
              </p>

              {businessLicense.data?.businessLicences && (
                <div className="flex justify-center">
                  <img
                    src={businessLicense.data.businessLicences}
                    alt="Business License"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="primary"
              onClick={handleSubmitApproval}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              ✅ Submit Registration
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && requestStatus === "Pending to Approved" && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            🎉 Submission Successful!
          </h2>
          <div className="flex justify-center">
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
              <div className="mb-4">
                <CheckCircleOutlined className="text-4xl text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Your Registration has been successfully submitted!
              </h3>
              <p className="text-gray-600 mb-4">
                Please wait for the admin team to review and approve your
                application within the next 24 hours.
              </p>
              <p className="text-gray-700">
                For any further queries or assistance, please contact our team
                via our{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  Contact Form
                </a>
              </p>
              <div className="mt-6">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  className="bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                  disabled
                >
                  Submitted Successfully
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreRegistration;
