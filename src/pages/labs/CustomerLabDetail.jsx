import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Spin, Tag, Rate, Card } from "antd";
import { getLabInformation } from "./../../redux/slices/labSlice";
import LabPlaylist from "./LabPlaylist";
import dayjs from "dayjs";

const LabDetail = () => {
  const { labId } = useParams();
  const dispatch = useDispatch();
  const { labInfo, loading, error } = useSelector((state) => state.lab);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    if (labId) {
      dispatch(getLabInformation(labId));
    }
  }, [labId, dispatch]);

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">Approved</Tag>;
      case 2:
        return <Tag color="orange">Pending</Tag>;
      case 3:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!labInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        No lab information available.
      </div>
    );
  }

  // Định nghĩa items cho Tabs
  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: (
        <div className="p-6">
          {labInfo.previewVideoUrl && (
            <div className="mb-6">
              <video
                controls
                src={labInfo.previewVideoUrl}
                className="w-full rounded-lg shadow"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Lab Details</h2>
            <p>
              <strong>Combo:</strong> {labInfo.comboNavigationName}
            </p>
            <p>
              <strong>Description:</strong> {labInfo.description}
            </p>
            <p>
              <strong>Serial Number:</strong> {labInfo.applicationSerialNumber}
            </p>
            <p>
              <strong>Status:</strong> {getStatusTag(labInfo.status)}
            </p>
          </Card>
          {labInfo.imageUrl && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Thumbnail</h2>
              <img
                src={labInfo.imageUrl}
                alt={labInfo.title}
                className="w-full rounded-lg"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </Card>
          )}
        </div>
      ),
    },
    ...(labInfo.hasAbilityToViewPlaylist
      ? [
          {
            key: "2",
            label: "Tutorials",
            children: <LabPlaylist labId={labId} />,
          },
        ]
      : []),
  ];

  return (
    //max-h-screen bg-white rounded-sm shadow-sm mx-auto p-4 my-4 container
    <div className="min-h-screen bg-mainColer rounded-sm shadow-sm mx-auto p-4 my-4 container">
      <div className="bg-white text-gray-800 p-4 rounded-lg mb-6 shadow">
        <h1 className="text-3xl font-bold font-Mainfont">{labInfo.title}</h1>
        <p className="text-lg mt-2">{labInfo.summary}</p>
        <div className="flex items-center mt-4">
          <Rate disabled value={labInfo.rating} />
          <span className="ml-2 text-sm">({labInfo.rating} stars)</span>
        </div>
        <p className="text-sm mt-2">
          Last updated: {dayjs(labInfo.updatedDate).format("DD/MM/YYYY")}
        </p>
        <p className="text-sm">
          Created by:{" "}
          <span className="text-textColer">
            {labInfo.createdByNavigationEmail}
          </span>
        </p>
      </div>

      {/* Sử dụng items thay vì TabPane */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className="bg-white rounded-lg shadow"
        destroyInactiveTabPane={false}
      />
    </div>
  );
};

export default memo(LabDetail);
