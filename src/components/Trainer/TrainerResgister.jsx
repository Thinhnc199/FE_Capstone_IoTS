import { useState, useEffect, useCallback } from "react";
import { Button, Form, notification, Modal, Upload, Input } from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { uploadFiles, getUserRequestDetails } from "../../api/apiConfig";
import {
  submitTrainerDocuments,
  submitForApproval,
  getTrainerBusinessLicenseDetails,
} from "../../redux/slices/trainerSlice";
import { useDispatch, useSelector } from "react-redux";

const TrainerRegister = () => {
  const [documents, setDocuments] = useState({
    frontIdentification: null,
    backIdentification: null,
    businessLicences: null,
  });
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

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const fetchBusinessLicense = useCallback(() => {
    if (trainerId) {
      dispatch(getTrainerBusinessLicenseDetails(trainerId))
        .then((response) => {
          if (response.payload && response.payload.data) {
            console.log(
              "Trainer Business License Data:",
              response.payload.data
            );
            setBusinessLicense(response.payload.data);
          } else {
            console.error("No Business License data found for Trainer.");
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

  const handleUpload = async (file) => {
    try {
      const imageUrl = await uploadFiles(file);
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
        notification.error({ message: "Documents upload failed, try again!" });
        return;
      }

      const documentData = {
        trainerId: userId,
        frontIdentification: frontIdUrl,
        backIdentification: backIdUrl,
        businessLicences: businessLicenseUrl,
        issueBy: values.issueBy,
        issueDate: values.issueDate,
        expiredDate: values.expiredDate,
      };

      const response = await dispatch(submitTrainerDocuments(documentData));

      if (submitTrainerDocuments.fulfilled.match(response)) {
        notification.success({ message: "Documents uploaded successfully!" });

        try {
          const userRequestResponse = await getUserRequestDetails(userId);
          console.log("API Response:", userRequestResponse);

          const fetchedRequestId =
            userRequestResponse?.data?.userRequestInfo?.id;
          console.log("Fetched Request ID:", fetchedRequestId);

          if (!fetchedRequestId) {
            notification.error({
              message: "Request ID not found in API response!",
            });
            return;
          }

          setRequestId(fetchedRequestId);
          setCurrentStep(2);
          setIsModalVisible(true);
        } catch (error) {
          console.error("Error fetching request ID:", error);
          notification.error({
            message: "Failed to fetch Request ID",
            description: error.response?.data?.message || error.message,
          });
        }
      } else {
        notification.error({
          message: "Submit Failed",
          description: response.error.message || "An error occurred",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
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
      console.log("Submitting approval request for:", requestId);

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
      console.error("API Error:", error);
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
        } else {
          console.warn("User request status is undefined in API response.");
        }

        if (userRequestStatus === "Pending to Approved") {
          setCurrentStep(1);
        }
        if (userRequestStatus === "Rejected") {
          setCurrentStep(0);
        }
      } catch (error) {
        console.error("Error fetching user request status:", error);
      }
    };

    checkUserStatus();
  }, [dispatch]);

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
  };
  return (
    <div>
      {currentStep === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
            📜 Upload Trainer Documents
          </h2>
          <Form
            form={formStep1}
            onFinish={handleDocumentSubmit}
            layout="vertical"
            className="mt-5"
          >
            {/* Front Identification */}
            <Form.Item label="Front Identification">
              <div className="flex flex-col items-center">
                {!documents.frontIdentification ? (
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false} // Ngăn tự động submit form
                    onChange={(info) => {
                      const file = info.file;
                      if (file) {
                        setDocuments((prev) => ({
                          ...prev,
                          frontIdentification: file,
                        }));
                      }
                    }}
                  >
                    <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
                      <UploadOutlined className="text-blue-500 text-3xl" />
                      <p className="text-gray-500 ml-2">Click or drag file</p>
                    </div>
                  </Upload>
                ) : (
                  <div className="relative w-64 h-40">
                    <img
                      src={
                        documents.frontIdentification instanceof File
                          ? URL.createObjectURL(documents.frontIdentification)
                          : documents.frontIdentification
                      }
                      alt="Front ID"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />

                    {/* Nút xem ảnh */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      onClick={() =>
                        handleImagePreview(
                          documents.frontIdentification instanceof File
                            ? URL.createObjectURL(documents.frontIdentification)
                            : documents.frontIdentification
                        )
                      }
                    >
                      <EyeOutlined className="text-blue-500 text-xl" />
                    </button>

                    {/* Nút update ảnh */}
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false} // Ngăn tự động submit
                      onChange={(info) => {
                        const file = info.file;
                        if (file) {
                          setDocuments((prev) => ({
                            ...prev,
                            frontIdentification: file,
                          }));
                        }
                      }}
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

            {/* Back Identification */}
            <Form.Item label="Back Identification">
              <div className="flex flex-col items-center">
                {!documents.backIdentification ? (
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false} // Ngăn tự động submit
                    onChange={(info) => {
                      const file = info.file;
                      if (file) {
                        setDocuments((prev) => ({
                          ...prev,
                          backIdentification: file,
                        }));
                      }
                    }}
                  >
                    <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
                      <UploadOutlined className="text-blue-500 text-3xl" />
                      <p className="text-gray-500 ml-2">Click or drag file</p>
                    </div>
                  </Upload>
                ) : (
                  <div className="relative w-64 h-40">
                    <img
                      src={
                        documents.backIdentification instanceof File
                          ? URL.createObjectURL(documents.backIdentification)
                          : documents.backIdentification
                      }
                      alt="Back ID"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />

                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      onClick={() =>
                        handleImagePreview(
                          documents.backIdentification instanceof File
                            ? URL.createObjectURL(documents.backIdentification)
                            : documents.backIdentification
                        )
                      }
                    >
                      <EyeOutlined className="text-blue-500 text-xl" />
                    </button>

                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false} // Ngăn tự động submit
                      onChange={(info) => {
                        const file = info.file;
                        if (file) {
                          setDocuments((prev) => ({
                            ...prev,
                            backIdentification: file,
                          }));
                        }
                      }}
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

            {/* Business Licenses */}
            <Form.Item label="Business Licenses">
              <div className="flex flex-col items-center">
                {!documents.businessLicences ? (
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false} // Ngăn tự động submit
                    onChange={(info) => {
                      const file = info.file;
                      if (file) {
                        setDocuments((prev) => ({
                          ...prev,
                          businessLicences: file,
                        }));
                      }
                    }}
                  >
                    <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
                      <UploadOutlined className="text-blue-500 text-3xl" />
                      <p className="text-gray-500 ml-2">Click or drag file</p>
                    </div>
                  </Upload>
                ) : (
                  <div className="relative w-64 h-40">
                    <img
                      src={
                        documents.businessLicences instanceof File
                          ? URL.createObjectURL(documents.businessLicences)
                          : documents.businessLicences
                      }
                      alt="Business License"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />

                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      onClick={() =>
                        handleImagePreview(
                          documents.businessLicences instanceof File
                            ? URL.createObjectURL(documents.businessLicences)
                            : documents.businessLicences
                        )
                      }
                    >
                      <EyeOutlined className="text-blue-500 text-xl" />
                    </button>

                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false} // Ngăn tự động submit
                      onChange={(info) => {
                        const file = info.file;
                        if (file) {
                          setDocuments((prev) => ({
                            ...prev,
                            businessLicences: file,
                          }));
                        }
                      }}
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

            {/* <Form.Item label="Front Identification">
            <div className="flex justify-center">
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
                <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
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
                    onClick={() =>
                      handleImagePreview(
                        URL.createObjectURL(documents.frontIdentification)
                      )
                    }
                  />
                )}
              </div>
            </div>
            </Form.Item> */}

            {/* <Form.Item label="Back Identification">
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
                    onClick={() =>
                      handleImagePreview(
                        URL.createObjectURL(documents.backIdentification)
                      )
                    }
                  />
                )}
              </div>
            </Form.Item> */}

            {/* <Form.Item label="Business Licenses">
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
                    onClick={() =>
                      handleImagePreview(
                        URL.createObjectURL(documents.businessLicences)
                      )
                    }
                  />
                )}
              </div>
            </Form.Item> */}

            <Form.Item
              label="Issued By"
              name="issueBy"
              rules={[{ required: true, message: "Please input issuer!" }]}
            >
              <Input placeholder="Issuer of the license" />
            </Form.Item>

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item label="Issue Date" name="issueDate">
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Expired Date" name="expiredDate">
                <Input type="date" />
              </Form.Item>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className=" bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
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

      {/* Approval Modal */}
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

      {/* Success Message */}
      {currentStep === 1 && requestStatus === "Pending to Approved" && (
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
                Trainer Registration has been successfully submitted!
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerRegister;
