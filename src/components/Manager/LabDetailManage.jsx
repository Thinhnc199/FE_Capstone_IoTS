import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLabInformation,
  getLabPlaylist,
  clearError,
} from "./../../redux/slices/labSlice";
import {
  Spin,
  notification,
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Skeleton,
  List,
  Image,
} from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import ComboDetailModal from "./../StoreIoT/components/ComboDetailModal";
import { fetchComboDetails } from "./../../redux/slices/comboSlice";

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

const LabDetailManage = React.memo(() => {
  const { labId } = useParams();
  const dispatch = useDispatch();
  const { labInfo, playlist, loading, error } = useSelector(
    (state) => state.lab
  );
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
                        <Text>
                          {labInfo.price?.toLocaleString() || "N/A"} VND
                        </Text>
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
          destroyOnClose 
        >
          {selectedVideo && (
            <video
              controls
              width="100%"
              autoPlay
              className="rounded-t-lg"
              key={selectedVideo} // Force re-render when video changes
            >
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
      </div>
    </ErrorBoundary>
  );
});

export default LabDetailManage;
