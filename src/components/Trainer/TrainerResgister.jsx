import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  notification,
  Modal,
  Upload,
  Input,
  Tooltip,
  Tag,
  Spin,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { uploadFiles, getUserRequestDetails } from "./../../api/apiConfig";
import {
  submitTrainerDocuments,
  submitForApproval,
  getTrainerBusinessLicenseDetails,
  fetchUserStatus,
} from "./../../redux/slices/trainerSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const TrainerRegister = () => {
  const [documents, setDocuments] = useState({
    frontIdentification: null,
    backIdentification: null,
    businessLicences: null,
  });
  const [loading, setLoading] = useState({
    frontIdentification: false,
    backIdentification: false,
    businessLicences: false,
  });
  const { remark } = useSelector((state) => state.trainerRegister);

  const [currentStep, setCurrentStep] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [formStep1] = Form.useForm();
  const [businessLicense, setBusinessLicense] = useState(null);
  const dispatch = useDispatch();
  const requestStatus = useSelector(
    (state) => state.trainerRegister.requestStatus
  );
  const trainerId = localStorage.getItem("userId");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const navigate = useNavigate();

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const fetchBusinessLicense = useCallback(() => {
    if (trainerId) {
      dispatch(getTrainerBusinessLicenseDetails(trainerId))
        .then((response) => {
          if (response.payload && response.payload.data) {
            setBusinessLicense(response.payload.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching Trainer Business License:", error);
        });
    }
  }, [trainerId, dispatch]);

  useEffect(() => {
    fetchBusinessLicense();
  }, [fetchBusinessLicense]);

  useEffect(() => {
    if (businessLicense) {
      formStep1.setFieldsValue({
        issueBy: businessLicense?.issueBy,
        issueDate: businessLicense?.issueDate?.split("T")[0],
        expiredDate: businessLicense?.expiredDate?.split("T")[0],
      });

      setDocuments({
        frontIdentification: businessLicense.frontIdentification || null,
        backIdentification: businessLicense.backIdentification || null,
        businessLicences: businessLicense.businessLicences || null,
      });
    }
  }, [businessLicense, formStep1]);

  const handleUpload = async (file, field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    try {
      const imageUrl = await uploadFiles(file);
      setDocuments((prev) => ({ ...prev, [field]: imageUrl }));
      notification.success({
        message: "Upload Successful",
        description: `${field} uploaded successfully!`,
      });
      return imageUrl;
    } catch (error) {
      notification.error({
        message: "Upload Failed",
        description: error.message,
      });
      setDocuments((prev) => ({ ...prev, [field]: null }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle file change and immediate upload
  const handleFileChange = (info, field) => {
    const file = info.file;
    if (file) {
      handleUpload(file, field);
    }
  };

  useEffect(() => {
    if (currentStep === 2 && requestId) {
      setIsModalVisible(true);
    }
  }, [currentStep, requestId]);

  const handleDocumentSubmit = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        notification.error({ message: "User ID not found!" });
        return;
      }

      const documentData = {
        trainerId: userId,
        frontIdentification: documents.frontIdentification,
        backIdentification: documents.backIdentification,
        businessLicences: documents.businessLicences,
        issueBy: values.issueBy,
        issueDate: values.issueDate,
        expiredDate: values.expiredDate,
      };

      const response = await dispatch(submitTrainerDocuments(documentData));

      if (submitTrainerDocuments.fulfilled.match(response)) {
        notification.success({ message: "Documents submitted successfully!" });
        const userRequestResponse = await getUserRequestDetails(userId);
        const fetchedRequestId = userRequestResponse?.data?.userRequestInfo?.id;

        if (!fetchedRequestId) {
          notification.error({
            message: "Request ID not found in API response!",
          });
          return;
        }

        setRequestId(fetchedRequestId);
        setCurrentStep(2);
        setIsModalVisible(true);
      }
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleApprovalSubmit = async () => {
    if (!requestId) {
      notification.error({ message: "Request ID not found!" });
      return;
    }

    try {
      await dispatch(submitForApproval(requestId));
      dispatch({
        type: "trainerRegister/setRequestStatus",
        payload: "Pending to Approved",
      });
      notification.success({
        message: "Trainer registration submitted for approval!",
      });
      setCurrentStep(1);
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.response?.data?.message || error.message,
      });
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
            type: "trainerRegister/setRequestStatus",
            payload: userRequestStatus,
          });
        }

        if (userRequestStatus === "Pending to Approved") setCurrentStep(1);
        if (userRequestStatus === "Rejected") setCurrentStep(0);
        if (userRequestStatus === "Approved")
          navigate("/trainer/payment-packages");
      } catch (error) {
        console.error("Error fetching user request status:", error);
      }
    };

    checkUserStatus();
  }, [dispatch, navigate]);

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
  };

  const validateExpiredDate = (_, value) => {
    const issueDate = formStep1.getFieldValue("issueDate");
    const today = dayjs().startOf("day");

    if (!value) return Promise.reject("Please select an expired date.");
    if (dayjs(value).isBefore(today))
      return Promise.reject("Expired Date must be in the future.");
    if (issueDate && dayjs(value).isBefore(dayjs(issueDate)))
      return Promise.reject("Expired Date must be after Issue Date.");
    return Promise.resolve();
  };

  const statusColors = {
    "Pending to Approved": {
      color: "gold",
      background: "#fffbe6",
      border: "#ffe58f",
    },
    Approved: { color: "green", background: "#f6ffed", border: "#b7eb8f" },
    "Pending to Verify OTP": {
      color: "gray",
      background: "#f5f5f5",
      border: "#d9d9d9",
    },
    Rejected: { color: "red", background: "#fff1f0", border: "#ffa39e" },
  };

  const getStatusTag = (requestStatus) => {
    const statusInfo = statusColors[requestStatus?.trim()] || {
      color: "black",
      background: "#f0f0f0",
      border: "#d9d9d9",
    };
    return (
      <Tag
        style={{
          color: statusInfo.color,
          backgroundColor: statusInfo.background,
          borderColor: statusInfo.border,
          fontWeight: "bold",
          fontSize: "14px",
          padding: "5px 10px",
          borderRadius: "5px",
        }}
      >
        {requestStatus}
      </Tag>
    );
  };

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserStatus(userId));
    }
  }, [userId, dispatch]);

  const showRemark = () => {
    Modal.info({
      title: "Remark Details",
      content: <p>{remark || "No additional remarks available."}</p>,
      okText: "Close",
    });
  };

  const renderUploadArea = (field, label) => (
    <Form.Item label={label}>
      <div className="flex flex-col items-center">
        {loading[field] ? (
          <div className="w-64 h-40 flex items-center justify-center">
            <Spin tip="Uploading..." />
          </div>
        ) : !documents[field] ? (
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={(info) => handleFileChange(info, field)}
          >
            <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
              <UploadOutlined className="text-blue-500 text-3xl" />
              <p className="text-gray-500 ml-2">Click or drag file</p>
            </div>
          </Upload>
        ) : (
          <div className="relative w-64 h-40">
            <img
              src={documents[field]}
              alt={label}
              className="w-full h-full object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
              onClick={() => handleImagePreview(documents[field])}
            >
              <EyeOutlined className="text-blue-500 text-xl" />
            </button>
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info, field)}
            >
              <button
                type="button"
                className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-sm hover:bg-blue-200 transition"
              >
                <UploadOutlined className="text-blue-500 text-xl" />
              </button>
            </Upload>
          </div>
        )}
      </div>
    </Form.Item>
  );

  return (
    <div>
      {currentStep === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
            📜 Upload Trainer Documents
          </h2>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>Status: </span>
            <span style={{ marginLeft: "10px" }}>
              {getStatusTag(requestStatus)}
            </span>
            {requestStatus === "Rejected" && (
              <Tooltip title="Click to view remark">
                <ExclamationCircleOutlined
                  style={{
                    color: "red",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={showRemark}
                />
              </Tooltip>
            )}
          </div>
          <Form
            form={formStep1}
            onFinish={handleDocumentSubmit}
            layout="vertical"
            className="mt-5"
          >
            {renderUploadArea("frontIdentification", "Front Identification")}
            {renderUploadArea("backIdentification", "Back Identification")}
            {renderUploadArea("businessLicences", "Business Licenses")}

            <Form.Item
              label="Issued By"
              name="issueBy"
              rules={[{ required: true, message: "Please input issuer!" }]}
            >
              <Input placeholder="Issuer of the license" />
            </Form.Item>

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Issue Date"
                name="issueDate"
                rules={[
                  { required: true, message: "Please select an issue date." },
                ]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                label="Expired Date"
                name="expiredDate"
                dependencies={["issueDate"]}
                rules={[
                  { required: true, message: "Please select an expired date." },
                  { validator: validateExpiredDate },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={Object.values(loading).some((val) => val)}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      )}

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <Modal
        title="Submit for Approval"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleApprovalSubmit}>
            Submit for Approval
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to submit your business license for approval?
        </p>
      </Modal>

      {currentStep === 1 && requestStatus === "Pending to Approved" && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            🎉 Submission Successful!
          </h2>
          <div className="flex justify-center">
            <div className="bg-green-100 p-6 rounded-lg shadow-md text-center max-w-lg">
              <div className="mb-4">
                <CheckCircleOutlined className="text-4xl text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Trainer Registration has been successfully submitted!
              </h3>
              <p className="text-gray-600 mb-4">
                Congratulations! Your application to become a trainer has been
                received.
              </p>
              <p className="text-gray-600 mb-4">
                Our team is now reviewing your submission. You’ll hear back
                soon.
              </p>
              <p className="text-sm text-gray-500 italic">
                Note: Approval typically takes 1-3 business days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerRegister;
