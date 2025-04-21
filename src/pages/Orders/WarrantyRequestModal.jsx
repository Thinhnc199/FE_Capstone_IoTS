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
  );
  const [formData, setFormData] = useState({
    description: "",
    remarks: "Warranty Request",
    identifySerialNumber: "",
    contactNumber: "",
    videoUrl: "",
  });
  const [touched, setTouched] = useState({
    description: false,
    identifySerialNumber: false,
    contactNumber: false,
    videoUrl: false,
  });
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (videoUrl) {
      setFormData((prev) => ({ ...prev, videoUrl }));
      setTouched((prev) => ({ ...prev, videoUrl: true }));
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
          setVideoFile(null);
        }
      };
      uploadVideo();
    }
  }, [videoFile, dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoFileChange = (info) => {
    const selectedFile = info.fileList[0]?.originFileObj;
    if (selectedFile) {
      setVideoFile(selectedFile);
      setTouched((prev) => ({ ...prev, videoUrl: true }));
    }
  };

  // Validation
  const validateForm = () => {
    const errors = [];

    if (!formData.description.trim()) {
      errors.push("Description is required");
    }

    if (!formData.identifySerialNumber.trim()) {
      errors.push("Serial Number is required");
    }

    const phoneRegex = /^0\d{9}$/;
    if (!formData.contactNumber.trim()) {
      errors.push("Contact Number is required");
    } else if (!phoneRegex.test(formData.contactNumber)) {
      errors.push("Contact number must be 10 digits starting with 0");
    }

    // Validate Video
    if (!formData.videoUrl) {
      errors.push("Video evidence is required");
    }

    return errors;
  };

  // Handle form submission with validation
  const handleSubmit = async () => {
    // Mark all fields as touched to show validation errors
    setTouched({
      description: true,
      remarks: "Warranty Request",
      identifySerialNumber: true,
      contactNumber: true,
      videoUrl: true,
    });

    // Validate the form
    const errors = validateForm();
    if (errors.length > 0) {
      message.error(errors[0]);
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
      setTouched({
        description: false,
        remarks: false,
        identifySerialNumber: false,
        contactNumber: false,
        videoUrl: false,
      });
      setVideoFile(null);
      dispatch(resetVideoState());
      onClose();
      if (fetchOrders) fetchOrders();
    } catch (error) {
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
      zIndex={1111}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">
            Physical Serial Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="identifySerialNumber"
            value={formData.identifySerialNumber}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
              touched.identifySerialNumber &&
              !formData.identifySerialNumber.trim()
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Physical serial number"
            onBlur={() =>
              setTouched((prev) => ({ ...prev, identifySerialNumber: true }))
            }
          />
          {touched.identifySerialNumber &&
            !formData.identifySerialNumber.trim() && (
              <p className="text-red-500 text-sm mt-1">
                Serial Number is required
              </p>
            )}
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
              touched.contactNumber &&
              (!formData.contactNumber.trim() ||
                !/^0\d{9}$/.test(formData.contactNumber))
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="10-digit phone number starting with 0"
            onBlur={() =>
              setTouched((prev) => ({ ...prev, contactNumber: true }))
            }
          />
          {touched.contactNumber && !formData.contactNumber.trim() && (
            <p className="text-red-500 text-sm mt-1">
              Contact Number is required
            </p>
          )}
          {touched.contactNumber &&
            formData.contactNumber.trim() &&
            !/^0\d{9}$/.test(formData.contactNumber) && (
              <p className="text-red-500 text-sm mt-1">
                Contact number must be 10 digits starting with 0
              </p>
            )}
        </div>
        {/* <div>
          <label className="block text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
              touched.description && !formData.description.trim()
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Describe the issue"
            onBlur={() =>
              setTouched((prev) => ({ ...prev, description: true }))
            }
          />
          {touched.description && !formData.description.trim() && (
            <p className="text-red-500 text-sm mt-1">Description is required</p>
          )}
        </div> */}
        <div>
          <label className="block text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
              touched.description && !formData.description.trim()
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Describe the issue"
            onBlur={() =>
              setTouched((prev) => ({ ...prev, description: true }))
            }
            rows={4} // Bạn có thể điều chỉnh số dòng hiển thị
          />
          {touched.description && !formData.description.trim() && (
            <p className="text-red-500 text-sm mt-1">Description is required</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Video Evidence <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <Upload {...uploadVideoProps}>
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                disabled={uploading}
                className={`${
                  uploading ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600 ${
                  touched.videoUrl && !formData.videoUrl ? "border-red-500" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Select Video"}
              </Button>
            </Upload>
          </div>
          {videoFile && !formData.videoUrl && (
            <p className="text-gray-500 mt-1">Selected: {videoFile.name}</p>
          )}
          {touched.videoUrl && !formData.videoUrl && (
            <p className="text-red-500 text-sm mt-1">
              Video evidence is required
            </p>
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
