// import {
//   Button,
//   Form,
//   Input,
//   Upload,
//   notification,
//   Spin,
//   Steps,
//   Tooltip,
//   Tag,
//   Modal,
// } from "antd";
// import {
//   UploadOutlined,
//   // CheckCircleOutlined,
//   CloseCircleOutlined,
//   EyeOutlined,
//   ExclamationCircleOutlined,
//   ShopOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   submitStoreInfo,
//   submitStoreDocuments,
//   submitStoreApproval,
//   getStoreDetails,
//   getBusinessLicenseDetails,
//   fetchUserStatus,
// } from "./../../redux/slices/storeRegistrationSlice";
// import { useState, useEffect } from "react";
// import { uploadFiles, getUserRequestDetails } from "./../../api/apiConfig";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";
// import AddressSelector from "../StoreIoT/components/AddressSelector";
// const { Step } = Steps;

// const StoreRegistration = () => {
//   const dispatch = useDispatch();
//   const { loading, status, remark } = useSelector(
//     (state) => state.storeRegistration
//   );

//   const [currentStep, setCurrentStep] = useState(0);
//   const [storeLogo, setStoreLogo] = useState(null);
//   const [storeAttachments, setStoreAttachments] = useState([]);
//   const navigate = useNavigate();
//   const [documents, setDocuments] = useState({
//     frontIdentification: null,
//     backIdentification: null,
//     businessLicences: null,
//   });
//   const [storeDetails, setStoreDetails] = useState(null);
//   const [businessLicense, setBusinessLicense] = useState(null);
//   const [storeId, setStoreId] = useState(null);

//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewVisible, setPreviewVisible] = useState(false);

//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [form] = Form.useForm();
//   const [formStep2] = Form.useForm();
//   // State để lưu ID của tỉnh/thành phố, quận/huyện, phường/xã
//   const [selectedProvinceId, setSelectedProvinceId] = useState(null);
//   const [selectedDistrictId, setSelectedDistrictId] = useState(null);
//   const [selectedWardId, setSelectedWardId] = useState(null);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const statusColors = {
//     "Pending to Approved": {
//       color: "gold",
//       background: "#fffbe6",
//       border: "#ffe58f",
//     },
//     Approved: { color: "green", background: "#f6ffed", border: "#b7eb8f" },
//     "Pending to Verify OTP": {
//       color: "gray",
//       background: "#f5f5f5",
//       border: "#d9d9d9",
//     },
//     Rejected: { color: "red", background: "#fff1f0", border: "#ffa39e" },
//   };
//   const getStatusTag = (status) => {
//     const statusInfo = statusColors[status?.trim()] || {
//       color: "black",
//       background: "#f0f0f0",
//       border: "#d9d9d9",
//     };
//     return (
//       <Tag
//         style={{
//           color: statusInfo.color,
//           backgroundColor: statusInfo.background,
//           borderColor: statusInfo.border,
//           fontWeight: "bold",
//           fontSize: "14px",
//           padding: "5px 10px",
//           borderRadius: "5px",
//         }}
//       >
//         {status}
//       </Tag>
//     );
//   };

//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchUserStatus(userId));
//     }
//   }, [userId, dispatch]);

//   const showRemark = () => {
//     Modal.info({
//       title: "Remark Details",
//       content: <p>{remark || "No additional remarks available."}</p>,
//       okText: "Close",
//     });
//   };

//   useEffect(() => {
//     const fetchStoreDetails = async () => {
//       const userId = localStorage.getItem("userId");
//       if (userId) {
//         try {
//           const storeResponse = await dispatch(getStoreDetails(userId));

//           if (storeResponse.payload && storeResponse.payload.data) {
//             setStoreDetails(storeResponse.payload.data);
//             setStoreId(storeResponse.payload.data.id); // Set storeId
//             setSelectedProvinceId(
//               storeResponse.payload.data.provinceId || null
//             );
//             setSelectedDistrictId(
//               storeResponse.payload.data.districtId || null
//             );
//             setSelectedWardId(storeResponse.payload.data.wardId || null);
//             setSelectedAddressId(storeResponse.payload.data.addressId || null);

//             if (storeResponse.payload.data.id) {
//               console.log(
//                 "Fetching business license for storeId:",
//                 storeResponse.payload.data.id
//               );
//               const businessLicenseResponse = await dispatch(
//                 getBusinessLicenseDetails(storeResponse.payload.data.id)
//               );

//               if (businessLicenseResponse.payload) {
//                 setBusinessLicense(businessLicenseResponse.payload);
//               } else {
//                 notification.error({
//                   message: "Error fetching business license details",
//                 });
//               }
//             }
//           } else {
//             notification.error({ message: "Error fetching store details" });
//           }
//         } catch (error) {
//           console.error(
//             "Error fetching store or business license details:",
//             error
//           );
//           notification.error({
//             message: "Error fetching store or business license details",
//             description: error.message,
//           });
//         }
//       } else {
//         notification.error({ message: "User ID not found in localStorage" });
//       }
//     };

//     fetchStoreDetails();
//   }, [dispatch]);

//   // Xử lý khi chọn địa chỉ mới
//   const handleAddressChange = (newFullAddress, ids) => {
//     // form.setFieldsValue({ address: fullAddress });
//     // setFullAddress(newFullAddress);
//     setSelectedProvinceId(ids.provinceId);
//     setSelectedDistrictId(ids.districtId);
//     setSelectedWardId(ids.wardId);
//     setSelectedAddressId(ids.addressId);
//   };

//   useEffect(() => {
//     if (currentStep === 2) {
//       const fetchStoreAndLicenseDetails = async () => {
//         const userId = localStorage.getItem("userId");
//         if (userId) {
//           try {
//             const storeResponse = await dispatch(getStoreDetails(userId));
//             if (storeResponse.payload && storeResponse.payload.data) {
//               setStoreDetails(storeResponse.payload.data);
//             } else {
//               notification.error({
//                 message: "Error fetching store details",
//               });
//             }

//             const businessLicenseResponse = await dispatch(
//               getBusinessLicenseDetails(storeDetails.id)
//             );
//             if (businessLicenseResponse.payload) {
//               setBusinessLicense(businessLicenseResponse.payload);
//             } else {
//               notification.error({
//                 message: "Error fetching business license details",
//               });
//             }
//           } catch (error) {
//             console.error("Error fetching details:", error);
//             notification.error({
//               message: "Error fetching store and business license details",
//               description: error.message,
//             });
//           }
//         }
//       };

//       fetchStoreAndLicenseDetails();
//     }
//   }, [currentStep, dispatch, storeDetails?.id]);

//   useEffect(() => {
//     if (storeDetails) {
//       setSelectedProvinceId(storeDetails.provinceId);
//       setSelectedDistrictId(storeDetails.districtId);
//       setSelectedWardId(storeDetails.wardId);
//       setSelectedAddressId(storeDetails.addressId);

//       form.setFieldsValue({
//         name: storeDetails.name,
//         contactNumber: storeDetails.contactNumber,
//         address: storeDetails.address,
//         summary: storeDetails.summary,
//         description: storeDetails.description,
//       });
//     }
//   }, [storeDetails, form]);

//   useEffect(() => {
//     if (businessLicense) {
//       formStep2.setFieldsValue({
//         liscenseNumber: businessLicense.data?.liscenseNumber,
//         issueBy: businessLicense.data?.issueBy,
//         issueDate: businessLicense.data?.issueDate?.split("T")[0],
//         expiredDate: businessLicense.data?.expiredDate?.split("T")[0],
//       });

//       setDocuments({
//         frontIdentification: businessLicense.data.frontIdentification || null,
//         backIdentification: businessLicense.data.backIdentification || null,
//         businessLicences: businessLicense.data.businessLicences || null,
//       });
//     }
//   }, [businessLicense, formStep2]);

//   const handleUpload = async (file) => {
//     try {
//       const imageUrl = await uploadFiles(file);
//       return imageUrl;
//     } catch (error) {
//       notification.error({
//         message: "Upload Failed",
//         description: error.message,
//       });
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       try {
//         const response = await getUserRequestDetails(userId);
//         const userRequestStatus =
//           response?.data?.userRequestInfo?.userRequestStatus?.label;

//         if (userRequestStatus) {
//           dispatch({
//             type: "storeRegistration/setRequestStatus",
//             payload: userRequestStatus,
//           }); // ✅ Fixed
//         } else {
//           console.warn("User request status is undefined in API response.");
//         }

//         if (userRequestStatus === "Pending to Approved") {
//           // setCurrentStep(3);
//           navigate("/store/submission-success");
//         }
//         if (userRequestStatus === "Approved") {
//           navigate("/payment-packages");
//         }
//       } catch (error) {
//         console.error("Error fetching user request status:", error);
//       }
//     };

//     checkUserStatus();
//   }, [dispatch, navigate]);

//   const handleImagePreview = (imageUrl) => {
//     if (imageUrl) {
//       setPreviewImage(imageUrl);
//       setPreviewVisible(true);
//     }
//   };

//   useEffect(() => {
//     if (storeDetails?.storeAttachments) {
//       setExistingAttachments(
//         storeDetails.storeAttachments.map((att) => att.imageUrl)
//       );
//     }
//   }, [storeDetails]);

//   // Xử lý thêm ảnh
//   const handleAddAttachment = (file) => {
//     setStoreAttachments((prev) => [...prev, file]);
//   };

//   const handleRemoveAttachment = (index, isExisting = false) => {
//     if (isExisting) {
//       setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
//     } else {
//       setStoreAttachments(storeAttachments.filter((_, i) => i !== index));
//     }
//   };

//   // Xử lý gửi dữ liệu
//   const handleStoreDetailsSubmit = async (values) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       notification.error({ message: "User is not logged in!" });

//       return;
//     }

//     let logoUrl = storeDetails?.imageUrl;
//     if (storeLogo) {
//       logoUrl =
//         typeof storeLogo === "string"
//           ? storeLogo
//           : await handleUpload(storeLogo);
//     }

//     if (!logoUrl) {
//       notification.error({ message: "Please upload store logo!" });
//       return;
//     }

//     // Upload chỉ những ảnh mới
//     const newAttachmentsUrls = await Promise.all(
//       storeAttachments.map(async (file) =>
//         typeof file === "string" ? file : await handleUpload(file)
//       )
//     );

//     if (newAttachmentsUrls.includes(null)) {
//       notification.error({ message: "Some attachments failed to upload!" });
//       return;
//     }

//     // Kết hợp hình ảnh cũ và mới
//     const allAttachments = [...existingAttachments, ...newAttachmentsUrls];
//     const storeData = {
//       ...values,
//       provinceId: selectedProvinceId,
//       districtId: selectedDistrictId,
//       wardId: selectedWardId,
//       // prowardId: selectedAddressId,
//       addressId: selectedAddressId,

//       imageUrl: logoUrl,
//       storeAttachments: allAttachments.map((url) => ({ imageUrl: url })),
//     };
//     try {
//       const storeInfo = await dispatch(submitStoreInfo({ userId, storeData }));
//       if (storeInfo.payload && storeInfo.payload.id) {
//         setCurrentStep(1);
//         // Fetch store details again to get storeId
//         const userId = localStorage.getItem("userId");
//         const storeResponse = await dispatch(getStoreDetails(userId));
//         if (storeResponse.payload && storeResponse.payload.data) {
//           setStoreId(storeResponse.payload.data.id);
//         }
//       }
//       notification.success({
//         message: "Store details submitted successfully!",
//       });
//     } catch (error) {
//       notification.error({
//         message: "Submit Failed",
//         description: error.message,
//       });
//     }
//   };

//   const handleDocumentSubmit = async (values) => {
//     if (!storeId) {
//       notification.error({ message: "Store ID is not available!" });
//       return;
//     }

//     try {
//       // Check if the user has uploaded new documents, otherwise use the existing URLs
//       const frontIdUrl = documents.frontIdentification
//         ? documents.frontIdentification instanceof File
//           ? await handleUpload(documents.frontIdentification)
//           : documents.frontIdentification
//         : null;

//       const backIdUrl = documents.backIdentification
//         ? documents.backIdentification instanceof File
//           ? await handleUpload(documents.backIdentification)
//           : documents.backIdentification
//         : null;

//       const businessLicenseUrl = documents.businessLicences
//         ? documents.businessLicences instanceof File
//           ? await handleUpload(documents.businessLicences)
//           : documents.businessLicences
//         : null;

//       if (!frontIdUrl || !backIdUrl || !businessLicenseUrl) {
//         notification.error({ message: "Documents uploaded Fail, try again!" });
//         return;
//       }

//       const documentData = {
//         storeId: storeId,
//         frontIdentification: frontIdUrl,
//         backIdentification: backIdUrl,
//         businessLicences: businessLicenseUrl,
//         liscenseNumber: values.liscenseNumber,
//         issueBy: values.issueBy,
//         issueDate: values.issueDate,
//         expiredDate: values.expiredDate,
//       };

//       // console.log("Dữ liệu JSON gửi lên:", documentData);

//       const response = await dispatch(submitStoreDocuments(documentData));

//       if (submitStoreDocuments.fulfilled.match(response)) {
//         notification.success({ message: "Documents uploaded successfully!" });
//         setCurrentStep(2);
//       } else {
//         notification.error({
//           message: "Submit Failed",
//           description: response.error.message || "An error occurred",
//         });
//       }
//     } catch (error) {
//       console.error("API Error:", error.response);
//       notification.error({
//         message: "Submit Failed",
//         description: error.response?.data?.message || error.message,
//       });
//     }
//   };

//   const handleSubmitApproval = async () => {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       notification.error({
//         message: "User ID not found!",
//       });
//       return;
//     }

//     try {
//       // 🛠 Gọi API lấy thông tin store
//       const storeResponse = await dispatch(getStoreDetails(userId));
//       if (storeResponse.payload && storeResponse.payload.data) {
//         setStoreDetails(storeResponse.payload.data);
//         setStoreId(storeResponse.payload.data.id);
//       }

//       // 🛠 Gọi API lấy thông tin business license
//       const businessLicenseResponse = await dispatch(
//         getBusinessLicenseDetails(storeId)
//       );
//       if (businessLicenseResponse.payload) {
//         setBusinessLicense(businessLicenseResponse.payload);
//       } else {
//         notification.error({
//           message: "Error fetching business license details",
//         });
//         return;
//       }

//       // 🛠 Gọi API lấy request ID
//       const userRequestResponse = await getUserRequestDetails(userId);
//       const requestId = userRequestResponse.data.userRequestInfo?.id;

//       if (!requestId) {
//         notification.error({
//           message: "Request ID not found!",
//         });
//         return;
//       }

//       console.log(
//         "Submitting store request approval for requestId:",
//         requestId
//       );
//       await dispatch(submitStoreApproval(requestId));

//       dispatch({
//         type: "storeRegistration/setRequestStatus",
//         payload: "Pending to Approved",
//       });

//       notification.success({
//         message: "Store registration submitted for approval!",
//       });
//       // setCurrentStep(3);
//       // ✅ Chuyển hướng sang trang "/store/submission-success"
//       navigate("/store/submission-success");
//     } catch (error) {
//       notification.error({
//         message: "Submit Failed",
//         description: error.message || "An error occurred during submission.",
//       });
//     }
//   };

//   const validateIssueDate = (_, value) => {
//     const today = dayjs().startOf("day");
//     if (!value) {
//       return Promise.resolve();
//     }
//     const selectedDate = dayjs(value).startOf("day");
//     if (selectedDate.isAfter(today)) {
//       return Promise.reject(
//         new Error("Issue date cannot be later than today ")
//         // (" + today.format("DD/MM/YYYY") + ")
//       );
//     }

//     return Promise.resolve();
//   };

//   const validateExpiredDate = (_, value) => {
//     const issueDate = formStep2.getFieldValue("issueDate");
//     const today = dayjs().startOf("day");

//     if (!value) {
//       return Promise.reject("Please select an expired date.");
//     }

//     if (dayjs(value).isBefore(today)) {
//       return Promise.reject("Expired Date must be in the future.");
//     }

//     if (issueDate && dayjs(value).isBefore(dayjs(issueDate))) {
//       return Promise.reject("Expired Date must be after Issue Date.");
//     }

//     return Promise.resolve();
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold text-blue-600">Store Registration</h1>
//       <div
//         style={{
//           fontSize: "18px",
//           fontWeight: "bold",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <span>Status: </span>
//         <span style={{ marginLeft: "10px" }}>{getStatusTag(status)}</span>

//         {status === "Rejected" && (
//           <Tooltip title="Click to view remark">
//             <ExclamationCircleOutlined
//               style={{ color: "red", marginLeft: "10px", cursor: "pointer" }}
//               onClick={showRemark}
//             />
//           </Tooltip>
//         )}
//       </div>

//       <Steps current={currentStep} className="my-4">
//         <Step title="Store Details" />
//         <Step title="Upload Documents" />
//         <Step title="Submit for Approval" />
//       </Steps>

//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
//             <Spin size="large" />
//             <p className="mt-2 text-gray-600">Loading Data ...</p>
//           </div>
//         </div>
//       )}

//       {/* <div className="bg-white shadow-lg rounded-lg p-6"> */}
//       {/* Step 1: Store Details */}
//       {currentStep === 0 && (
//         <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
//           <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
//             🏪 Store Details
//           </h2>

//           <Form
//             form={form}
//             onFinish={handleStoreDetailsSubmit}
//             layout="vertical"
//             className="mt-5 space-y-6"
//           >
//             {/* Upload Store Logo */}
//             <div className="flex justify-center mt-4">
//               <Form.Item
//                 label="Upload Store Logo"
//                 rules={[
//                   { required: true, message: "Please upload store logo!" },
//                 ]}
//               >
//                 <div className="flex flex-col items-center">
//                   <div className="relative">
//                     {/* Kiểm tra kiểu dữ liệu trước khi gọi URL.createObjectURL */}
//                     {storeLogo instanceof File || storeLogo instanceof Blob ? (
//                       <img
//                         src={URL.createObjectURL(storeLogo)}
//                         alt="Store Logo"
//                         className="w-44 h-44 object-cover border border-gray-300 rounded-full shadow-md cursor-pointer"
//                         onClick={() =>
//                           handleImagePreview(URL.createObjectURL(storeLogo))
//                         }
//                       />
//                     ) : storeDetails?.imageUrl ? (
//                       <img
//                         src={storeDetails.imageUrl}
//                         alt="Store Logo"
//                         className="w-44 h-44 object-cover border border-gray-300 rounded-full shadow-md cursor-pointer"
//                         onClick={() =>
//                           handleImagePreview(storeDetails.imageUrl)
//                         }
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
//                         <ShopOutlined className="text-blue-500 text-4xl" />
//                       </div>
//                     )}

//                     {/* Nút upload ảnh */}
//                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
//                       <Button
//                         icon={<UploadOutlined />}
//                         onClick={() =>
//                           document.getElementById("upload-input").click()
//                         }
//                         className="bg-white-500 text-blue rounded-full"
//                       />
//                     </div>
//                   </div>

//                   {/* Input file ẩn */}
//                   <input
//                     id="upload-input"
//                     type="file"
//                     style={{ display: "none" }}
//                     accept="image/*"
//                     onChange={(e) => {
//                       if (e.target.files[0]) {
//                         setStoreLogo(e.target.files[0]); // Lưu file vào state
//                       }
//                     }}
//                   />
//                 </div>
//               </Form.Item>
//             </div>
//             <div className="grid md:grid-cols-2 gap-4">
//               {/* Store Name */}
//               <Form.Item
//                 label="Store Name"
//                 name="name"
//                 rules={[
//                   { required: true, message: "Please input store name!" },
//                 ]}
//               >
//                 <Input
//                   placeholder="Enter store name"
//                   className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//                 />
//               </Form.Item>

//               {/* Contact Number */}
//               <Form.Item
//                 label="Contact Number"
//                 name="contactNumber"
//                 rules={[
//                   { required: true, message: "Please input contact number!" },
//                 ]}
//               >
//                 <Input
//                   placeholder="Enter contact number"
//                   className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//                 />
//               </Form.Item>

//               {/* Summary */}
//               <Form.Item
//                 label="Summary"
//                 name="summary"
//                 className="col-span-2"
//                 rules={[
//                   { required: true, message: "Please provide a summary!" },
//                   {
//                     max: 255,
//                     message: "Summary cannot exceed 255 characters!",
//                   },
//                 ]}
//               >
//                 <Input
//                   maxLength={255}
//                   placeholder="Brief summary about the store"
//                   className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//                 />
//               </Form.Item>
//             </div>

//             {/* Address Selector Component */}
//             <Form.Item
//               name="address"
//               rules={[
//                 {
//                   required: true,
//                   message:
//                     "Please select all the address fields (Province, District, and Ward).",
//                 },
//               ]}
//             >
//               <AddressSelector
//                 onAddressChange={handleAddressChange}
//                 defaultProvinceId={selectedProvinceId}
//                 defaultDistrictId={selectedDistrictId}
//                 defaultWardId={selectedWardId}
//                 defaultAddressId={selectedAddressId}
//               />
//             </Form.Item>
//             {/* Address */}
//             <Form.Item
//               label="Address"
//               name="address"
//               className="col-span-2"
//               rules={[{ required: true, message: "Please input address!" }]}
//             >
//               <Input
//                 placeholder="Enter store address"
//                 className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//               />
//             </Form.Item>
//             <Form.Item
//               label="Description"
//               name="description"
//               rules={[
//                 { required: true, message: "Please provide a description!" },
//                 {
//                   max: 550,
//                   message: "Description cannot exceed 550 characters!",
//                 },
//               ]}
//             >
//               <Input.TextArea
//                 maxLength={550}
//                 placeholder="Describe your store in detail"
//                 className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//                 rows={4}
//               />
//             </Form.Item>

//             {/* Upload Store Attachments */}
//             <Form.Item label="Store Attachments">
//               <Upload
//                 showUploadList={false}
//                 beforeUpload={(file) => {
//                   handleAddAttachment(file);
//                   return false;
//                 }}
//               >
//                 <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
//                   <UploadOutlined className="text-blue-500 text-4xl mb-2" />
//                   <p className="text-gray-500 text-sm">
//                     Click or drag files to upload
//                   </p>
//                 </div>
//               </Upload>

//               {/* Hiển thị danh sách ảnh đã tải lên */}
//               <div className="mt-4 flex flex-wrap gap-4">
//                 {/* Ảnh mới được upload */}
//                 {storeAttachments.map((file, index) => (
//                   <div key={index} className="relative w-24 h-24">
//                     <img
//                       src={
//                         file instanceof File ? URL.createObjectURL(file) : file
//                       }
//                       alt="Attachment"
//                       className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
//                       onClick={() =>
//                         handleImagePreview(
//                           file instanceof File
//                             ? URL.createObjectURL(file)
//                             : file
//                         )
//                       }
//                     />
//                     {/* <img
//                       src={URL.createObjectURL(file)}
//                       alt="Attachment"
//                       className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
//                       onClick={() =>
//                         handleImagePreview(URL.createObjectURL(file))
//                       }
//                     /> */}
//                     <Button
//                       type="danger"
//                       icon={<CloseCircleOutlined style={{ color: "white" }} />}
//                       onClick={() => handleRemoveAttachment(index, false)}
//                       className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
//                     />
//                   </div>
//                 ))}

//                 {/* Ảnh cũ từ API */}
//                 {existingAttachments.map((url, index) => (
//                   <div key={index} className="relative w-24 h-24">
//                     <img
//                       src={url}
//                       alt="Attachment"
//                       className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
//                       onClick={() => handleImagePreview(url)}
//                     />
//                     <Button
//                       type="danger"
//                       icon={<CloseCircleOutlined style={{ color: "white" }} />}
//                       onClick={() => handleRemoveAttachment(index, true)}
//                       className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </Form.Item>

//             <div className="flex justify-end">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
//               >
//                 Next
//               </Button>
//             </div>
//           </Form>
//         </div>
//       )}

//       {/* Step 2: Upload Documents */}
//       {currentStep === 1 && (
//         <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
//           <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
//             📜 Upload Business Documents
//           </h2>
//           <Form
//             form={formStep2}
//             onFinish={handleDocumentSubmit}
//             layout="vertical"
//             className="mt-5"
//           >
//             {/* Front Identification */}
//             <Form.Item label="Front Identification">
//               <div className="flex flex-col items-center">
//                 {!documents.frontIdentification ? (
//                   <Upload
//                     showUploadList={false}
//                     beforeUpload={() => false}
//                     onChange={(info) => {
//                       const file = info.file;
//                       if (file) {
//                         setDocuments((prev) => ({
//                           ...prev,
//                           frontIdentification: file,
//                         }));
//                       }
//                     }}
//                   >
//                     <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
//                       <UploadOutlined className="text-blue-500 text-3xl" />
//                       <p className="text-gray-500 ml-2">Click or drag file</p>
//                     </div>
//                   </Upload>
//                 ) : (
//                   <div className="relative w-64 h-40">
//                     <img
//                       src={
//                         documents.frontIdentification instanceof File
//                           ? URL.createObjectURL(documents.frontIdentification)
//                           : documents.frontIdentification
//                       }
//                       alt="Front ID"
//                       className="w-full h-full object-cover rounded-lg border border-gray-300"
//                     />

//                     {/* Nút xem ảnh */}
//                     <button
//                       type="button"
//                       className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
//                       onClick={() =>
//                         handleImagePreview(
//                           documents.frontIdentification instanceof File
//                             ? URL.createObjectURL(documents.frontIdentification)
//                             : documents.frontIdentification
//                         )
//                       }
//                     >
//                       <EyeOutlined className="text-blue-500 text-xl cursor-pointer" />
//                     </button>

//                     {/* Nút update ảnh */}
//                     <Upload
//                       showUploadList={false}
//                       beforeUpload={() => false}
//                       onChange={(info) => {
//                         const file = info.file;
//                         if (file) {
//                           setDocuments((prev) => ({
//                             ...prev,
//                             frontIdentification: file,
//                           }));
//                         }
//                       }}
//                     >
//                       <button
//                         type="button"
//                         className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-sm hover:bg-blue-200 transition"
//                       >
//                         <UploadOutlined className="text-blue-500 text-xl" />
//                       </button>
//                     </Upload>
//                   </div>
//                 )}
//               </div>
//             </Form.Item>

//             {/* Back Identification */}
//             <Form.Item label="Back Identification">
//               <div className="flex flex-col items-center">
//                 {!documents.backIdentification ? (
//                   <Upload
//                     showUploadList={false}
//                     beforeUpload={() => false}
//                     onChange={(info) => {
//                       const file = info.file;
//                       if (file) {
//                         setDocuments((prev) => ({
//                           ...prev,
//                           backIdentification: file,
//                         }));
//                       }
//                     }}
//                   >
//                     <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
//                       <UploadOutlined className="text-blue-500 text-3xl" />
//                       <p className="text-gray-500 ml-2">Click or drag file</p>
//                     </div>
//                   </Upload>
//                 ) : (
//                   <div className="relative w-64 h-40">
//                     <img
//                       src={
//                         documents.backIdentification instanceof File
//                           ? URL.createObjectURL(documents.backIdentification)
//                           : documents.backIdentification
//                       }
//                       alt="Back ID"
//                       className="w-full h-full object-cover rounded-lg border border-gray-300"
//                     />

//                     {/* Nút xem ảnh */}
//                     <button
//                       type="button"
//                       className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
//                       onClick={() =>
//                         handleImagePreview(
//                           documents.backIdentification instanceof File
//                             ? URL.createObjectURL(documents.backIdentification)
//                             : documents.backIdentification
//                         )
//                       }
//                     >
//                       <EyeOutlined className="text-blue-500 text-xl cursor-pointer" />
//                     </button>

//                     {/* Nút update ảnh */}
//                     <Upload
//                       showUploadList={false}
//                       beforeUpload={() => false}
//                       onChange={(info) => {
//                         const file = info.file;
//                         if (file) {
//                           setDocuments((prev) => ({
//                             ...prev,
//                             backIdentification: file,
//                           }));
//                         }
//                       }}
//                     >
//                       <button
//                         type="button"
//                         className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-sm hover:bg-blue-200 transition"
//                       >
//                         <UploadOutlined className="text-blue-500 text-xl" />
//                       </button>
//                     </Upload>
//                   </div>
//                 )}
//               </div>
//             </Form.Item>

//             <Form.Item label="Business Licenses">
//               <div className="flex justify-center">
//                 <Upload
//                   showUploadList={false}
//                   beforeUpload={(file) => {
//                     setDocuments((prev) => ({
//                       ...prev,
//                       businessLicences: file,
//                     }));
//                     return false;
//                   }}
//                 >
//                   <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
//                     <UploadOutlined className="text-blue-500 text-3xl" />
//                     <p className="text-gray-500">
//                       Click or drag files to upload
//                     </p>
//                   </div>
//                 </Upload>
//               </div>

//               <div className="mt-4 flex justify-center">
//                 {documents.businessLicences && (
//                   <img
//                     src={
//                       documents.businessLicences instanceof File
//                         ? URL.createObjectURL(documents.businessLicences)
//                         : documents.businessLicences
//                     }
//                     alt="Business License"
//                     className="w-64 h-40 object-cover rounded-lg border border-gray-600 mt-2"
//                     onClick={() =>
//                       handleImagePreview(
//                         documents.businessLicences instanceof File
//                           ? URL.createObjectURL(documents.businessLicences)
//                           : documents.businessLicences
//                       )
//                     }
//                   />
//                 )}
//               </div>
//             </Form.Item>

//             <div className="grid md:grid-cols-2 gap-4">
//               <Form.Item
//                 label="TAX"
//                 name="liscenseNumber"
//                 rules={[
//                   { required: true, message: "Please input TAX!" },
//                 ]}
//               >
//                 <Input placeholder="Enter TAX" />
//               </Form.Item>

//               <Form.Item
//                 label="Issued By"
//                 name="issueBy"
//                 rules={[{ required: true, message: "Please input issuer!" }]}
//               >
//                 <Input placeholder="Issuer of the license" />
//               </Form.Item>

//               <Form.Item
//                 label="Issue Date"
//                 name="issueDate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select an issue date.",
//                   },
//                   { validator: validateIssueDate },
//                 ]}
//               >
//                 <Input type="date" />
//               </Form.Item>

//               <Form.Item
//                 label="Expired Date"
//                 name="expiredDate"
//                 dependencies={["issueDate"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select an expired date.",
//                   },
//                   { validator: validateExpiredDate },
//                 ]}
//               >
//                 <Input type="date" />
//               </Form.Item>

//               {/* <Form.Item label="Issue Date" name="issueDate">
//                 <Input type="date" />
//               </Form.Item>
//               <Form.Item label="Expired Date" name="expiredDate">
//                 <Input type="date" />
//               </Form.Item> */}
//             </div>

//             <div className="flex justify-between">
//               <Button
//                 type="default"
//                 onClick={() => setCurrentStep(0)}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//               >
//                 Back
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
//               >
//                 Next
//               </Button>
//             </div>
//             {/* <Button type="primary" htmlType="submit" className="w-full mt-4">
//               Next
//             </Button> */}
//           </Form>
//         </div>
//       )}
//       {/* Modal xem ảnh lớn hơn */}
//       <Modal
//         visible={previewVisible}
//         footer={null}
//         onCancel={() => setPreviewVisible(false)}
//         centered
//       >
//         <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
//       </Modal>
//       {/* Step 3: Submit */}
//       {currentStep === 2 && (
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
//             Review Store Information
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Store Details */}
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-3">
//                 🏪 Store Details
//               </h3>
//               <p className="mb-1">
//                 <strong>Name:</strong> {storeDetails?.name}
//               </p>
//               <p className="mb-1">
//                 <strong>Contact:</strong> {storeDetails?.contactNumber}
//               </p>
//               <p className="mb-1">
//                 <strong>Address:</strong> {storeDetails?.address}
//               </p>
//               <p className="mb-1">
//                 <strong>Summary:</strong> {storeDetails?.summary}
//               </p>
//               <p className="mb-3">
//                 <strong>Description:</strong> {storeDetails?.description}
//               </p>

//               {storeDetails?.imageUrl && (
//                 <div className="flex justify-center">
//                   <img
//                     src={storeDetails.imageUrl}
//                     alt="Store Logo"
//                     className="w-64 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Business License */}
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-3">
//                 📜 Business License
//               </h3>
//               <p className="mb-1">
//                 <strong>TAX:</strong>{" "}
//                 {businessLicense.data?.liscenseNumber}
//               </p>
//               <p className="mb-1">
//                 <strong>Issued By:</strong> {businessLicense.data?.issueBy}
//               </p>
//               <p className="mb-1">
//                 <strong>Issue Date:</strong>{" "}
//                 {businessLicense.data?.issueDate?.split("T")[0]}
//               </p>
//               <p className="mb-3">
//                 <strong>Expired Date:</strong>{" "}
//                 {businessLicense.data?.expiredDate?.split("T")[0]}
//               </p>

//               {businessLicense.data?.businessLicences && (
//                 <div className="flex justify-center">
//                   <img
//                     src={businessLicense.data.businessLicences}
//                     alt="Business License"
//                     className="w-64 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-between mt-6">
//             {/* Nút Back sát bên trái */}
//             <Button
//               type="default"
//               onClick={() => setCurrentStep(0)}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//             >
//               Edit Information
//             </Button>

//             {/* Nút Submit Registration ở giữa */}
//             <Button
//               type="primary"
//               onClick={handleSubmitApproval}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
//             >
//               ✅ Submit Registration
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StoreRegistration;

import {
  Button,
  Form,
  Input,
  Upload,
  notification,
  Spin,
  Steps,
  Tooltip,
  Tag,
  Modal,
} from "antd";
import {
  UploadOutlined,
  // CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  submitStoreInfo,
  submitStoreDocuments,
  submitStoreApproval,
  getStoreDetails,
  getBusinessLicenseDetails,
  fetchUserStatus,
} from "./../../redux/slices/storeRegistrationSlice";
import { useState, useEffect } from "react";
import { uploadFiles, getUserRequestDetails } from "./../../api/apiConfig";
// import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AddressSelector from "../StoreIoT/components/AddressSelector";
import {
  validateIssueDate,
  validateExpiredDate,
  validateContactNumber,
} from "./../../pages/validators";
const { Step } = Steps;

const StoreRegistration = () => {
  const dispatch = useDispatch();
  const { loading, status, remark } = useSelector(
    (state) => state.storeRegistration
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeAttachments, setStoreAttachments] = useState([]);
  const [logoLoading, setLogoLoading] = useState(false);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    frontIdentification: null,
    backIdentification: null,
    businessLicences: null,
  });
  const [docloading, setDocloading] = useState({
    frontIdentification: false,
    backIdentification: false,
    businessLicences: false,
  });
  const [storeDetails, setStoreDetails] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [storeId, setStoreId] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [form] = Form.useForm();
  const [formStep2] = Form.useForm();
  // State để lưu ID của tỉnh/thành phố, quận/huyện, phường/xã
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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
  const getStatusTag = (status) => {
    const statusInfo = statusColors[status?.trim()] || {
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
        {status}
      </Tag>
    );
  };

  const userId = localStorage.getItem("userId");

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
          // setCurrentStep(3);
          navigate("/store/submission-success");
        }
        if (userRequestStatus === "Approved") {
          navigate("/payment-packages");
        }
      } catch (error) {
        console.error("Error fetching user request status:", error);
      }
    };

    checkUserStatus();
  }, [dispatch, navigate]);

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

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (userId) {
        try {
          const storeResponse = await dispatch(getStoreDetails(userId));
          if (storeResponse.payload && storeResponse.payload.data) {
            setStoreDetails(storeResponse.payload.data);
            setStoreId(storeResponse.payload.data.id);
            setSelectedProvinceId(
              storeResponse.payload.data.provinceId || null
            );
            setSelectedDistrictId(
              storeResponse.payload.data.districtId || null
            );
            setSelectedWardId(storeResponse.payload.data.wardId || null);
            setSelectedAddressId(storeResponse.payload.data.addressId || null);

            if (storeResponse.payload.data.id) {
              const businessLicenseResponse = await dispatch(
                getBusinessLicenseDetails(storeResponse.payload.data.id)
              );
              if (businessLicenseResponse.payload) {
                setBusinessLicense(businessLicenseResponse.payload);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching store details:", error);
          notification.error({
            message: "Error fetching store details",
            description: error.message,
          });
        }
      }
    };
    fetchStoreDetails();
  }, [dispatch, userId]);

  const handleAddressChange = (newFullAddress, ids) => {
    setSelectedProvinceId(ids.provinceId);
    setSelectedDistrictId(ids.districtId);
    setSelectedWardId(ids.wardId);
    setSelectedAddressId(ids.addressId);
  };

  useEffect(() => {
    if (currentStep === 2) {
      const fetchStoreAndLicenseDetails = async () => {
        if (userId) {
          try {
            const storeResponse = await dispatch(getStoreDetails(userId));
            if (storeResponse.payload && storeResponse.payload.data) {
              setStoreDetails(storeResponse.payload.data);
            }
            const businessLicenseResponse = await dispatch(
              getBusinessLicenseDetails(storeDetails?.id)
            );
            if (businessLicenseResponse.payload) {
              setBusinessLicense(businessLicenseResponse.payload);
            }
          } catch (error) {
            console.error("Error fetching details:", error);
            notification.error({
              message: "Error fetching details",
              description: error.message,
            });
          }
        }
      };
      fetchStoreAndLicenseDetails();
    }
  }, [currentStep, dispatch, storeDetails?.id, userId]);

  useEffect(() => {
    if (storeDetails) {
      setSelectedProvinceId(storeDetails.provinceId);
      setSelectedDistrictId(storeDetails.districtId);
      setSelectedWardId(storeDetails.wardId);
      setSelectedAddressId(storeDetails.addressId);
      form.setFieldsValue({
        name: storeDetails.name,
        contactNumber: storeDetails.contactNumber,
        address: storeDetails.address,
        summary: storeDetails.summary,
        description: storeDetails.description,
        provinces: storeDetails.provinceName,
        districts: storeDetails.districtName,
        wards: storeDetails.wardName,
        addressId: storeDetails.addressName,
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

  const handleUpload = async (file, setState, loadingSetter) => {
    loadingSetter(true);
    try {
      const response = await uploadFiles(file);
      const imageUrl = response;
      setState(imageUrl);
      notification.success({
        message: "Upload Successful",
        description: "Image uploaded successfully!",
      });
      return imageUrl;
    } catch (error) {
      notification.error({
        message: "Upload Failed",
        description: error.message,
      });
      setState(null);
      return null;
    } finally {
      loadingSetter(false);
    }
  };

  const handleImagePreview = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setPreviewVisible(true);
    }
  };

  useEffect(() => {
    if (storeDetails?.storeAttachments) {
      setExistingAttachments(
        storeDetails.storeAttachments.map((att) => att.imageUrl)
      );
    }
  }, [storeDetails]);

  const handleAddAttachment = async (file) => {
    setAttachmentsLoading(true);
    const url = await handleUpload(
      file,
      (url) => setStoreAttachments((prev) => [...prev, url]),
      setAttachmentsLoading
    );
    if (!url)
      setStoreAttachments((prev) => prev.filter((item) => item !== file));
  };

  const handleRemoveAttachment = (index, isExisting = false) => {
    if (isExisting) {
      setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
    } else {
      setStoreAttachments(storeAttachments.filter((_, i) => i !== index));
    }
  };

  const handleStoreDetailsSubmit = async (values) => {
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

    const newAttachmentsUrls = await Promise.all(
      storeAttachments.map(async (file) =>
        file instanceof File
          ? await handleUpload(file, (url) => url, setAttachmentsLoading)
          : file
      )
    );

    if (newAttachmentsUrls.includes(null)) {
      notification.error({ message: "Some attachments failed to upload!" });
      return;
    }

    const allAttachments = [
      ...existingAttachments,
      ...newAttachmentsUrls.filter(Boolean),
    ];
    const storeData = {
      ...values,
      provinceId: selectedProvinceId,
      districtId: selectedDistrictId,
      wardId: selectedWardId,
      addressId: selectedAddressId,
      imageUrl: logoUrl, // This is now the URL string from response.data.id
      storeAttachments: allAttachments.map((url) => ({ imageUrl: url })), // URLs are correctly mapped
    };

    try {
      const storeInfo = await dispatch(submitStoreInfo({ userId, storeData }));
      if (storeInfo.payload && storeInfo.payload.id) {
        setCurrentStep(1);
        const storeResponse = await dispatch(getStoreDetails(userId));
        if (storeResponse.payload && storeResponse.payload.data) {
          setStoreId(storeResponse.payload.data.id);
        }
      }
      // notification.success({
      //   message: "Store details submitted successfully!",
      // });
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

      const response = await dispatch(submitStoreDocuments(documentData));

      if (submitStoreDocuments.fulfilled.match(response)) {
        notification.success({ message: "Documents uploaded successfully!" });
        setCurrentStep(2);
      }
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.message,
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
      // 🛠 Gọi API lấy thông tin store
      const storeResponse = await dispatch(getStoreDetails(userId));
      if (storeResponse.payload && storeResponse.payload.data) {
        setStoreDetails(storeResponse.payload.data);
        setStoreId(storeResponse.payload.data.id);
      }

      // 🛠 Gọi API lấy thông tin business license
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

      // 🛠 Gọi API lấy request ID
      const userRequestResponse = await getUserRequestDetails(userId);
      const requestId = userRequestResponse.data.userRequestInfo?.id;

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
      // setCurrentStep(3);
      // ✅ Chuyển hướng sang trang "/store/submission-success"
      navigate("/store/submission-success");
    } catch (error) {
      notification.error({
        message: "Submit Failed",
        description: error.message || "An error occurred during submission.",
      });
    }
  };

  const handleUploads = async (file, field) => {
    setDocloading((prev) => ({ ...prev, [field]: true }));
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
      setDocloading((prev) => ({ ...prev, [field]: false }));
    }
  };
  const handleFileChange = (info, field) => {
    const file = info.file;
    if (file) {
      handleUploads(file, field);
    }
  };

  const renderUploadArea = (field, label) => (
    <Form.Item label={label}>
      <div className="flex flex-col items-center">
        {docloading[field] ? (
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
    <div className="p-5">
      <h1 className="text-2xl font-bold text-blue-600">Store Registration</h1>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Status: </span>
        <span style={{ marginLeft: "10px" }}>{getStatusTag(status)}</span>

        {status === "Rejected" && (
          <Tooltip title="Click to view remark">
            <ExclamationCircleOutlined
              style={{ color: "red", marginLeft: "10px", cursor: "pointer" }}
              onClick={showRemark}
            />
          </Tooltip>
        )}
      </div>

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
            <div className="flex justify-center mt-4">
              <Form.Item
                label="Upload Store Logo"
                rules={[
                  { required: true, message: "Please upload store logo!" },
                ]}
              >
                <div className="flex flex-col items-center">
                  {logoLoading ? (
                    <div className="w-44 h-44 flex items-center justify-center">
                      <Spin tip="Uploading..." />
                    </div>
                  ) : storeLogo ? (
                    <div className="relative">
                      <img
                        src={storeLogo}
                        alt="Store Logo"
                        className="w-44 h-44 object-cover border border-gray-300 rounded-full shadow-md cursor-pointer"
                        onClick={() => handleImagePreview(storeLogo)}
                      />
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={(info) =>
                          info.file &&
                          handleUpload(info.file, setStoreLogo, setLogoLoading)
                        }
                      >
                        <Button
                          icon={<UploadOutlined />}
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 bg-white-500 text-blue rounded-full"
                        />
                      </Upload>
                    </div>
                  ) : storeDetails?.imageUrl ? (
                    <div className="relative">
                      <img
                        src={storeDetails.imageUrl}
                        alt="Store Logo"
                        className="w-44 h-44 object-cover border border-gray-300 rounded-full shadow-md cursor-pointer"
                        onClick={() =>
                          handleImagePreview(storeDetails.imageUrl)
                        }
                      />
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={(info) =>
                          info.file &&
                          handleUpload(info.file, setStoreLogo, setLogoLoading)
                        }
                      >
                        <Button
                          icon={<UploadOutlined />}
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 bg-white-500 text-blue rounded-full"
                        />
                      </Upload>
                    </div>
                  ) : (
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={(info) =>
                        info.file &&
                        handleUpload(info.file, setStoreLogo, setLogoLoading)
                      }
                    >
                      <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                        <ShopOutlined className="text-blue-500 text-4xl" />
                      </div>
                    </Upload>
                  )}
                </div>
              </Form.Item>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
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
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[{ validator: validateContactNumber }]}
              >
                <Input
                  placeholder="Enter contact number"
                  className="border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </Form.Item>
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
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message:
                    "Please select all the address fields (Province, District, and Ward).",
                },
              ]}
            >
              <AddressSelector
                onAddressChange={handleAddressChange}
                defaultProvinceId={selectedProvinceId}
                defaultDistrictId={selectedDistrictId}
                defaultWardId={selectedWardId}
                defaultAddressId={selectedAddressId}
              />
            </Form.Item>
            {/* {storeDetails &&
              storeDetails.addressName &&
              storeDetails.wardName &&
              storeDetails.districtName &&
              storeDetails.provinceName && (
                <div>
                  <p>
                    <strong>Selected address:</strong>{" "}
                    {storeDetails.addressName}, {storeDetails.wardName},{" "}
                    {storeDetails.districtName}, {storeDetails.provinceName}
                  </p>
                </div>
              )} */}
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
            <Form.Item label="Store Attachments">
              {attachmentsLoading ? (
                <div className="flex justify-center p-6">
                  <Spin tip="Uploading attachment..." />
                </div>
              ) : (
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
              )}
              <div className="mt-4 flex flex-wrap gap-4">
                {storeAttachments.map((file, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={file}
                      alt="Attachment"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
                      onClick={() => handleImagePreview(file)}
                    />
                    <Button
                      type="danger"
                      icon={<CloseCircleOutlined style={{ color: "white" }} />}
                      onClick={() => handleRemoveAttachment(index, false)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
                    />
                  </div>
                ))}
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
            </Form.Item>
            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={logoLoading || attachmentsLoading}
              >
                Next
              </Button>
            </div>
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
            {renderUploadArea("frontIdentification", "Front Identification")}
            {renderUploadArea("backIdentification", "Back Identification")}
            {renderUploadArea("businessLicences", "Business Licenses")}

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Tax Number"
                name="liscenseNumber"
                rules={[
                  { required: true, message: "Please input Tax Number!" },
                ]}
              >
                <Input placeholder="Enter tax number here" />
              </Form.Item>

              <Form.Item
                label="Issued By"
                name="issueBy"
                rules={[{ required: true, message: "Please input issuer!" }]}
              >
                <Input placeholder="Issuer of the license" />
              </Form.Item>
              <Form.Item
                label="Issue Date"
                name="issueDate"
                rules={[
                  { required: true, message: "Please select an issue date." },
                  { validator: validateIssueDate },
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
                  { validator: validateExpiredDate(form) },
                ]}
              >
                <Input type="date" />
              </Form.Item>

              {/* <Form.Item label="Issue Date" name="issueDate">
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Expired Date" name="expiredDate">
                <Input type="date" />
              </Form.Item> */}
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
      {/* Modal xem ảnh lớn hơn */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      {/* Step 3: Submit */}
      {currentStep === 2 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            Review Store Information
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
                <strong>Tax Number :</strong>{" "}
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

          <div className="flex justify-between mt-6">
            {/* Nút Back sát bên trái */}
            <Button
              type="default"
              onClick={() => setCurrentStep(0)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Edit Information
            </Button>

            {/* Nút Submit Registration ở giữa */}
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
