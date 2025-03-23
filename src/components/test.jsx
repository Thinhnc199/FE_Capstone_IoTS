// import ContextHome from "../pages/Home/ContextHome/ContextHome";
// export default function Test() {
//   return <div> {<ContextHome />}</div>;
// }

// import { useState, useEffect, useCallback } from "react";
// import {
//   Button,
//   Form,
//   notification,
//   Modal,
//   Upload,
//   Input,
//   Tooltip,
//   Tag,
//   Spin,
// } from "antd";
// import {
//   UploadOutlined,
//   CheckCircleOutlined,
//   EyeOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";
// import { uploadFiles, getUserRequestDetails } from "./../api/apiConfig";
// import {
//   submitTrainerDocuments,
//   submitForApproval,
//   getTrainerBusinessLicenseDetails,
//   fetchUserStatus,
// } from "./../redux/slices/trainerSlice";
// import { useDispatch, useSelector } from "react-redux";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";

// const TrainerRegister = () => {
//   const [documents, setDocuments] = useState({
//     frontIdentification: null,
//     backIdentification: null,
//     businessLicences: null,
//   });
//   const [loading, setLoading] = useState({
//     frontIdentification: false,
//     backIdentification: false,
//     businessLicences: false,
//   });
//   const { remark } = useSelector((state) => state.trainerRegister);

//   const [currentStep, setCurrentStep] = useState(0);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [requestId, setRequestId] = useState(null);
//   const [formStep1] = Form.useForm();
//   const [businessLicense, setBusinessLicense] = useState(null);
//   const dispatch = useDispatch();
//   const requestStatus = useSelector(
//     (state) => state.trainerRegister.requestStatus
//   );
//   const trainerId = localStorage.getItem("userId");
//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const navigate = useNavigate();

//   const handleImagePreview = (imageUrl) => {
//     setPreviewImage(imageUrl);
//     setPreviewVisible(true);
//   };

//   const fetchBusinessLicense = useCallback(() => {
//     if (trainerId) {
//       dispatch(getTrainerBusinessLicenseDetails(trainerId))
//         .then((response) => {
//           if (response.payload && response.payload.data) {
//             setBusinessLicense(response.payload.data);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching Trainer Business License:", error);
//         });
//     }
//   }, [trainerId, dispatch]);

//   useEffect(() => {
//     fetchBusinessLicense();
//   }, [fetchBusinessLicense]);

//   useEffect(() => {
//     if (businessLicense) {
//       formStep1.setFieldsValue({
//         issueBy: businessLicense?.issueBy,
//         issueDate: businessLicense?.issueDate?.split("T")[0],
//         expiredDate: businessLicense?.expiredDate?.split("T")[0],
//       });

//       setDocuments({
//         frontIdentification: businessLicense.frontIdentification || null,
//         backIdentification: businessLicense.backIdentification || null,
//         businessLicences: businessLicense.businessLicences || null,
//       });
//     }
//   }, [businessLicense, formStep1]);

//   const handleUpload = async (file, field) => {
//     setLoading((prev) => ({ ...prev, [field]: true }));
//     try {
//       const imageUrl = await uploadFiles(file);
//       setDocuments((prev) => ({ ...prev, [field]: imageUrl }));
//       notification.success({
//         message: "Upload Successful",
//         description: `${field} uploaded successfully!`,
//       });
//       return imageUrl;
//     } catch (error) {
//       notification.error({
//         message: "Upload Failed",
//         description: error.message,
//       });
//       setDocuments((prev) => ({ ...prev, [field]: null }));
//       return null;
//     } finally {
//       setLoading((prev) => ({ ...prev, [field]: false }));
//     }
//   };

//   // Handle file change and immediate upload
//   const handleFileChange = (info, field) => {
//     const file = info.file;
//     if (file) {
//       handleUpload(file, field);
//     }
//   };

//   useEffect(() => {
//     if (currentStep === 2 && requestId) {
//       setIsModalVisible(true);
//     }
//   }, [currentStep, requestId]);

//   const handleDocumentSubmit = async (values) => {
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         notification.error({ message: "User ID not found!" });
//         return;
//       }

//       const documentData = {
//         trainerId: userId,
//         frontIdentification: documents.frontIdentification,
//         backIdentification: documents.backIdentification,
//         businessLicences: documents.businessLicences,
//         issueBy: values.issueBy,
//         issueDate: values.issueDate,
//         expiredDate: values.expiredDate,
//       };

//       const response = await dispatch(submitTrainerDocuments(documentData));

//       if (submitTrainerDocuments.fulfilled.match(response)) {
//         notification.success({ message: "Documents submitted successfully!" });
//         const userRequestResponse = await getUserRequestDetails(userId);
//         const fetchedRequestId = userRequestResponse?.data?.userRequestInfo?.id;

//         if (!fetchedRequestId) {
//           notification.error({
//             message: "Request ID not found in API response!",
//           });
//           return;
//         }

//         setRequestId(fetchedRequestId);
//         setCurrentStep(2);
//         setIsModalVisible(true);
//       }
//     } catch (error) {
//       notification.error({
//         message: "Submit Failed",
//         description: error.response?.data?.message || error.message,
//       });
//     }
//   };

//   const handleApprovalSubmit = async () => {
//     if (!requestId) {
//       notification.error({ message: "Request ID not found!" });
//       return;
//     }

//     try {
//       await dispatch(submitForApproval(requestId));
//       dispatch({
//         type: "trainerRegister/setRequestStatus",
//         payload: "Pending to Approved",
//       });
//       notification.success({
//         message: "Trainer registration submitted for approval!",
//       });
//       setCurrentStep(1);
//       setIsModalVisible(false);
//     } catch (error) {
//       notification.error({
//         message: "Submit Failed",
//         description: error.response?.data?.message || error.message,
//       });
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
//             type: "trainerRegister/setRequestStatus",
//             payload: userRequestStatus,
//           });
//         }

//         if (userRequestStatus === "Pending to Approved") setCurrentStep(1);
//         if (userRequestStatus === "Rejected") setCurrentStep(0);
//         if (userRequestStatus === "Approved")
//           navigate("/trainer/payment-packages");
//       } catch (error) {
//         console.error("Error fetching user request status:", error);
//       }
//     };

//     checkUserStatus();
//   }, [dispatch, navigate]);

//   const handleCancelModal = () => {
//     setIsModalVisible(false);
//     setCurrentStep(0);
//   };

//   const validateExpiredDate = (_, value) => {
//     const issueDate = formStep1.getFieldValue("issueDate");
//     const today = dayjs().startOf("day");

//     if (!value) return Promise.reject("Please select an expired date.");
//     if (dayjs(value).isBefore(today))
//       return Promise.reject("Expired Date must be in the future.");
//     if (issueDate && dayjs(value).isBefore(dayjs(issueDate)))
//       return Promise.reject("Expired Date must be after Issue Date.");
//     return Promise.resolve();
//   };

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

//   const getStatusTag = (requestStatus) => {
//     const statusInfo = statusColors[requestStatus?.trim()] || {
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
//         {requestStatus}
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

//   const renderUploadArea = (field, label) => (
//     <Form.Item label={label}>
//       <div className="flex flex-col items-center">
//         {loading[field] ? (
//           <div className="w-64 h-40 flex items-center justify-center">
//             <Spin tip="Uploading..." />
//           </div>
//         ) : !documents[field] ? (
//           <Upload
//             showUploadList={false}
//             beforeUpload={() => false}
//             onChange={(info) => handleFileChange(info, field)}
//           >
//             <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center">
//               <UploadOutlined className="text-blue-500 text-3xl" />
//               <p className="text-gray-500 ml-2">Click or drag file</p>
//             </div>
//           </Upload>
//         ) : (
//           <div className="relative w-64 h-40">
//             <img
//               src={documents[field]}
//               alt={label}
//               className="w-full h-full object-cover rounded-lg border border-gray-300"
//             />
//             <button
//               type="button"
//               className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
//               onClick={() => handleImagePreview(documents[field])}
//             >
//               <EyeOutlined className="text-blue-500 text-xl" />
//             </button>
//             <Upload
//               showUploadList={false}
//               beforeUpload={() => false}
//               onChange={(info) => handleFileChange(info, field)}
//             >
//               <button
//                 type="button"
//                 className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-sm hover:bg-blue-200 transition"
//               >
//                 <UploadOutlined className="text-blue-500 text-xl" />
//               </button>
//             </Upload>
//           </div>
//         )}
//       </div>
//     </Form.Item>
//   );

//   return (
//     <div>
//       {currentStep === 0 && (
//         <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
//           <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
//             📜 Upload Trainer Documents
//           </h2>
//           <div
//             style={{
//               fontSize: "18px",
//               fontWeight: "bold",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <span>Status: </span>
//             <span style={{ marginLeft: "10px" }}>
//               {getStatusTag(requestStatus)}
//             </span>
//             {requestStatus === "Rejected" && (
//               <Tooltip title="Click to view remark">
//                 <ExclamationCircleOutlined
//                   style={{
//                     color: "red",
//                     marginLeft: "10px",
//                     cursor: "pointer",
//                   }}
//                   onClick={showRemark}
//                 />
//               </Tooltip>
//             )}
//           </div>
//           <Form
//             form={formStep1}
//             onFinish={handleDocumentSubmit}
//             layout="vertical"
//             className="mt-5"
//           >
//             {renderUploadArea("frontIdentification", "Front Identification")}
//             {renderUploadArea("backIdentification", "Back Identification")}
//             {renderUploadArea("businessLicences", "Business Licenses")}

//             <Form.Item
//               label="Issued By"
//               name="issueBy"
//               rules={[{ required: true, message: "Please input issuer!" }]}
//             >
//               <Input placeholder="Issuer of the license" />
//             </Form.Item>

//             <div className="grid md:grid-cols-2 gap-4">
//               <Form.Item
//                 label="Issue Date"
//                 name="issueDate"
//                 rules={[
//                   { required: true, message: "Please select an issue date." },
//                 ]}
//               >
//                 <Input type="date" />
//               </Form.Item>
//               <Form.Item
//                 label="Expired Date"
//                 name="expiredDate"
//                 dependencies={["issueDate"]}
//                 rules={[
//                   { required: true, message: "Please select an expired date." },
//                   { validator: validateExpiredDate },
//                 ]}
//               >
//                 <Input type="date" />
//               </Form.Item>
//             </div>
//             <div className="flex justify-center mt-6">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
//                 disabled={Object.values(loading).some((val) => val)}
//               >
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         </div>
//       )}

//       <Modal
//         visible={previewVisible}
//         footer={null}
//         onCancel={() => setPreviewVisible(false)}
//         centered
//       >
//         <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
//       </Modal>

//       <Modal
//         title="Submit for Approval"
//         visible={isModalVisible}
//         onCancel={handleCancelModal}
//         footer={[
//           <Button key="back" onClick={handleCancelModal}>
//             Cancel
//           </Button>,
//           <Button key="submit" type="primary" onClick={handleApprovalSubmit}>
//             Submit for Approval
//           </Button>,
//         ]}
//       >
//         <p>
//           Are you sure you want to submit your business license for approval?
//         </p>
//       </Modal>

//       {currentStep === 1 && requestStatus === "Pending to Approved" && (
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
//             🎉 Submission Successful!
//           </h2>
//           <div className="flex justify-center">
//             <div className="bg-green-100 p-6 rounded-lg shadow-md text-center max-w-lg">
//               <div className="mb-4">
//                 <CheckCircleOutlined className="text-4xl text-green-500" />
//               </div>
//               <h3 className="text-xl font-semibold text-green-700 mb-2">
//                 Trainer Registration has been successfully submitted!
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Congratulations! Your application to become a trainer has been
//                 received.
//               </p>
//               <p className="text-gray-600 mb-4">
//                 Our team is now reviewing your submission. You’ll hear back
//                 soon.
//               </p>
//               <p className="text-sm text-gray-500 italic">
//                 Note: Approval typically takes 1-3 business days.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerRegister;
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Form, Input, Button, Modal, notification, Upload } from "antd";
// import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
// import {
//   createLabVideoPlaylist,
//   getLabPlaylist,
//   submitLab,
//   uploadLabVideo,
// } from "./../../../redux/slices/labSlice";
// import PropTypes from "prop-types";

// const { TextArea } = Input;

// const Step2Form = ({ labId, onBack }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { loading, error, videoUrl } = useSelector((state) => state.lab);
//   const [videos, setVideos] = useState([]);
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState("");
//   const [file, setFile] = useState(null); // Lưu file video được chọn

//   // Fetch initial playlist when component mounts
//   useEffect(() => {
//     if (labId) {
//       dispatch(getLabPlaylist(labId))
//         .unwrap()
//         .then((response) => {
//           console.log("Playlist response:", response);
//           const videoList = Array.isArray(response?.data) ? response.data : [];
//           setVideos(videoList);
//         })
//         .catch((err) => {
//           console.error("Error fetching playlist:", err);
//           notification.error({
//             message: "Failed to fetch playlist",
//             description: err?.message || "Unknown error",
//           });
//           setVideos([]);
//         });
//     } else {
//       notification.error({ message: "labId is undefined" });
//       setVideos([]);
//     }
//   }, [dispatch, labId]);

//   // Hiển thị lỗi nếu có
//   useEffect(() => {
//     if (error) {
//       notification.error({
//         message: "An error occurred",
//         description: error?.message || "Unknown error",
//       });
//     }
//   }, [error]);

//   // Cập nhật videoUrl vào Form sau khi upload thành công
//   useEffect(() => {
//     if (videoUrl) {
//       form.setFieldsValue({ videoUrl }); // Điền URL vào Form
//     }
//   }, [videoUrl, form]);

//   // Xử lý khi chọn file video
//   const handleFileChange = (info) => {
//     const selectedFile = info.fileList[0]?.originFileObj;
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   // Xử lý upload video
//   const handleUpload = async () => {
//     if (!file) {
//       notification.error({ message: "Please select a video file first!" });
//       return;
//     }
//     try {
//       await dispatch(uploadLabVideo(file)).unwrap();
//       // Video URL sẽ được cập nhật qua useEffect vào Form
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   // Xử lý thêm video vào danh sách
//   const handleInsert = (values) => {
//     const videoData = { ...values, labId };
//     setVideos([videoData, ...videos]); // Thêm video mới vào danh sách
//     form.resetFields(); // Reset Form sau khi thêm
//     setFile(null); // Reset file upload
//   };

//   const handleDelete = (index) => {
//     const videoToDelete = videos[index];
//     if (videoToDelete.id) {
//       console.log(`Delete video with id: ${videoToDelete.id}`);
//       // Gọi API delete nếu có
//     }
//     setVideos(videos.filter((_, i) => i !== index));
//   };

//   const handleEdit = (index) => {
//     form.setFieldsValue(videos[index]);
//     setVideos(videos.filter((_, i) => i !== index));
//   };

//   const handleDraft = () => {
//     Modal.confirm({
//       title: "Save as Draft and Submit",
//       content: "Do you want to submit this lab to Store for collaboration?",
//       onOk: () => {
//         const playlistData = videos.map((video) => ({
//           labId,
//           title: video.title,
//           description: video.description,
//           videoUrl: video.videoUrl,
//         }));
//         dispatch(createLabVideoPlaylist({ labId, playlist: playlistData }))
//           .unwrap()
//           .then((response) => {
//             console.log("Create playlist response:", response);
//             if (response?.isSuccess && response?.statusCode === 200) {
//               return dispatch(submitLab(labId)).unwrap();
//             } else {
//               throw new Error(
//                 response?.message || "Failed to create video playlist"
//               );
//             }
//           })
//           .then(() => {
//             notification.success({
//               message: "Lab Submitted Successfully!",
//               description: "Redirecting to welcome page in 5 seconds...",
//             });
//             setTimeout(() => {
//               window.location.href = "/trainer/welcome";
//             }, 5000); // Giảm thời gian từ 30s xuống 5s để nhanh hơn
//           })
//           .catch((err) => {
//             console.error("Error in draft process:", err);
//             notification.error({
//               message: "Failed to submit lab",
//               description: err?.message || "Unknown error",
//             });
//           });
//       },
//       onCancel: () => {
//         const playlistData = videos.map((video) => ({
//           labId,
//           title: video.title,
//           description: video.description,
//           videoUrl: video.videoUrl,
//         }));
//         dispatch(createLabVideoPlaylist({ labId, playlist: playlistData }))
//           .unwrap()
//           .then((response) => {
//             console.log("Create draft response:", response);
//             if (response?.isSuccess && response?.statusCode === 200) {
//               notification.success({ message: "Draft Saved Successfully!" });
//             } else {
//               throw new Error(response?.message || "Failed to save draft");
//             }
//           })
//           .catch((err) => {
//             console.error("Error saving draft:", err);
//             notification.error({
//               message: "Failed to save draft",
//               description: err?.message || "Unknown error",
//             });
//           });
//       },
//     });
//   };

//   return (
//     <div>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleInsert}
//         initialValues={{ title: "", description: "", videoUrl: "" }}
//       >
//         <Form.Item
//           name="title"
//           label="Video Title"
//           rules={[{ required: true, message: "Please enter video title" }]}
//         >
//           <Input placeholder="Enter video title" />
//         </Form.Item>
//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[{ required: true, message: "Please enter description" }]}
//         >
//           <TextArea rows={4} placeholder="Enter video description" />
//         </Form.Item>
//         <Form.Item
//           name="videoUrl"
//           label="Video URL"
//           rules={[{ required: true, message: "Please upload a video" }]}
//         >
//           <div className="flex items-center gap-4">
//             <Input
//               placeholder="Video URL will appear here after upload"
//               value={form.getFieldValue("videoUrl")}
//               disabled // Không cho nhập tay
//             />
//             <Upload
//               accept="video/*"
//               beforeUpload={() => false} // Ngăn upload tự động
//               onChange={handleFileChange}
//               fileList={file ? [{ uid: "-1", name: file.name }] : []}
//               showUploadList={true}
//             >
//               <Button icon={<UploadOutlined />}>Select Video</Button>
//             </Upload>
//             <Button
//               type="primary"
//               onClick={handleUpload}
//               disabled={loading || !file}
//               loading={loading}
//             >
//               Upload
//             </Button>
//           </div>
//         </Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Insert
//         </Button>
//       </Form>

//       <div className="mt-6">
//         {Array.isArray(videos) &&
//           videos.map((video, index) => (
//             <div
//               key={video.id || index}
//               className="flex items-center justify-between p-4 bg-gray-50 mb-2 rounded shadow-sm"
//             >
//               <div>
//                 <p className="font-bold text-gray-800">{video.title}</p>
//                 <p className="text-gray-600">{video.description}</p>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   icon={<EyeOutlined />}
//                   onClick={() => {
//                     setCurrentVideoUrl(video.videoUrl);
//                     setIsVideoModalVisible(true);
//                   }}
//                 />
//                 <Button
//                   icon={<EditOutlined />}
//                   onClick={() => handleEdit(index)}
//                 />
//                 <Button
//                   icon={<DeleteOutlined />}
//                   danger
//                   onClick={() => handleDelete(index)}
//                 />
//               </div>
//             </div>
//           ))}
//       </div>

//       <div className="flex justify-between mt-6">
//         <Button onClick={onBack}>Back</Button>
//         <Button type="primary" onClick={handleDraft} loading={loading}>
//           Draft
//         </Button>
//       </div>

//       <Modal
//         visible={isVideoModalVisible}
//         footer={null}
//         onCancel={() => setIsVideoModalVisible(false)}
//         width={800}
//       >
//         <video
//           controls
//           src={currentVideoUrl}
//           className="w-full rounded-lg"
//           style={{ maxHeight: "450px" }}
//         >
//           Your browser does not support the video tag.
//         </video>
//       </Modal>
//     </div>
//   );
// };

// Step2Form.propTypes = {
//   labId: PropTypes.number.isRequired,
//   onBack: PropTypes.func.isRequired,
// };

// export default Step2Form;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, notification, Upload, Modal } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createLabVideoPlaylist,
  getLabPlaylist,
  submitLab,
  uploadLabVideo,
} from "./../redux/slices/labSlice";
import PropTypes from "prop-types";

const { TextArea } = Input;

const Step2Form = ({ labId, onBack }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.lab);
  const [videos, setVideos] = useState([]);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isDrafted, setIsDrafted] = useState(false); // Trạng thái đã draft
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang chỉnh sửa

  // Fetch initial playlist when component mounts
  useEffect(() => {
    if (labId) {
      dispatch(getLabPlaylist(labId))
        .unwrap()
        .then((response) => {
          console.log("Initial playlist response:", response);
          const videoList = Array.isArray(response?.data) ? response.data : [];
          setVideos(videoList);
        })
        .catch((err) => {
          console.error("Error fetching playlist:", err);
          notification.error({
            message: "Failed to fetch playlist",
            description: err?.message || "Unknown error",
          });
          setVideos([]);
        });
    } else {
      notification.error({ message: "labId is undefined" });
      setVideos([]);
    }
  }, [dispatch, labId]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) {
      notification.error({
        message: "An error occurred",
        description: error?.message || "Unknown error",
      });
    }
  }, [error]);

  // Tự động upload video khi chọn file và cập nhật URL vào Form
  useEffect(() => {
    if (file && (!isDrafted || isEditing)) { // Chỉ upload nếu chưa draft hoặc đang edit
      const uploadVideo = async () => {
        try {
          const result = await dispatch(uploadLabVideo(file)).unwrap();
          form.setFieldsValue({ videoUrl: result.id });
        } catch (err) {
          console.error("Auto-upload failed:", err);
          notification.error({
            message: "Failed to upload video",
            description: err?.message || "Unknown error",
          });
          setFile(null);
        }
      };
      uploadVideo();
    }
  }, [file, dispatch, form, isDrafted, isEditing]);

  // Xử lý khi chọn file video
  const handleFileChange = (info) => {
    if (!isDrafted || isEditing) { // Chỉ cho phép chọn file nếu chưa draft hoặc đang edit
      const selectedFile = info.fileList[0]?.originFileObj;
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  // Xử lý thêm video vào danh sách
  const handleInsert = (values) => {
    if (!isDrafted || isEditing) { // Chỉ cho phép insert nếu chưa draft hoặc đang edit
      const videoData = { ...values, labId };
      setVideos([videoData, ...videos]);
      form.resetFields();
      setFile(null);
    }
  };

  // Xử lý xóa video khỏi danh sách
  const handleDelete = (index) => {
    if (!isDrafted || isEditing) { // Chỉ cho phép xóa nếu chưa draft hoặc đang edit
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  // Xử lý chỉnh sửa video
  const handleEditVideo = (index) => {
    if (!isDrafted || isEditing) { // Chỉ cho phép chỉnh sửa nếu chưa draft hoặc đang edit
      form.setFieldsValue(videos[index]);
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  // Xử lý bật chế độ chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true); // Mở khóa Form để chỉnh sửa
  };

  // Xử lý Draft hoặc Submit
  const handleDraftOrSubmit = () => {
    const playlistData = videos.map((video) => ({
      labId,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
    }));

    if (!isDrafted) {
      // Chưa draft -> thực hiện Draft
      console.log("Sending playlistData (draft):", playlistData);
      dispatch(createLabVideoPlaylist({ labId, playlist: playlistData }))
        .unwrap()
        .then((response) => {
          console.log("Create draft response:", response);
          if (response?.isSuccess && response?.statusCode === 200) {
            notification.success({ message: "Draft Saved Successfully!" });
            setIsDrafted(true); // Đánh dấu đã draft và khóa Form
            return dispatch(getLabPlaylist(labId)).unwrap();
          } else {
            throw new Error(response?.message || "Failed to save draft");
          }
        })
        .then((updatedResponse) => {
          const videoList = Array.isArray(updatedResponse?.data)
            ? updatedResponse.data
            : [];
          setVideos(videoList); // Đồng bộ lại videos với server
        })
        .catch((err) => {
          console.error("Error saving draft:", err);
          notification.error({
            message: "Failed to save draft",
            description: err?.message || "Unknown error",
          });
        });
    } else {
      // Đã draft -> thực hiện Submit
      console.log("Sending playlistData (submit):", playlistData);
      dispatch(submitLab(labId))
        .unwrap()
        .then((response) => {
          console.log("Submit response:", response);
          if (response?.isSuccess && response?.statusCode === 200) {
            notification.success({
              message: "Lab Submitted Successfully!",
              description: "Redirecting to welcome page in 5 seconds...",
            });
            setTimeout(() => {
              window.location.href = "/trainer/welcome";
            }, 5000);
          } else {
            throw new Error(response?.message || "Failed to submit lab");
          }
        })
        .catch((err) => {
          console.error("Error in submit process:", err);
          notification.error({
            message: "Failed to submit lab",
            description: err?.message || "Unknown error",
          });
        });
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleInsert}
        initialValues={{ title: "", description: "", videoUrl: "" }}
      >
        <Form.Item
          name="title"
          label="Video Title"
          rules={[{ required: true, message: "Please enter video title" }]}
        >
          <Input
            placeholder="Enter video title"
            disabled={isDrafted && !isEditing}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter video description"
            disabled={isDrafted && !isEditing}
          />
        </Form.Item>
        <Form.Item
          name="videoUrl"
          label="Video URL"
          rules={[{ required: true, message: "Please select and upload a video" }]}
        >
          <div className="flex items-center gap-4">
            <Input
              placeholder="Video URL will appear here after upload"
              value={form.getFieldValue("videoUrl")}
              disabled
            />
            <Upload
              accept="video/*"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={file ? [{ uid: "-1", name: file.name, status: loading ? "uploading" : "done" }] : []}
              showUploadList={true}
              disabled={loading || (isDrafted && !isEditing)}
            >
              <Button
                icon={<UploadOutlined />}
                loading={loading}
                disabled={isDrafted && !isEditing}
              >
                Select Video
              </Button>
            </Upload>
          </div>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading || (isDrafted && !isEditing)}
        >
          Insert
        </Button>
      </Form>

      <div className="mt-6">
        {Array.isArray(videos) &&
          videos.map((video, index) => (
            <div
              key={video.id || index}
              className="flex items-center justify-between p-4 bg-gray-50 mb-2 rounded shadow-sm"
            >
              <div>
                <p className="font-bold text-gray-800">{video.title}</p>
                <p className="text-gray-600">{video.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setCurrentVideoUrl(video.videoUrl);
                    setIsVideoModalVisible(true);
                  }}
                />
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditVideo(index)}
                  disabled={isDrafted && !isEditing}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(index)}
                  disabled={isDrafted && !isEditing}
                />
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} disabled={isDrafted && !isEditing}>
          Back
        </Button>
        <Button
          type="primary"
          onClick={handleDraftOrSubmit}
          loading={loading}
        >
          {isDrafted ? "Submit" : "Draft"}
        </Button>
        {isDrafted && (
          <Button type="default" onClick={handleEdit} disabled={isEditing}>
            Edit
          </Button>
        )}
      </div>

      <Modal
        visible={isVideoModalVisible}
        footer={null}
        onCancel={() => setIsVideoModalVisible(false)}
        width={800}
      >
        <video
          controls
          src={currentVideoUrl}
          className="w-full rounded-lg"
          style={{ maxHeight: "450px" }}
        >
          Your browser does not support the video tag.
        </video>
      </Modal>
    </div>
  );
};

Step2Form.propTypes = {
  labId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Step2Form;


// src/components/Step2Form.jsx
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Form, Input, Button, Modal, notification } from 'antd';
// import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
// import { createLabVideoPlaylist, getLabPlaylist, submitLab } from './../../../redux/slices/labSlice';

// const { TextArea } = Input;

// const Step2Form = ({ labId, onBack }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { playlist, loading, error } = useSelector((state) => state.lab);
//   const [videos, setVideos] = useState([]);
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState('');

//   // Fetch initial playlist when component mounts
//   useEffect(() => {
//     if (labId) {
//       dispatch(getLabPlaylist(labId)).unwrap()
//         .then((data) => {
//           setVideos(data || []);
//         })
//         .catch((err) => {
//           notification.error({ message: 'Failed to fetch playlist', description: err?.message || 'Unknown error' });
//         });
//     }
//   }, [dispatch, labId]);

//   const handleInsert = (values) => {
//     const videoData = { ...values, labId };
//     setVideos([videoData, ...videos]);
//     form.resetFields();
//   };

//   const handleDelete = (index) => {
//     setVideos(videos.filter((_, i) => i !== index));
//   };

//   const handleEdit = (index) => {
//     form.setFieldsValue(videos[index]);
//     setVideos(videos.filter((_, i) => i !== index));
//   };

//   const handleDraft = () => {
//     Modal.confirm({
//       title: 'Save as Draft',
//       content: 'Do you want to submit this lab to Store for collaboration?',
//       onOk: () => {
//         const playlistData = videos.map(video => ({
//           labId,
//           title: video.title,
//           description: video.description,
//           videoUrl: video.videoUrl,
//         }));
//         dispatch(createLabVideoPlaylist({ labId, playlist: playlistData })).unwrap()
//           .then(() => {
//             return dispatch(submitLab(labId)).unwrap();
//           })
//           .then(() => {
//             notification.success({
//               message: 'Lab Submitted Successfully!',
//               description: 'Redirecting to welcome page in 5 seconds...',
//             });
//             setTimeout(() => {
//               window.location.href = '/trainer/welcome';
//             }, 5000);
//           })
//           .catch((err) => {
//             notification.error({ message: 'Failed to submit lab', description: err?.message || 'Unknown error' });
//           });
//       },
//       onCancel: () => {
//         const playlistData = videos.map(video => ({
//           labId,
//           title: video.title,
//           description: video.description,
//           videoUrl: video.videoUrl,
//         }));
//         dispatch(createLabVideoPlaylist({ labId, playlist: playlistData })).unwrap()
//           .then(() => {
//             notification.success({ message: 'Draft Saved Successfully!' });
//           })
//           .catch((err) => {
//             notification.error({ message: 'Failed to save draft', description: err?.message || 'Unknown error' });
//           });
//       },
//     });
//   };

//   return (
//     <div>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleInsert}
//         initialValues={{ title: '', description: '', videoUrl: '' }}
//       >
//         <Form.Item name="title" label="Video Title" rules={[{ required: true }]}>
//           <Input placeholder="Enter video title" />
//         </Form.Item>
//         <Form.Item name="description" label="Description" rules={[{ required: true }]}>
//           <TextArea rows={4} placeholder="Enter video description" />
//         </Form.Item>
//         <Form.Item name="videoUrl" label="Video URL" rules={[{ required: true }]}>
//           <Input placeholder="Enter YouTube embed URL" />
//         </Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Insert
//         </Button>
//       </Form>
//       <div className="mt-6">
//         {videos.map((video, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between p-4 bg-bgColer mb-2 rounded shadow-sm"
//           >
//             <div>
//               <p className="font-bold text-textColer">{video.title}</p>
//               <p className="text-muted-foreground">{video.description}</p>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 icon={<EyeOutlined />}
//                 onClick={() => {
//                   setCurrentVideoUrl(video.videoUrl);
//                   setIsVideoModalVisible(true);
//                 }}
//               />
//               <Button icon={<EditOutlined />} onClick={() => handleEdit(index)} />
//               <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(index)} />
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-between mt-6">
//         <Button onClick={onBack}>Back</Button>
//         <Button type="primary" onClick={handleDraft} loading={loading}>
//           Draft
//         </Button>
//       </div>
//       <Modal
//         visible={isVideoModalVisible}
//         footer={null}
//         onCancel={() => setIsVideoModalVisible(false)}
//         width={800}
//       >
//         <iframe
//           width="100%"
//           height="450"
//           src={currentVideoUrl}
//           title="YouTube video player"
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         ></iframe>
//       </Modal>
//     </div>
//   );
// };

// export default Step2Form;



// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadLabVideo } from "./../redux/slices/labSlice";
// import { Button, Upload, Spin, Typography } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { Title, Paragraph } = Typography;

// const LabVideoUpload = () => {
//   const dispatch = useDispatch();
//   const { videoUrl, videoFileName, loading, error } = useSelector((state) => state.lab);
//   const [file, setFile] = useState(null);

//   // Xử lý khi chọn file
//   const handleFileChange = (info) => {
//     const selectedFile = info.fileList[0]?.originFileObj;
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   // Xử lý upload
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a video file first!");
//       return;
//     }
//     try {
//       const result = await dispatch(uploadLabVideo(file)).unwrap();
//       // Sau khi upload thành công, result chứa dữ liệu từ API
//       console.log("Uploaded Video URL:", result.id); // Log URL từ response trực tiếp
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   // Reset file sau khi upload thành công (tùy chọn)
//   useEffect(() => {
//     if (videoUrl) {
//       setFile(null); // Reset file để người dùng có thể chọn video mới
//     }
//   }, [videoUrl]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <Title level={2} className="text-center text-blue-600 mb-6">
//           Upload Lab Video
//         </Title>

//         <Upload
//           accept="video/*"
//           beforeUpload={() => false} // Ngăn upload tự động
//           onChange={handleFileChange}
//           fileList={file ? [{ uid: "-1", name: file.name }] : []}
//           className="w-full"
//         >
//           <Button icon={<UploadOutlined />} className="w-full">
//             Select Video
//           </Button>
//         </Upload>

//         <Button
//           type="primary"
//           onClick={handleUpload}
//           disabled={loading || !file}
//           loading={loading}
//           className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
//         >
//           {loading ? <Spin /> : "Upload"}
//         </Button>

//         {videoUrl && (
//           <div className="mt-6">
//             <Paragraph className="text-gray-700">
//               <strong>Uploaded Video URL:</strong>{" "}
//               <a
//                 href={videoUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline"
//               >
//                 {videoUrl}
//               </a>
//             </Paragraph>
//             <Paragraph className="text-gray-700">
//               <strong>File Name:</strong> {videoFileName}
//             </Paragraph>
//             {/* Thêm preview video trực tiếp */}
//             <video
//               controls
//               src={videoUrl}
//               className="mt-4 w-full rounded-lg shadow-md"
//               style={{ maxHeight: "300px" }}
//             >
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}

//         {error && (
//           <Paragraph className="mt-4 text-red-500">
//             <strong>Error:</strong> {error}
//           </Paragraph>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LabVideoUpload;