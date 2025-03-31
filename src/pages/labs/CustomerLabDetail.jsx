import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Spin, Tag, Rate, Card } from "antd";
import { getLabInformation } from "./../../redux/slices/labSlice";
import LabPlaylist from "./LabPlaylist";
import dayjs from "dayjs";
import { fetchFeedbackHistory } from "./../../redux/slices/feedbackSlice";
import { ProductType } from "./../../redux/constants";

const LabDetail = () => {
  const { labId } = useParams();
  const dispatch = useDispatch();
  const { labInfo, loading, error } = useSelector((state) => state.lab);
  const [activeTab, setActiveTab] = useState("1");
  const feedback = useSelector((state) => state.feedback);

  // useEffect(() => {
  //   if (labId) {
  //     dispatch(getLabInformation(labId));
  //   }
  // }, [labId, dispatch]);
  useEffect(() => {
    if (labId) {
      dispatch(getLabInformation(labId));
      // Gọi API feedback cho lab
      dispatch(
        fetchFeedbackHistory({
          advancedFilter: {
            productId: parseInt(labId),
            productType: ProductType.LAB,
          },
          paginationRequest: {
            pageIndex: 0,
            pageSize: 10,
            searchKeyword: "",
          },
        })
      );
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
        <div className="p-6 bg-gray-50 rounded-lg">
          {labInfo.previewVideoUrl && (
            <div className="mb-6">
              <video
                controls
                src={labInfo.previewVideoUrl}
                className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          )}
          <Card className="p-4 bg-white shadow-md rounded-lg mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Lab Details
            </h2>
            <div className="grid grid-cols-1 gap-4 text-gray-700">
              <p>
                <strong className="font-medium">Combo:</strong>{" "}
                {labInfo.comboNavigationName}
              </p>
              <p>
                <strong className="font-medium">Description:</strong>{" "}
                {labInfo.description}
              </p>
              <p>
                <strong className="font-medium">Serial Number:</strong>{" "}
                {labInfo.applicationSerialNumber}
              </p>
              <p>
                <strong className="font-medium">Status:</strong>{" "}
                {getStatusTag(labInfo.status)}
              </p>
              <div className="flex items-center mt-2">
                <Rate
                  disabled
                  value={labInfo.rating}
                  className="text-yellow-400"
                />
                <span className="ml-2 text-sm text-gray-600">
                  ({labInfo.rating} stars)
                </span>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Last updated:</span>{" "}
                {dayjs(labInfo.updatedDate).format("DD/MM/YYYY")}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Created by:</span>{" "}
                <span className="text-blue-600 hover:underline">
                  {labInfo.createdByNavigationEmail}
                </span>
              </p>
            </div>
          </Card>

          {/* Phần Feedback */}
          <Card className="p-4 bg-white shadow-md rounded-lg mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Feedback
            </h2>
            <div className="space-y-4">
              {feedback.feedbackHistory?.length > 0 ? (
                feedback.feedbackHistory.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">
                        {`Anonymous ${review.createdBy}`}
                      </p>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        className="text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(review.createdDate).toLocaleString("en-EN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.content || "No comment"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic mb-4">
                    There are currently no reviews for this lab. Be the first to
                    share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      ),
    },
    ...(labInfo.hasAbilityToViewPlaylist
      ? [
          {
            key: "2",
            label: "Tutorials",
            children: (
              <div className="p-6 bg-gray-50 rounded-lg">
                <LabPlaylist labId={labId} />
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    //max-h-screen bg-white rounded-sm shadow-sm mx-auto p-4 my-4 container
    <div className="min-h-screen bg-mainColer rounded-sm shadow-sm mx-auto p-4 my-4 container">
      <div className="bg-white text-gray-800 p-4 rounded-lg mb-6 shadow flex items-center">
        {labInfo.imageUrl && (
          <Card>
            <img
              src={labInfo.imageUrl}
              alt={labInfo.title}
              className="rounded-md"
              style={{ width: "200px", height: "100px" }}
            />
          </Card>
        )}
        <div>
          <h1 className="text-3xl font-bold font-Mainfont">{labInfo.title}</h1>
          <p className="text-lg mt-2">{labInfo.summary}</p>
        </div>
      </div>
      {/* Sử dụng items thay vì TabPane */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className="mt-8 bg-white p-6 rounded-lg shadow-md"
        destroyInactiveTabPane={false}
      />
    </div>
  );
};

export default memo(LabDetail);
