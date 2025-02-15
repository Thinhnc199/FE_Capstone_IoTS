import PropTypes from "prop-types";
import { Modal, Input } from "antd";

const ConfirmModal = ({
  open,
  onOk,
  onCancel,
  actionType,
  remark,
  setRemark,
}) => {
  return (
    <Modal
      title={
        actionType === "approve"
          ? "Approve User Request?"
          : "Reject User Request?"
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Input
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Nhập lý do..."
      />
    </Modal>
  );
};

// Định nghĩa kiểu dữ liệu cho props
ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  remark: PropTypes.string.isRequired,
  setRemark: PropTypes.func.isRequired,
};

export default ConfirmModal;
