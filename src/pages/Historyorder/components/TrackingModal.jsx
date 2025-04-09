import PropTypes from "prop-types";
import { Modal, Button } from "antd";

export const TrackingModal = ({ trackingInfo, onClose }) => (
  <Modal
    title={
      <div className="flex items-center space-x-3">
        <img
          src="/public/images/Logo-GHTK.png"
          alt="GHTK Logo"
          className="w-[50%] object-contain"
          onError={(e) =>
            (e.target.src =
              "https://img.upanh.tv/2025/03/31/Logo-GHTK-1024x346.png")
          }
        />
      </div>
    }
    visible={!!trackingInfo}
    onCancel={onClose}
    zIndex={1111}
    footer={[
      <Button key="close" onClick={onClose}>
        Close
      </Button>,
    ]}
  >
    <div className="space-y-2 text-gray-700">
      {[
        { label: "Tracking ID:", value: trackingInfo?.labelId },
        { label: "Status:", value: trackingInfo?.statusText },
        { label: "Created Date:", value: trackingInfo?.created },
        { label: "Estimated Delivery:", value: trackingInfo?.deliverDate },
        { label: "Customer Name:", value: trackingInfo?.customerFullname },
        { label: "Phone Number:", value: trackingInfo?.customerTel },
        { label: "Address:", value: trackingInfo?.address },
      ].map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="font-semibold">{item.label}</span>
          <span className="text-right">{item.value}</span>
        </div>
      ))}
    </div>
  </Modal>
);

TrackingModal.propTypes = {
  trackingInfo: PropTypes.shape({
    labelId: PropTypes.string,
    statusText: PropTypes.string,
    created: PropTypes.string,
    deliverDate: PropTypes.string,
    customerFullname: PropTypes.string,
    customerTel: PropTypes.string,
    address: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
