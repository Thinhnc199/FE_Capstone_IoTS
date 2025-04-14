import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getWarrantyById,
  clearWarranty,
  rejectWarrantyRequest,
  approveWarrantyRequest,
} from "../../redux/slices/warrantySlice";
import { Roles, ProductType } from "../../redux/constants";
import { Spin, Modal, Button, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const WarrantyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { warranty, loading, error } = useSelector(
    (state) => state.warranty || {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkPopup, setRemarkPopup] = useState(false);

  const userRole = parseInt(localStorage.getItem("role"), 10);

  useEffect(() => {
    dispatch(getWarrantyById(id));
    return () => {
      dispatch(clearWarranty());
    };
  }, [dispatch, id]);

  const handleApprove = () => {
    setModalType("approve");
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setModalType("reject");
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "approve") {
      dispatch(approveWarrantyRequest(id)).then(() => {
        dispatch(getWarrantyById(id));
        setIsModalOpen(false);
      });
    } else if (modalType === "reject") {
      dispatch(rejectWarrantyRequest({ id, remark })).then(() => {
        dispatch(getWarrantyById(id));
        setIsModalOpen(false);
        setRemark("");
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRemark("");
  };

  const showRemarkPopup = () => {
    setRemarkPopup(true);
  };

  if (loading)
    return (
      <Spin
        tip="Loading..."
        className="flex justify-center items-center h-screen"
      />
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!warranty) return <p className="text-center">No warranty data found.</p>;

  const renderVideo = (url) => {
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    let videoId;

    if (isYouTube) {
      videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Warranty Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else {
      return (
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          controls
          src={url}
          title="Warranty Video"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div className="p-6 bg-mainColer min-h-screen font-Mainfont">
      {/* Video Section */}
      {warranty.videoUrl && (
        <div className="w-full max-w-4xl mx-auto mb-6">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            {renderVideo(warranty.videoUrl)}
          </div>
        </div>
      )}

      {/* Warranty Info Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Header Section: Tiêu đề và nút/icon trên cùng 1 hàng */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-headerBg">
              Warranty Request Detail
            </h2>

            {/* Customer Role: Hiển thị remark nếu có */}
            {userRole === Roles.CUSTOMER && warranty.remarks && (
              <ExclamationCircleOutlined
                className="text-red-500 text-xl cursor-pointer"
                onClick={showRemarkPopup}
              />
            )}
          </div>
          {/* Store Role: Nút Approve/Reject */}
          {userRole === Roles.STORE && warranty.status === 0 && (
            <div className="flex gap-4">
              <Button
                type="primary"
                className="bg-headerBg"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button danger onClick={handleReject}>
                Reject
              </Button>
            </div>
          )}
        </div>

        {/* Warranty Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-textColer font-semibold">ID:</p>
            <p>{warranty.id}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Order code:</p>
            <p>{warranty.orderCode}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Product Name:</p>
            <p>{warranty.productName}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Product Type:</p>
            <p>{ProductType[warranty.productType] || "Unknown"}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Description:</p>
            <p>{warranty.description}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Created By Email:</p>
            <p>{warranty.createdByEmail}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Created Date:</p>
            <p>{new Date(warranty.createdDate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Status:</p>
            <p>
              {["Pending", "Approved", "Rejected", "Success"][
                warranty.status
              ] || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Serial Number:</p>
            <p>{warranty.identifySerialNumber}</p>
          </div>
          <div>
            <p className="text-textColer font-semibold">Contact Number:</p>
            <p>{warranty.contactNumber}</p>
          </div>
        </div>
      </div>

      {/* Modal xác nhận cho Store */}
      <Modal
        title={
          modalType === "approve" ? "Confirm Approval" : "Confirm Rejection"
        }
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to {modalType} this warranty request?</p>
        {modalType === "reject" && (
          <Input
            placeholder="Enter reason for rejection"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="mt-2"
          />
        )}
      </Modal>

      {/* Popup Remark cho Customer */}
      <Modal
        title="Remark"
        open={remarkPopup}
        onOk={() => setRemarkPopup(false)}
        onCancel={() => setRemarkPopup(false)}
        footer={[
          <Button key="close" onClick={() => setRemarkPopup(false)}>
            Close
          </Button>,
        ]}
      >
        <p>{warranty.remarks}</p>
      </Modal>
    </div>
  );
};

export default WarrantyDetail;
