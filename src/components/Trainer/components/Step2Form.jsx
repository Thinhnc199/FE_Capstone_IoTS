// import { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Form,
//   Input,
//   Button,
//   notification,
//   Upload,
//   Modal,
//   Progress,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   EyeOutlined,
//   UploadOutlined,
//   PlusOutlined,
//   MenuOutlined,
//   LeftCircleOutlined,
// } from "@ant-design/icons";
// import {
//   createLabVideoPlaylist,
//   getLabPlaylist,
//   submitLab,
//   uploadLabVideo,
// } from "./../../../redux/slices/labSlice";
// import PropTypes from "prop-types";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { useNavigate } from "react-router-dom";
// // CSS inline
// const dragDropStyles = `
//   .draggable-item {
//     user-select: none;
//     cursor: move;
//     transition: all 0.2s ease;
//     border: 1px solid #e8e8e8;
//     border-radius: 4px;
//     background-color: white;
//     display: flex;
//     align-items: center;
//     padding: 12px;
//     margin-bottom: 8px;
//   }
//   .draggable-item:hover {
//     background-color: #f5f5f5;
//     border-color: #d9d9d9;
//   }
//   .dragging {
//     opacity: 0.85;
//     border: 2px dashed #1890ff;
//     background-color: #e6f7ff;
//   }
//   .droppable-area {
//     padding: 8px;
//     border-radius: 8px;
//     transition: background-color 0.2s ease;
//   }
//   .drag-handle {
//     margin-right: 12px;
//     color: #888;
//     cursor: move;
//   }
//   .drag-handle:hover {
//     color: #1890ff;
//   }
// `;

// const { TextArea } = Input;

// const Step2Form = ({ labId, onBack }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.lab);
//   const [videos, setVideos] = useState([]);
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState("");
//   const [file, setFile] = useState(null);
//   const [isDrafted, setIsDrafted] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isInsertModalVisible, setIsInsertModalVisible] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();
//   const fetchPlaylist = useCallback(async () => {
//     try {
//       const response = await dispatch(getLabPlaylist(labId)).unwrap();
//       const videoList = Array.isArray(response?.data) ? response.data : [];
//       setVideos(videoList);
//       if (videoList.length > 0) {
//         setIsDrafted(true);
//       } else {
//         setIsDrafted(false);
//       }
//     } catch (err) {
//       notification.error({
//         message: "Failed to fetch playlist",
//         description: err?.message || "Unknown error",
//       });
//       setVideos([]);
//     }
//   }, [dispatch, labId]);

//   useEffect(() => {
//     if (labId) {
//       fetchPlaylist();
//     }
//   }, [labId, fetchPlaylist]);

//   useEffect(() => {
//     if (error) {
//       notification.error({
//         message: "An error occurred",
//         description: error?.message || "Unknown error",
//       });
//     }
//   }, [error]);

//   const validateVideo = (file) => {
//     const maxSize = 150 * 1024 * 1024;
//     if (file.size > maxSize) {
//       notification.error({ message: "Video size must not exceed 150MB" });
//       return false;
//     }
//     return new Promise((resolve) => {
//       const video = document.createElement("video");
//       video.preload = "metadata";
//       video.onloadedmetadata = () => {
//         const { videoWidth, videoHeight } = video;
//         if (videoHeight < 720 || videoWidth < 1280) {
//           notification.error({
//             message: "Video resolution must be at least 720p (1280x720)",
//           });
//           resolve(false);
//         } else {
//           resolve(true);
//         }
//         window.URL.revokeObjectURL(video.src);
//       };
//       video.onerror = () => {
//         notification.error({ message: "Invalid video file" });
//         resolve(false);
//       };
//       video.src = window.URL.createObjectURL(file);
//     });
//   };

//   const handleFileChange = async ({ fileList }) => {
//     const selectedFile = fileList[0]?.originFileObj;
//     if (selectedFile) {
//       const isValid = await validateVideo(selectedFile);
//       if (isValid) {
//         setFile(selectedFile);
//       } else {
//         setFile(null);
//         form.setFieldsValue({ videoUrl: form.getFieldValue("videoUrl") });
//       }
//     } else {
//       setFile(null);
//     }
//   };

//   const handleInsert = (values) => {
//     if (!file && !values.videoUrl) {
//       notification.error({
//         message: "Please select a video file or keep the existing video URL",
//       });
//       return;
//     }

//     const videoData = {
//       ...values,
//       labId,
//       videoFile: file,
//       videoUrl: file ? undefined : values.videoUrl,
//     };
//     setVideos([videoData, ...videos]);
//     form.resetFields();
//     setFile(null);
//     setIsInsertModalVisible(false);
//   };

//   const handleDelete = (index) => {
//     if (!isDrafted || isEditing) {
//       setVideos(videos.filter((_, i) => i !== index));
//     }
//   };

//   const handleEditVideo = (index) => {
//     if (!isDrafted || isEditing) {
//       const video = videos[index];
//       form.setFieldsValue({
//         title: video.title,
//         description: video.description,
//         videoUrl: video.videoUrl || "", // Đặt videoUrl là chuỗi
//       });
//       setFile(video.videoFile || null);
//       setVideos(videos.filter((_, i) => i !== index));
//       setIsInsertModalVisible(true);
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       setVideos((items) => {
//         const oldIndex = items.findIndex(
//           (_, index) => `video-${index}` === active.id
//         );
//         const newIndex = items.findIndex(
//           (_, index) => `video-${index}` === over.id
//         );
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const handleDraftOrSubmit = async () => {
//     const playlistData = [];
//     setUploadProgress(0);

//     if (!isDrafted || isEditing) {
//       for (let i = 0; i < videos.length; i++) {
//         const video = videos[i];
//         if (video.videoFile) {
//           try {
//             const result = await dispatch(
//               uploadLabVideo(video.videoFile)
//             ).unwrap();
//             playlistData.push({
//               labId,
//               title: video.title,
//               description: video.description,
//               videoUrl: result.id,
//             });
//             setUploadProgress(((i + 1) / videos.length) * 100);
//           } catch (error) {
//             notification.error({
//               message: "Failed to upload video",
//               description: error || "Unknown error",
//             });
//             return;
//           }
//         } else {
//           playlistData.push({
//             labId,
//             title: video.title,
//             description: video.description,
//             videoUrl: video.videoUrl,
//           });
//         }
//       }

//       try {
//         const response = await dispatch(
//           createLabVideoPlaylist({ labId, playlist: playlistData })
//         ).unwrap();
//         if (response?.isSuccess && response?.statusCode === 200) {
//           notification.success({ message: "Draft Saved Successfully!" });
//           setIsDrafted(true);
//           setIsEditing(false);
//           await fetchPlaylist();
//           setUploadProgress(0);
//         }
//       } catch (err) {
//         notification.error({
//           message: "Failed to save draft",
//           description: err?.message || "Unknown error",
//         });
//         setUploadProgress(0);
//       }
//     } else {
//       try {
//         const response = await dispatch(submitLab(labId)).unwrap();
//         if (response?.isSuccess && response?.statusCode === 200) {
//           notification.success({
//             message: "Lab Submitted Successfully!",
//           });
//           setTimeout(() => {
//             navigate("/trainer/labs-management");
//           }, 1000);
//         }
//       } catch (error) {
//         notification.error({
//           message: "Failed to submit lab",
//           description: error || "Unknown error",
//         });
//       }
//     }
//   };

//   const handleEdit = async () => {
//     await fetchPlaylist();
//     setIsEditing(true);
//   };

//   const SortableItem = ({ video, index }) => {
//     const {
//       attributes,
//       listeners,
//       setNodeRef,
//       transform,
//       transition,
//       isDragging,
//     } = useSortable({
//       id: `video-${index}`,
//     });

//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//       opacity: isDragging ? 0.85 : 1,
//       border: isDragging ? "2px dashed #1890ff" : "1px solid #e8e8e8",
//       backgroundColor: isDragging ? "#e6f7ff" : "white",
//     };

//     return (
//       <div ref={setNodeRef} style={style} className="draggable-item">
//         <div {...listeners} {...attributes} className="drag-handle">
//           <MenuOutlined />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-bold text-gray-800 truncate">
//             {video.title || "Untitled Video"}
//           </p>
//           <p className="text-gray-600 truncate">
//             {video.description || "No description"}
//           </p>
//         </div>
//         <div className="flex gap-2 ml-4">
//           <Button
//             icon={<EyeOutlined />}
//             onClick={() => {
//               setCurrentVideoUrl(video.videoUrl || "");
//               setIsVideoModalVisible(true);
//             }}
//             disabled={!video.videoUrl}
//           />
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEditVideo(index)}
//             disabled={isDrafted && !isEditing}
//           />
//           <Button
//             icon={<DeleteOutlined />}
//             danger
//             onClick={() => handleDelete(index)}
//             disabled={isDrafted && !isEditing}
//           />
//         </div>
//       </div>
//     );
//   };

//   SortableItem.propTypes = {
//     video: PropTypes.shape({
//       title: PropTypes.string,
//       description: PropTypes.string,
//       videoUrl: PropTypes.string,
//     }).isRequired,
//     index: PropTypes.number.isRequired,
//   };

//   return (
//     <div>
//       <style>{dragDropStyles}</style>

//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => setIsInsertModalVisible(true)}
//         disabled={isDrafted && !isEditing}
//       >
//         Add Video
//       </Button>

//       <Modal
//         title="Add New Video"
//         open={isInsertModalVisible}
//         onCancel={() => setIsInsertModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleInsert}
//           initialValues={{ title: "", description: "", videoUrl: "" }}
//         >
//           <Form.Item
//             name="title"
//             label="Video Title"
//             rules={[{ required: true, message: "Please enter video title" }]}
//           >
//             <Input placeholder="Enter video title" />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Please enter description" }]}
//           >
//             <TextArea rows={4} placeholder="Enter video description" />
//           </Form.Item>
//           {/* <Form.Item name="videoUrl" label="Current Video URL (if any)">
//             <Input readOnly placeholder="No video URL available" />
//           </Form.Item> */}
//           <Form.Item name="newVideo" label="Upload New Video">
//             <Upload
//               accept="video/*"
//               beforeUpload={() => false}
//               onChange={handleFileChange}
//               fileList={
//                 file ? [{ uid: "-1", name: file.name, status: "done" }] : []
//               }
//             >
//               <Button icon={<UploadOutlined />}>Select Video</Button>
//             </Upload>
//           </Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Insert
//           </Button>
//         </Form>
//       </Modal>

//       <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext
//           items={videos.map((_, index) => `video-${index}`)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className="mt-6 droppable-area">
//             {videos.length > 0 ? (
//               videos.map((video, index) => (
//                 <SortableItem
//                   key={`video-${index}`}
//                   video={video}
//                   index={index}
//                 />
//               ))
//             ) : (
//               <p className="text-gray-500 text-center py-4">
//                 No videos in the playlist yet. Add one to get started!
//               </p>
//             )}
//           </div>
//         </SortableContext>
//       </DndContext>

//       {uploadProgress > 0 && (
//         <div className="mt-4">
//           <Progress percent={uploadProgress} status="active" />
//         </div>
//       )}

//       {/* <div className="flex justify-between mt-6">
//         <Button onClick={onBack} disabled={isDrafted && !isEditing}>
//         <LeftCircleOutlined />
//         </Button>
//         <Button type="primary" onClick={handleDraftOrSubmit} loading={loading}>
//           {isDrafted && !isEditing ? "Submit" : "Draft"}
//         </Button>
//         {isDrafted && !isEditing && (
//           <Button type="default" onClick={handleEdit} disabled={isEditing}>
//             Edit
//           </Button>
//         )}

//       </div> */}
//       <div className="flex justify-between mt-6">
//         {!isDrafted || isEditing ? (
//           <>
//             <Button onClick={onBack} disabled={isDrafted && !isEditing}>
//               <LeftCircleOutlined />
//             </Button>
//             <Button
//               type="primary"
//               onClick={handleDraftOrSubmit}
//               loading={loading}
//             >
//               Draft
//             </Button>
//           </>
//         ) : (
//           <>
//             {isDrafted && !isEditing && (
//               <Button type="default" onClick={handleEdit} disabled={isEditing}>
//                 <EditOutlined />
//               </Button>
//             )}
//             <Button
//               type="primary"
//               onClick={handleDraftOrSubmit}
//               loading={loading}
//             >
//               Submit
//             </Button>
//           </>
//         )}
//       </div>

//       <Modal
//         open={isVideoModalVisible}
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

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  notification,
  Upload,
  Modal,
  Progress,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  PlusOutlined,
  MenuOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import {
  createLabVideoPlaylist,
  getLabPlaylist,
  submitLab,
  uploadLabVideo,
} from "./../../../redux/slices/labSlice";
import PropTypes from "prop-types";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";

// CSS inline
const dragDropStyles = `
  .draggable-item {
    user-select: none;
    cursor: move;
    transition: all 0.2s ease;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
  }
  .draggable-item:hover {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
  }
  .dragging {
    opacity: 0.85;
    border: 2px dashed #1890ff;
    background-color: #e6f7ff;
  }
  .droppable-area {
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  .drag-handle {
    margin-right: 12px;
    color: #888;
    cursor: move;
  }
  .drag-handle:hover {
    color: #1890ff;
  }
`;

const { TextArea } = Input;

const Step2Form = ({ labId, onBack }) => {
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.lab);
  const [videos, setVideos] = useState([]);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isDrafted, setIsDrafted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInsertModalVisible, setIsInsertModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const fetchPlaylist = useCallback(async () => {
    try {
      const response = await dispatch(getLabPlaylist(labId)).unwrap();
      const videoList = Array.isArray(response?.data) ? response.data : [];
      setVideos(videoList);
      if (videoList.length > 0) {
        setIsDrafted(true);
      } else {
        setIsDrafted(false);
      }
    } catch (err) {
      notification.error({
        message: "Failed to fetch playlist",
        description: err?.message || "Unknown error",
      });
      setVideos([]);
    }
  }, [dispatch, labId]);

  useEffect(() => {
    if (labId) {
      fetchPlaylist();
    }
  }, [labId, fetchPlaylist]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "An error occurred",
        description: error?.message || "Unknown error",
      });
    }
  }, [error]);

  const handleFileChange = ({ fileList }) => {
    const selectedFile = fileList[0]?.originFileObj;
    setFile(selectedFile || null);
  };

  const handleInsert = (values) => {
    if (!file && !values.videoUrl) {
      notification.error({
        message: "Please select a video file or keep the existing video URL",
      });
      return;
    }

    const videoData = {
      ...values,
      labId,
      videoFile: file,
      videoUrl: file ? undefined : values.videoUrl,
    };
    setVideos([videoData, ...videos]);
    form.resetFields();
    setFile(null);
    setIsInsertModalVisible(false);
  };

  const handleDelete = (index) => {
    if (!isDrafted || isEditing) {
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  const handleEditVideo = (index) => {
    if (!isDrafted || isEditing) {
      const video = videos[index];
      updateForm.setFieldsValue({
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl || "",
      });
      setSelectedVideoIndex(index);
      setFile(null);
      setIsUpdateModalVisible(true);
    }
  };

  const handleUpdate = async (values) => {
    if (!file && !values.videoUrl) {
      notification.error({
        message: "Please select a video file or keep the existing video URL",
      });
      return;
    }

    let updatedVideoUrl = values.videoUrl;
    if (file) {
      try {
        const result = await dispatch(uploadLabVideo(file)).unwrap();
        updatedVideoUrl = result.id;
      } catch (error) {
        notification.error({
          message: "Failed to upload video",
          description: error || "Unknown error",
        });
        return;
      }
    }

    const updatedVideo = {
      id: videos[selectedVideoIndex].id,
      labId,
      title: values.title,
      description: values.description,
      videoUrl: updatedVideoUrl,
      orderIndex: videos[selectedVideoIndex].orderIndex,
    };

    const updatedVideos = videos.map((video, index) =>
      index === selectedVideoIndex ? updatedVideo : video
    );

    try {
      const response = await dispatch(
        createLabVideoPlaylist({ labId, playlist: updatedVideos })
      ).unwrap();
      if (response?.isSuccess && response?.statusCode === 200) {
        notification.success({ message: "Video Updated Successfully!" });
        setVideos(updatedVideos);
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        setFile(null);
        setSelectedVideoIndex(null);
        await fetchPlaylist();
      }
    } catch (err) {
      notification.error({
        message: "Failed to update video",
        description: err?.message || "Unknown error",
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex(
          (_, index) => `video-${index}` === active.id
        );
        const newIndex = items.findIndex(
          (_, index) => `video-${index}` === over.id
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDraftOrSubmit = async () => {
    const playlistData = [];
    setUploadProgress(0);

    if (!isDrafted || isEditing) {
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if (video.videoFile) {
          try {
            const result = await dispatch(
              uploadLabVideo(video.videoFile)
            ).unwrap();
            playlistData.push({
              labId,
              title: video.title,
              description: video.description,
              videoUrl: result.id,
            });
            setUploadProgress(((i + 1) / videos.length) * 100);
          } catch (error) {
            notification.error({
              message: "Failed to upload video",
              description: error || "Unknown error",
            });
            return;
          }
        } else {
          playlistData.push({
            labId,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
          });
        }
      }

      try {
        const response = await dispatch(
          createLabVideoPlaylist({ labId, playlist: playlistData })
        ).unwrap();
        if (response?.isSuccess && response?.statusCode === 200) {
          notification.success({ message: "Draft Saved Successfully!" });
          setIsDrafted(true);
          setIsEditing(false);
          await fetchPlaylist();
          setUploadProgress(0);
        }
      } catch (err) {
        notification.error({
          message: "Failed to save draft",
          description: err?.message || "Unknown error",
        });
        setUploadProgress(0);
      }
    } else {
      try {
        const response = await dispatch(submitLab(labId)).unwrap();
        if (response?.isSuccess && response?.statusCode === 200) {
          notification.success({
            message: "Lab Submitted Successfully!",
          });
          setTimeout(() => {
            navigate("/trainer/labs-management");
          }, 1000);
        }
      } catch (error) {
        notification.error({
          message: "Failed to submit lab",
          description: error || "Unknown error",
        });
      }
    }
  };

  const handleEdit = async () => {
    await fetchPlaylist();
    setIsEditing(true);
  };

  const SortableItem = ({ video, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: `video-${index}`,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.85 : 1,
      border: isDragging ? "2px dashed #1890ff" : "1px solid #e8e8e8",
      backgroundColor: isDragging ? "#e6f7ff" : "white",
    };

    return (
      <div ref={setNodeRef} style={style} className="draggable-item">
        <div {...listeners} {...attributes} className="drag-handle">
          <MenuOutlined />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 truncate">
            {video.title || "Untitled Video"}
          </p>
          <p className="text-gray-600 truncate">
            {video.description || "No description"}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentVideoUrl(video.videoUrl || "");
              setIsVideoModalVisible(true);
            }}
            disabled={!video.videoUrl}
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
    );
  };

  SortableItem.propTypes = {
    video: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      videoUrl: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
  };

  return (
    <div>
      <style>{dragDropStyles}</style>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsInsertModalVisible(true)}
        disabled={isDrafted && !isEditing}
      >
        Add Video
      </Button>

      {/* Modal thêm video */}
      <Modal
        title="Add New Video"
        open={isInsertModalVisible}
        onCancel={() => setIsInsertModalVisible(false)}
        footer={null}
      >
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
            <Input placeholder="Enter video title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter video description" />
          </Form.Item>
          <Form.Item name="newVideo" label="Upload New Video">
            <Upload
              accept="video/*"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={
                file ? [{ uid: "-1", name: file.name, status: "done" }] : []
              }
            >
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Insert
          </Button>
        </Form>
      </Modal>

      {/* Modal cập nhật video */}
      <Modal
        title="Update Video"
        open={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          updateForm.resetFields();
          setFile(null);
          setSelectedVideoIndex(null);
        }}
        footer={null}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{ title: "", description: "", videoUrl: "" }}
        >
          <Form.Item
            name="title"
            label="Video Title"
            rules={[{ required: true, message: "Please enter video title" }]}
          >
            <Input placeholder="Enter video title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter video description" />
          </Form.Item>
          <Form.Item name="videoUrl" label="Current Video URL">
            <Input
              readOnly
              placeholder="No video URL available"
              addonAfter={
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setCurrentVideoUrl(updateForm.getFieldValue("videoUrl"));
                    setIsVideoModalVisible(true);
                  }}
                  disabled={!updateForm.getFieldValue("videoUrl")}
                />
              }
            />
          </Form.Item>
          <Form.Item name="newVideo" label="Upload New Video (Optional)">
            <Upload
              accept="video/*"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={
                file ? [{ uid: "-1", name: file.name, status: "done" }] : []
              }
            >
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form>
      </Modal>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={videos.map((_, index) => `video-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-6 droppable-area">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <SortableItem
                  key={`video-${index}`}
                  video={video}
                  index={index}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No videos in the playlist yet. Add one to get started!
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {uploadProgress > 0 && (
        <div className="mt-4">
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}

      <div className="flex justify-between mt-6">
        {!isDrafted || isEditing ? (
          <>
            <Button onClick={onBack} disabled={isDrafted && !isEditing}>
              <LeftCircleOutlined />
            </Button>
            <Button
              type="primary"
              onClick={handleDraftOrSubmit}
              loading={loading}
            >
              Draft
            </Button>
          </>
        ) : (
          <>
            {isDrafted && !isEditing && (
              <Button onClick={onBack}>
                <LeftCircleOutlined />
              </Button>
            )}
            <Button
              type="primary"
              onClick={handleDraftOrSubmit}
              loading={loading}
            >
              Submit request to Store
            </Button>
            <Button type="default" onClick={handleEdit} disabled={isEditing}>
              <EditOutlined />
            </Button>
          </>
        )}
      </div>

      <Modal
        open={isVideoModalVisible}
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
