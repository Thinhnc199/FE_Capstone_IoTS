import { Modal, Button, message, Upload } from "antd";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  uploadWarrantyVideo,
  createWarrantyRequest,
  resetVideoState,
} from "./../../redux/slices/warrantySlice";

const WarrantyRequestModal = ({
  visible,
  orderItemId,
  onClose,
  fetchOrders,
}) => {
  const dispatch = useDispatch();
  const { videoUrl, loading: uploading } = useSelector(
    (state) => state.warranty
  ); // Lấy từ warrantySlice
  const [formData, setFormData] = useState({
    description: "",
    remarks: "",
    identifySerialNumber: "",
    contactNumber: "",
    videoUrl: "",
  });
  const [touched, setTouched] = useState({
    contactNumber: false,
  });
  const [videoFile, setVideoFile] = useState(null);

  // Đồng bộ videoUrl từ Redux vào formData
  useEffect(() => {
    if (videoUrl) {
      setFormData((prev) => ({ ...prev, videoUrl }));
    }
  }, [videoUrl]);

  useEffect(() => {
    if (videoFile) {
      const uploadVideo = async () => {
        try {
          await dispatch(uploadWarrantyVideo(videoFile)).unwrap();
          message.success("Video uploaded successfully!");
          setVideoFile(null);
        } catch {
          message.error("Failed to upload video");
          setVideoFile(null);
        }
      };
      uploadVideo();
    }
  }, [videoFile, dispatch]);

  // Hàm xử lý thay đổi giá trị trong form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý chọn file video
  const handleVideoFileChange = (info) => {
    const selectedFile = info.fileList[0]?.originFileObj;
    if (selectedFile) {
      setVideoFile(selectedFile);
    }
  };

  // Hàm gửi yêu cầu bảo hành
  const handleSubmit = async () => {
    setTouched((prev) => ({ ...prev, contactNumber: true }));

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      message.error("Contact number must be 10 digits starting with 0");
      return;
    }

    try {
      const payload = { ...formData, orderItemId };
      await dispatch(createWarrantyRequest(payload)).unwrap();
      message.success("Warranty request submitted successfully!");
      setFormData({
        description: "",
        remarks: "",
        identifySerialNumber: "",
        contactNumber: "",
        videoUrl: "",
      });
      setTouched({ contactNumber: false });
      setVideoFile(null);
      dispatch(resetVideoState()); // Reset trạng thái video
      onClose();
      if (fetchOrders) fetchOrders();
    } catch (error) {
      message.error("Failed to submit warranty request");
      console.error("Warranty request error:", error);
    }
  };

  const uploadVideoProps = {
    accept: "video/*",
    beforeUpload: () => false,
    onChange: handleVideoFileChange,
    fileList: videoFile
      ? [
          {
            uid: "-1",
            name: videoFile.name,
            status: uploading ? "uploading" : "done",
          },
        ]
      : [],
    showUploadList: false,
    disabled: uploading,
  };

  return (
    <Modal
      title="Warranty Request"
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => {
        dispatch(resetVideoState());
        onClose();
      }}
      okText="Submit Request"
      cancelText="Close"
      width={600}
      okButtonProps={{ disabled: uploading }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            placeholder="Describe the issue"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleFormChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            placeholder="Additional notes"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Serial Number</label>
          <input
            type="text"
            name="identifySerialNumber"
            value={formData.identifySerialNumber}
            onChange={handleFormChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            placeholder="Product serial number"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
              touched.contactNumber && !/^0\d{9}$/.test(formData.contactNumber)
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="10-digit phone number starting with 0"
            onBlur={() =>
              setTouched((prev) => ({ ...prev, contactNumber: true }))
            }
          />
          {touched.contactNumber &&
            !/^0\d{9}$/.test(formData.contactNumber) && (
              <p className="text-red-500 text-sm mt-1">
                Contact number must be 10 digits starting with 0
              </p>
            )}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Video Evidence (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <Upload {...uploadVideoProps}>
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                disabled={uploading}
                className={`${
                  uploading ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600`}
              >
                {uploading ? "Uploading..." : "Select Video"}
              </Button>
            </Upload>
          </div>
          {videoFile && !formData.videoUrl && (
            <p className="text-gray-500 mt-1">Selected: {videoFile.name}</p>
          )}
          {formData.videoUrl && (
            <div className="mt-4">
              <video
                controls
                src={formData.videoUrl}
                className="w-full max-w-md rounded-lg border border-gray-300"
                style={{ maxHeight: "300px" }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

WarrantyRequestModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderItemId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func,
};

export default WarrantyRequestModal;
