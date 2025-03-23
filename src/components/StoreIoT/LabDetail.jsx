// import { useState, useEffect, useCallback } from "react";
// import React from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getLabInformation,
//   getLabPlaylist,
//   approveLab,
//   rejectLab,
//   clearError,
// } from "../../redux/slices/labSlice";
// import {
//   Button,
//   Spin,
//   notification,
//   Modal,
//   Input,
//   Card,
//   Row,
//   Col,
//   Typography,
//   Skeleton,
//   List,
//   Image,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   PlayCircleOutlined,
// } from "@ant-design/icons";
// import PropTypes from "prop-types";
// import debounce from "lodash/debounce";

// const { TextArea } = Input;
// const { Title, Text } = Typography;

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <h1 className="text-center text-red-500">Something went wrong.</h1>
//       );
//     }
//     return this.props.children;
//   }
// }

// ErrorBoundary.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// const LabDetail = React.memo(() => {
//   const { labId } = useParams();
//   const dispatch = useDispatch();
//   const { labInfo, playlist, loading, error } = useSelector(
//     (state) => state.lab
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [remark, setRemark] = useState("");
//   const [sortedVideoList, setSortedVideoList] = useState([]);

//   useEffect(() => {
//     const fetchLabData = async () => {
//       try {
//         await Promise.all([
//           dispatch(getLabInformation(labId)).unwrap(),
//           dispatch(getLabPlaylist(labId)).unwrap(),
//         ]);
//       } catch (err) {
//         console.error("Error fetching lab data:", err);
//       }
//     };
//     fetchLabData();
//   }, [dispatch, labId]);

//   useEffect(() => {
//     if (error) {
//       notification.error({
//         message: "Error",
//         description: error.message || "An error occurred",
//       });
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   useEffect(() => {
//     const list = Array.isArray(playlist?.data)
//       ? [...playlist.data].sort((a, b) => a.orderIndex - b.orderIndex)
//       : [];
//     setSortedVideoList(list);
//   }, [playlist]);

// //   const handleApprove = async () => {
// //     try {
// //       await dispatch(approveLab(labId)).unwrap();
// //       notification.success({
// //         message: "Success",
// //         description: "Lab has been approved successfully!",
// //       });
// //       await dispatch(getLabInformation(labId)).unwrap();
// //     } catch (err) {
// //       console.error("Error approving lab:", err);
// //     }
// //   };

// //   const handleReject = async () => {
// //     if (!remark.trim()) {
// //       notification.error({
// //         message: "Error",
// //         description: "Please provide a reason for rejection.",
// //       });
// //       return;
// //     }
// //     try {
// //       await dispatch(rejectLab({ labId, remark })).unwrap();
// //       notification.success({
// //         message: "Success",
// //         description: "Lab has been rejected successfully!",
// //       });
// //       setIsModalOpen(false);
// //       setRemark("");
// //       await dispatch(getLabInformation(labId)).unwrap();
// //     } catch (err) {
// //       console.error("Error rejecting lab:", err);
// //     }
// //   };
// const handleApprove = async () => {
//     try {
//       await dispatch(approveLab(labId)).unwrap();
//       notification.success({
//         message: "Success",
//         description: "Lab has been approved successfully!",
//       });
//       await dispatch(getLabInformation(labId)).unwrap(); // Refresh lab info
//     } catch (err) {
//       console.error("Error approving lab:", err);
//       notification.error({
//         message: "Error",
//         description: err.message || "Failed to approve lab",
//       });
//     }
//   };

//   const handleReject = async () => {
//     if (!remark.trim()) {
//       notification.error({
//         message: "Error",
//         description: "Please provide a reason for rejection.",
//       });
//       return;
//     }
//     try {
//       await dispatch(rejectLab({ labId, remark })).unwrap();
//       notification.success({
//         message: "Success",
//         description: "Lab has been rejected successfully!",
//       });
//       setIsModalOpen(false);
//       setRemark("");
//       await dispatch(getLabInformation(labId)).unwrap(); // Refresh lab info
//     } catch (err) {
//       console.error("Error rejecting lab:", err);
//       notification.error({
//         message: "Error",
//         description: err.message || "Failed to reject lab",
//       });
//     }
//   };
//   const showRejectModal = () => setIsModalOpen(true);
//   const handleModalCancel = () => {
//     setIsModalOpen(false);
//     setRemark("");
//   };

//   const debouncedSetRemark = useCallback(
//     debounce((value) => setRemark(value), 50),
//     []
//   );

//   const getStatusText = (status) => {
//     switch (status) {
//       case 0:
//         return "Draft";
//       case 1:
//         return "Approved";
//       case 2:
//         return "Pending";
//       case 3:
//         return "Rejected";
//       default:
//         return "Unknown";
//     }
//   };

//   return (
//     <ErrorBoundary>
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <Title
//           level={2}
//           className="text-center mb-6 text-headerBg font-Mainfont"
//         >
//           Lab Detail
//         </Title>

//         {labInfo?.status === 2 && (
//           <div className="flex justify-center mb-8 space-x-4">
//             <Button
//               type="primary"
//               size="large"
//               icon={<CheckCircleOutlined />}
//               onClick={handleApprove}
//               loading={loading}
//               className="bg-headerBg text-white rounded-md hover:bg-opacity-90 transition-all"
//             >
//               Approve
//             </Button>
//             <Button
//               size="large"
//               icon={<CloseCircleOutlined />}
//               onClick={showRejectModal}
//               loading={loading}
//               className="bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
//             >
//               Reject
//             </Button>
//           </div>
//         )}

//         <Spin spinning={loading} tip="Loading lab details...">
//           {labInfo ? (
//             <Row gutter={[24, 24]}>
//               {/* Lab Information */}
//               <Col xs={24} md={12}>
//                 <Card
//                   title={<Title level={4}>Lab Information</Title>}
//                   bordered={false}
//                   className="shadow-md rounded-lg"
//                   style={{ backgroundColor: "#fff" }}
//                 >
//                   <div className="space-y-4">
//                     <Text strong>ID: </Text>
//                     <Text>{labInfo.id}</Text>
//                     <br />
//                     <Text strong>Title: </Text>
//                     <Text>{labInfo.title}</Text>
//                     <br />
//                     <Text strong>Summary: </Text>
//                     <Text>{labInfo.summary}</Text>
//                     <br />
//                     <Text strong>Description: </Text>
//                     <Text>{labInfo.description}</Text>
//                     <br />
//                     <Text strong>Combo: </Text>
//                     <Text>
//                       {labInfo.comboNavigationName} (ID: {labInfo.comboId})
//                     </Text>
//                     <br />
//                     <Text strong>Price: </Text>
//                     <Text>${labInfo.price?.toLocaleString() || "N/A"}</Text>
//                     <br />
//                     <Text strong>Status: </Text>
//                     <Text>{getStatusText(labInfo.status)}</Text>
//                     <br />
//                     <Text strong>Created By: </Text>
//                     <Text>{labInfo.createdByNavigationEmail}</Text>
//                     <br />
//                     <Text strong>Created Date: </Text>
//                     <Text>
//                       {new Date(labInfo.createdDate).toLocaleString()}
//                     </Text>
//                     <br />
//                     <Text strong>Updated Date: </Text>
//                     <Text>
//                       {new Date(labInfo.updatedDate).toLocaleString()}
//                     </Text>
//                   </div>
//                   <div className="mt-6">
//                     <Image
//                       src={labInfo.imageUrl}
//                       alt="Lab Image"
//                       width={200}
//                       height={200}
//                       style={{ objectFit: "cover", borderRadius: "8px" }}
//                       onError={(e) =>
//                         (e.target.src = "https://via.placeholder.com/200")
//                       }
//                     />
//                   </div>
//                   {labInfo.previewVideoUrl && (
//                     <div className="mt-6">
//                       <video
//                         controls
//                         width="100%"
//                         style={{ maxWidth: "400px", borderRadius: "8px" }}
//                         loading="lazy"
//                       >
//                         <source
//                           src={labInfo.previewVideoUrl}
//                           type="video/mp4"
//                         />
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   )}
//                 </Card>
//               </Col>

//               {/* Video Playlist */}
//               <Col xs={24} md={12}>
//                 <Card
//                   title={<Title level={4}>Video Playlist</Title>}
//                   bordered={false}
//                   className="shadow-md rounded-lg"
//                   style={{ backgroundColor: "#fff" }}
//                 >
//                   {sortedVideoList.length > 0 ? (
//                     <List
//                       dataSource={sortedVideoList}
//                       renderItem={(item, index) => (
//                         <List.Item
//                           className="hover:bg-gray-100 transition-all duration-200 rounded-lg"
//                           style={{ padding: "16px" }}
//                         >
//                           <div className="w-full">
//                             <div className="flex items-center mb-2">
//                               <Text strong className="mr-2">
//                                 {index + 1}.
//                               </Text>
//                               <Text strong>
//                                 {item.title} (Order: {item.orderIndex})
//                               </Text>
//                             </div>
//                             <Text className="block mb-2">
//                               {item.description}
//                             </Text>
//                             <div className="relative">
//                               <video
//                                 controls
//                                 width="100%"
//                                 style={{
//                                   maxWidth: "300px",
//                                   borderRadius: "8px",
//                                 }}
//                                 loading="lazy"
//                               >
//                                 <source src={item.videoUrl} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                               <PlayCircleOutlined
//                                 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl opacity-75 hover:opacity-100 transition-opacity"
//                                 style={{ zIndex: 10 }}
//                               />
//                             </div>
//                           </div>
//                         </List.Item>
//                       )}
//                     />
//                   ) : (
//                     <Text type="secondary">No videos in playlist.</Text>
//                   )}
//                 </Card>
//               </Col>
//             </Row>
//           ) : (
//             <Skeleton active paragraph={{ rows: 8 }} className="px-6" />
//           )}
//         </Spin>

//         {/* Modal cho Reject */}
//         <Modal
//           title={<Title level={4}>Reject Lab</Title>}
//           open={isModalOpen}
//           onOk={handleReject}
//           onCancel={handleModalCancel}
//           okText="Reject"
//           cancelText="Cancel"
//           okButtonProps={{
//             danger: true,
//             size: "large",
//             style: { borderRadius: "8px" },
//           }}
//           cancelButtonProps={{ size: "large", style: { borderRadius: "8px" } }}
//         >
//           <Text>Please provide a reason for rejecting this lab:</Text>
//           <TextArea
//             rows={4}
//             value={remark}
//             onChange={(e) => debouncedSetRemark(e.target.value)}
//             placeholder="Enter remark here..."
//             className="mt-4"
//           />
//         </Modal>
//       </div>
//     </ErrorBoundary>
//   );
// });

// export default LabDetail;

import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLabInformation,
  getLabPlaylist,
  approveLab,
  rejectLab,
  clearError,
} from "../../redux/slices/labSlice";
import {
  Button,
  Spin,
  notification,
  Modal,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Skeleton,
  List,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import ComboDetailModal from "./components/ComboDetailModal"; // Import component mới
import { fetchComboDetails } from "../../redux/slices/comboSlice"; // Import action từ comboSlice

const { TextArea } = Input;
const { Title, Text } = Typography;

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="text-center text-destructive font-Mainfont">
          Something went wrong.
        </h1>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

const LabDetail = React.memo(() => {
  const { labId } = useParams();
  const dispatch = useDispatch();
  const { labInfo, playlist, loading, error } = useSelector(
    (state) => state.lab
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [sortedVideoList, setSortedVideoList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false); // State cho modal combo
  const [selectedCombo, setSelectedCombo] = useState(null); // State cho dữ liệu combo

  const openVideoModal = (videoUrl) => setSelectedVideo(videoUrl);
  const closeVideoModal = () => setSelectedVideo(null);

  const handleThumbnailClick = () => {
    setIsVideoPlaying(true);
  };

  // Hàm hiển thị modal chi tiết combo
  const handleShowComboDetail = async (comboId) => {
    try {
      const response = await dispatch(fetchComboDetails(comboId));
      setSelectedCombo(response.payload.data);
      setIsComboModalVisible(true);
    } catch (err) {
      console.error("Error fetching combo details:", err);
      notification.error({
        message: "Error",
        description: "Failed to fetch combo details.",
      });
    }
  };

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        await Promise.all([
          dispatch(getLabInformation(labId)).unwrap(),
          dispatch(getLabPlaylist(labId)).unwrap(),
        ]);
      } catch (err) {
        console.error("Error fetching lab data:", err);
      }
    };
    fetchLabData();
  }, [dispatch, labId]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error.message || "An error occurred",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const list = Array.isArray(playlist?.data)
      ? [...playlist.data].sort((a, b) => a.orderIndex - b.orderIndex)
      : [];
    setSortedVideoList(list);
  }, [playlist]);

  const handleApprove = async () => {
    try {
      await dispatch(approveLab(labId)).unwrap();
      notification.success({
        message: "Success",
        description: "Lab has been approved successfully!",
      });
      await dispatch(getLabInformation(labId)).unwrap();
    } catch (err) {
      console.error("Error approving lab:", err);
      notification.error({
        message: "Error",
        description: err.message || "Failed to approve lab",
      });
    }
  };

  const handleReject = async () => {
    if (!remark.trim()) {
      notification.error({
        message: "Error",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    try {
      await dispatch(rejectLab({ labId, remark })).unwrap();
      notification.success({
        message: "Success",
        description: "Lab has been rejected successfully!",
      });
      setIsModalOpen(false);
      setRemark("");
      await dispatch(getLabInformation(labId)).unwrap();
    } catch (err) {
      console.error("Error rejecting lab:", err);
      notification.error({
        message: "Error",
        description: err.message || "Failed to reject lab",
      });
    }
  };

  const showRejectModal = () => setIsModalOpen(true);
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setRemark("");
  };

  const debouncedSetRemark = useCallback(
    debounce((value) => setRemark(value), 50),
    []
  );

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Approved";
      case 2:
        return "Pending";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen font-Mainfont">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white shadow-md p-6">
          <div className="flex justify-between items-center">
            <Title level={2} className="text-headerBg mb-0">
              {labInfo?.title || "Lab Detail"}
            </Title>
            {labInfo?.status === 2 && (
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={handleApprove}
                  loading={loading}
                  className="bg-headerBg text-white rounded-lg hover:bg-opacity-80 transition-all duration-200 shadow-md"
                >
                  Approve
                </Button>
                <Button
                  size="large"
                  icon={<CloseCircleOutlined />}
                  onClick={showRejectModal}
                  loading={loading}
                  className="bg-muted text-muted-foreground rounded-lg hover:bg-destructive hover:text-white transition-all duration-200 shadow-md"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Spin
          spinning={loading}
          tip="Loading lab details..."
          className="text-headerBg"
        >
          {labInfo ? (
            <div className="bg-white max-w-7xl mx-auto px-6 py-8">
              <Row gutter={[32, 32]}>
                {/* Preview Video Section */}
                <Col xs={24} lg={16}>
                  <div className="bg-black rounded-lg overflow-hidden shadow-lg relative">
                    {labInfo.previewVideoUrl ? (
                      isVideoPlaying ? (
                        <video
                          controls
                          autoPlay
                          width="100%"
                          height={400}
                          className="object-cover"
                        >
                          <source
                            src={labInfo.previewVideoUrl}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div
                          className="relative cursor-pointer"
                          onClick={handleThumbnailClick}
                        >
                          <Image
                            src={
                              labInfo.imageUrl ||
                              "https://via.placeholder.com/600x400"
                            }
                            alt="Lab Preview Thumbnail"
                            width="100%"
                            height={400}
                            className="object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/600x400")
                            }
                          />
                          <PlayCircleOutlined
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-headerBg text-5xl opacity-75 hover:opacity-100 transition-opacity duration-200"
                            style={{ zIndex: 10 }}
                          />
                        </div>
                      )
                    ) : (
                      <Image
                        src={
                          labInfo.imageUrl ||
                          "https://via.placeholder.com/600x400"
                        }
                        alt="Lab Image"
                        width="100%"
                        height={400}
                        className="object-cover"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/600x400")
                        }
                      />
                    )}
                  </div>

                  {/* Lab Info */}
                  <div className="mt-6">
                    <Title level={3} className="text-headerBg">
                      About This Lab
                    </Title>
                    <Text className="text-muted-foreground">
                      {labInfo.summary}
                    </Text>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Text strong className="text-textColer">
                          Price:
                        </Text>{" "}
                        <Text>${labInfo.price?.toLocaleString() || "N/A"}</Text>
                      </div>
                      <div>
                        <Text strong className="text-textColer">
                          Status:
                        </Text>{" "}
                        <Text>{getStatusText(labInfo.status)}</Text>
                      </div>
                      <div>
                        <Text strong className="text-textColer">
                          Created By:
                        </Text>{" "}
                        <Text>{labInfo.createdByNavigationEmail}</Text>
                      </div>
                      <div>
                        <Text strong className="text-textColer">
                          Combo:
                        </Text>{" "}
                        <Text>
                          <a
                            onClick={() =>
                              handleShowComboDetail(labInfo.comboId)
                            }
                            className="text-blue-500 hover:underline cursor-pointer"
                          >
                            {labInfo.comboNavigationName}
                          </a>{" "}
                          (ID: {labInfo.comboId})
                        </Text>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Text strong className="text-textColer">
                        Description:
                      </Text>
                      <Text className="block mt-2 text-muted-foreground">
                        {labInfo.description}
                      </Text>
                    </div>
                  </div>
                </Col>

                {/* Video Playlist */}
                <Col xs={24} lg={8}>
                  <Card
                    title={
                      <Title level={4} className="text-headerBg">
                        Labs Content
                      </Title>
                    }
                    bordered={false}
                    className="shadow-lg rounded-xl bg-white"
                  >
                    {sortedVideoList.length > 0 ? (
                      <List
                        dataSource={sortedVideoList}
                        renderItem={(item, index) => (
                          <List.Item className="border-b border-border py-4 hover:bg-bgColer transition-all duration-200">
                            <div className="flex items-center w-full justify-between">
                              <div className="flex items-center flex-1">
                                <Text className="text-muted-foreground mr-3">
                                  {index + 1}.
                                </Text>
                                <div>
                                  <Text strong className="text-textColer">
                                    {item.title}
                                  </Text>
                                  <Text className="block text-sm text-muted-foreground">
                                    {item.description}
                                  </Text>
                                </div>
                              </div>
                              <div className="relative ml-4">
                                {item.videoUrl ? (
                                  <div
                                    className="relative w-20 h-12 rounded-md overflow-hidden cursor-pointer"
                                    onClick={() =>
                                      openVideoModal(item.videoUrl)
                                    }
                                  >
                                    <video
                                      width="100%"
                                      height="100%"
                                      className="object-cover"
                                      muted
                                    >
                                      <source
                                        src={item.videoUrl}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                    <PlayCircleOutlined
                                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-headerBg text-2xl opacity-75 hover:opacity-100 transition-opacity duration-200"
                                      style={{ zIndex: 10 }}
                                    />
                                  </div>
                                ) : (
                                  <Text className="text-muted-foreground text-sm">
                                    No video
                                  </Text>
                                )}
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary" className="text-muted-foreground">
                        No videos in playlist.
                      </Text>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <Skeleton active paragraph={{ rows: 8 }} className="px-6" />
          )}
        </Spin>

        {/* Video Modal */}
        <Modal
          open={!!selectedVideo}
          onCancel={closeVideoModal}
          footer={null}
          width={800}
          className="rounded-lg"
          bodyStyle={{ padding: 0 }}
        >
          {selectedVideo && (
            <video controls width="100%" autoPlay className="rounded-t-lg">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Modal>

        {/* Combo Detail Modal */}
        <ComboDetailModal
          visible={isComboModalVisible}
          onCancel={() => setIsComboModalVisible(false)}
          combo={selectedCombo}
        />

        {/* Reject Modal */}
        <Modal
          title={
            <Title level={4} className="text-headerBg">
              Reject Lab
            </Title>
          }
          open={isModalOpen}
          onOk={handleReject}
          onCancel={handleModalCancel}
          okText="Reject"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            size: "large",
            className:
              "bg-destructive text-white rounded-lg hover:bg-opacity-80 transition-all",
          }}
          cancelButtonProps={{
            size: "large",
            className:
              "bg-muted text-muted-foreground rounded-lg hover:bg-opacity-80 transition-all",
          }}
        >
          <Text className="text-muted-foreground">
            Please provide a reason for rejecting this lab:
          </Text>
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => debouncedSetRemark(e.target.value)}
            placeholder="Enter remark here..."
            className="mt-4 border-border rounded-lg"
          />
        </Modal>
      </div>
    </ErrorBoundary>
  );
});

export default LabDetail;
