import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Spin, Card } from "antd";
import PropTypes from "prop-types";
import { getLabPlaylist } from "./../../redux/slices/labSlice";

const LabPlaylist = ({ labId }) => {
  const dispatch = useDispatch();
  const { playlist, loading } = useSelector((state) => state.lab);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const playlistData = playlist?.data || [];

  useEffect(() => {
    setSelectedVideo(null);

    if (labId && (!playlist || !playlist.data || playlist.data.length === 0)) {
      dispatch(getLabPlaylist(labId));
    }
  }, [labId, dispatch, playlist]); // playlist là dependency để kiểm tra

  useEffect(() => {
    if (playlistData.length > 0 && !selectedVideo) {
      setSelectedVideo(playlistData[0]);
    }
  }, [playlistData, selectedVideo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row p-4">
      <div className="lg:w-3/4 w-full pr-0 lg:pr-4 mb-4 lg:mb-0">
        {selectedVideo ? (
          <>
            <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
            <video
              controls
              src={selectedVideo.videoUrl}
              className="w-full rounded-lg shadow mt-5"
              style={{ maxHeight: "500px" }}
            />

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Description:</h2>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No video selected.</div>
        )}
      </div>

      <div className="lg:w-1/4 w-full">
        <Card className="h-full overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Tutorials Playlist</h2>
          <List
            dataSource={playlistData}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelectedVideo(item)}
                className={`cursor-pointer p-2 rounded-lg ${
                  selectedVideo?.id === item.id ? "bg-bgColer" : ""
                }`}
              >
                <div className="flex items-center">
                  <video
                    controls
                    src={item.videoUrl}
                    className="w-14 h-10 mr-2 rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Video {item.orderIndex}
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

LabPlaylist.propTypes = {
  labId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default memo(LabPlaylist);
