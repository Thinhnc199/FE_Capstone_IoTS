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
  // DeleteOutlined,
  CloseCircleOutlined,
  // EditOutlined,
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

const { Step } = Steps;

const StoreRegistration = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.storeRegistration);
  const [currentStep, setCurrentStep] = useState(0);
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeAttachments, setStoreAttachments] = useState([]);
  const [documents, setDocuments] = useState({
    frontIdentification: null,
    backIdentification: null,
    businessLicences: null,
  });
  const [storeDetails, setStoreDetails] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  // const [isEditable, setIsEditable] = useState(false);
  const [storeId, setStoreId] = useState(null); // State to hold storeId

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [existingAttachments, setExistingAttachments] = useState([]); // Chứa hình ảnh cũ từ API
  const [form] = Form.useForm();
  const [formStep2] = Form.useForm();
  // Fetch store details when the component mounts
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
              // console.log(
              //   "Fetching business license for storeId:",
              //   storeResponse.payload.data.id
              // );
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
      // ✅ Cập nhật hình ảnh đã có sẵn
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

  // const handleStoreDetailsSubmit = async (values) => {
  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     notification.error({ message: "User  is not logged in!" });
  //     return;
  //   }
  //   let logoUrl = storeDetails?.imageUrl;

  //   if (storeLogo) {
  //     logoUrl =
  //       typeof storeLogo === "string"
  //         ? storeLogo
  //         : await handleUpload(storeLogo);
  //   }

  //   if (!logoUrl) {
  //     notification.error({ message: "Please upload store logo!" });
  //     return;
  //   }

  //   const attachmentsUrls = await Promise.all(
  //     storeAttachments.map(async (file) =>
  //       typeof file === "string" ? file : await handleUpload(file)
  //     )
  //   );

  //   if (attachmentsUrls.includes(null)) {
  //     notification.error({ message: "Some attachments failed to upload!" });
  //     return;
  //   }

  //   const storeData = {
  //     ...values,
  //     imageUrl: logoUrl,
  //     storeAttachments: attachmentsUrls.map((url) => ({ imageUrl: url })),
  //   };

  //   try {
  //     const storeInfo = await dispatch(submitStoreInfo({ userId, storeData }));
  //     if (storeInfo.payload && storeInfo.payload.id) {
  //       setCurrentStep(1); // Proceed to step 2
  //       // Fetch store details again to get storeId
  //       const userId = localStorage.getItem("userId");
  //       const storeResponse = await dispatch(getStoreDetails(userId));
  //       if (storeResponse.payload && storeResponse.payload.data) {
  //         setStoreId(storeResponse.payload.data.id); // Set storeId
  //       }
  //     }
  //     notification.success({
  //       message: "Store details submitted successfully!",
  //     });
  //   } catch (error) {
  //     notification.error({
  //       message: "Submit Failed",
  //       description: error.message,
  //     });
  //   }
  // };

  const handleDocumentSubmit = async (values) => {
    if (!storeId) {
      notification.error({ message: "Store ID is not available!" });
      return;
    }

    try {
      const frontIdUrl = documents.frontIdentification
        ? await handleUpload(documents.frontIdentification)
        : documents.frontIdentification;
      const backIdUrl = documents.backIdentification
        ? await handleUpload(documents.backIdentification)
        : documents.backIdentification;
      const businessLicenseUrl = documents.businessLicences
        ? await handleUpload(documents.businessLicences)
        : documents.businessLicencesll;

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

  const handleNextStep = () => {
    setDocuments((prev) => ({
      frontIdentification:
        prev.frontIdentification instanceof File
          ? prev.frontIdentification
          : businessLicense?.data?.frontIdentification,
      backIdentification:
        prev.backIdentification instanceof File
          ? prev.backIdentification
          : businessLicense?.data?.backIdentification,
      businessLicences:
        prev.businessLicences instanceof File
          ? prev.businessLicences
          : businessLicense?.data?.businessLicences,
    }));

    setCurrentStep(currentStep + 1);
  };

  const handleSubmitApproval = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      notification.error({
        message: "User  ID not found!",
      });
      return;
    }

    try {
      const userRequestResponse = await getUserRequestDetails(userId);
      const requestId = userRequestResponse.data.userRequestInfo.id;

      if (!requestId) {
        notification.error({
          message: "Request ID not found!",
        });
        return;
      }

      await dispatch(submitStoreApproval(requestId));
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

      {loading && <Spin size="large" />}

      {/* Step 1: Store Details */}
      {currentStep === 0 && (
        <Form
          form={form}
          onFinish={handleStoreDetailsSubmit}
          layout="vertical"
          className="mt-5 space-y-6"
        >
          <Form.Item
            label="Store Name"
            name="name"
            rules={[{ required: true, message: "Please input store name!" }]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            name="contactNumber"
            rules={[
              { required: true, message: "Please input contact number!" },
            ]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>

          <Form.Item
            label="Summary"
            name="summary"
            rules={[
              { required: true, message: "Please provide a summary!" },
              { max: 25, message: "Summary cannot exceed 25 characters!" },
            ]}
          >
            <Input maxLength={25} className="border-gray-300 rounded-md p-2" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please provide a description!" },
              {
                max: 100,
                message: "Description cannot exceed 100 characters!",
              },
            ]}
          >
            <Input.TextArea
              maxLength={100}
              className="border-gray-300 rounded-md p-2"
            />
          </Form.Item>

          {/* Upload Store Logo */}
          <Form.Item label="Store Logo">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                setStoreLogo(file);
                return false;
              }}
            >
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>
            <div className="mt-2">
              {storeLogo ? (
                <img
                  src={URL.createObjectURL(storeLogo)}
                  alt="Store Logo"
                  className="w-32 h-32 object-cover border border-gray-300 rounded-md"
                  onClick={() =>
                    handleImagePreview(URL.createObjectURL(storeLogo))
                  }
                />
              ) : storeDetails?.imageUrl ? (
                <img
                  src={storeDetails.imageUrl}
                  alt="Store Logo"
                  className="w-32 h-32 object-cover border border-gray-300 rounded-md"
                  onClick={() => handleImagePreview(storeDetails.imageUrl)}
                />
              ) : null}
            </div>
          </Form.Item>

          <Form.Item label="Store Attachments">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleAddAttachment(file);
                return false;
              }}
            >
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>

            <div className="mt-4 flex space-x-4 flex-wrap">
              {/* Hiển thị ảnh mới */}
              {storeAttachments.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Attachment"
                    className="w-20 h-20 object-cover border border-gray-300 rounded-md"
                    onClick={() =>
                      handleImagePreview(URL.createObjectURL(file))
                    }
                  />
                  <Button
                    type="danger"
                    icon={<CloseCircleOutlined style={{ color: "red" }} />}
                    onClick={() => handleRemoveAttachment(index, false)}
                    className="absolute top-0 right-0 bg-white rounded-full"
                  />
                </div>
              ))}

              {/* Hiển thị ảnh cũ từ API */}
              {existingAttachments.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt="Attachment"
                    className="w-20 h-20 object-cover border border-gray-300 rounded-md"
                    onClick={() => handleImagePreview(url)}
                  />
                  <Button
                    type="danger"
                    icon={<CloseCircleOutlined style={{ color: "red" }} />}
                    onClick={() => handleRemoveAttachment(index, true)}
                    className="absolute top-0 right-0 bg-white rounded-full"
                  />
                </div>
              ))}
            </div>

            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={() => setPreviewVisible(false)}
            >
              <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>

          {/* <Form.Item label="Store Attachments">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                setStoreAttachments((prev) => [...prev, file]);
                return false;
              }}
            >
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>
            <div className="mt-4 flex space-x-4 flex-wrap">
              {storeAttachments.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Attachment"
                    className="w-20 h-20 object-cover border border-gray-300 rounded-md"
                  />
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      setStoreAttachments(
                        storeAttachments.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-0 right-0 bg-white rounded-full"
                  />
                </div>
              ))}
              <Modal
  visible={previewVisible}
  footer={null}
  onCancel={() => setPreviewVisible(false)}
>
  <img
    alt="Preview"
    style={{ width: "100%" }}
    src={previewImage}
  />
</Modal>;
              {storeDetails?.storeAttachments?.map((attachment, index) => (
                <div key={index} className="relative">
                  <img
                    src={attachment.imageUrl}
                    alt="Attachment"
                    className="w-20 h-20 object-cover border border-gray-300 rounded-md"
                    onClick={() => handleImagePreview(attachment.imageUrl)}
                  />
                </div>
              ))}
            </div>
          </Form.Item> */}

          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 text-white rounded-md"
          >
            Next
          </Button>
        </Form>
      )}
      {/* Step 2: Upload Documents */}
      {currentStep === 1 && (
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
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>

            {documents.frontIdentification && (
              <img
                src={
                  documents.frontIdentification instanceof File
                    ? URL.createObjectURL(documents.frontIdentification)
                    : documents.frontIdentification
                }
                alt="Front ID"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
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
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>

            {documents.backIdentification && (
              <img
                src={
                  documents.backIdentification instanceof File
                    ? URL.createObjectURL(documents.backIdentification)
                    : documents.backIdentification
                }
                alt="Back ID"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
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
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>

            {documents.businessLicences && (
              <img
                src={
                  documents.businessLicences instanceof File
                    ? URL.createObjectURL(documents.businessLicences)
                    : documents.businessLicences
                }
                alt="Business License"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
          </Form.Item>

          {/* <Form.Item label="Front Identification">
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
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>
            {documents.frontIdentification && (
              <img
                src={URL.createObjectURL(documents.frontIdentification)}
                alt="Front ID"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
          </Form.Item>

          <Form.Item label="Back Identification">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                setDocuments((prev) => ({ ...prev, backIdentification: file }));
                return false;
              }}
            >
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>
            {documents.backIdentification && (
              <img
                src={URL.createObjectURL(documents.backIdentification)}
                alt="Back ID"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
          </Form.Item>

          <Form.Item label="Business Licenses">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                setDocuments((prev) => ({ ...prev, businessLicences: file }));
                return false;
              }}
            >
              <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <UploadOutlined className="text-blue-500 text-3xl" />
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              </div>
            </Upload>
            {documents.businessLicences && (
              <img
                src={URL.createObjectURL(documents.businessLicences)}
                alt="Business License"
                className="w-32 h-32 object-cover border border-gray-300 mt-2"
              />
            )}
          </Form.Item> */}

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

          <Button
            type="primary"
            className="w-full mt-4"
            onClick={() => handleNextStep(formStep2)}
          >
            Next
          </Button>

          {/* <Button type="primary" htmlType="submit" className="w-full mt-4">
            Next
          </Button> */}
        </Form>
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
                    className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
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
                {businessLicense?.data?.liscenseNumber}
              </p>
              <p className="mb-1">
                <strong>Issued By:</strong> {businessLicense?.data?.issueBy}
              </p>
              <p className="mb-1">
                <strong>Issue Date:</strong>{" "}
                {businessLicense?.data?.issueDate?.split("T")[0]}
              </p>
              <p className="mb-3">
                <strong>Expired Date:</strong>{" "}
                {businessLicense?.data?.expiredDate?.split("T")[0]}
              </p>

              {businessLicense?.data?.businessLicences && (
                <div className="flex justify-center">
                  <img
                    src={businessLicense.data.businessLicences}
                    alt="Business License"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
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
    </div>
  );
};

export default StoreRegistration;
