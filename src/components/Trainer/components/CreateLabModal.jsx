import { useState } from "react";
import { Steps } from "antd";
import PropTypes from "prop-types"; // Thêm PropTypes
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";

const CreateLabModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [labId] = useState(null); // Giữ lại để linh hoạt cho tương lai

  const handleStep1Submit = (data) => {
    // Sử dụng data nếu cần lưu thông tin từ Step1Form
    console.log("Step 1 Data:", data); // Ví dụ: log dữ liệu để kiểm tra
    setCurrentStep(1); // Chuyển sang bước 2
    // Nếu cần set labId từ dữ liệu API trả về sau khi submit Step 1, có thể dùng:
    // setLabId(data.labId || null);
  };

  const steps = [
    {
      title: "Lab Information",
      content: (
        <Step1Form
          onSubmit={handleStep1Submit}
          initialData={null} // Không có labId khi tạo mới
          goToStep2={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Video Playlist",
      content: <Step2Form labId={labId} onBack={() => setCurrentStep(0)} />,
    },
  ];

//   const handleFinish = () => {
//     // Logic lưu lab (gọi API hoặc dispatch action)
//     console.log("Lab created");
//     onClose(); // Đóng Modal sau khi hoàn tất
//   };

  return (
    <div>
      <Steps current={currentStep} className="mb-6">
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
      {/* <div className="steps-action mt-6 flex justify-end gap-4">
        {currentStep > 0 && (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Previous
          </Button>
        )}
        {currentStep === steps.length - 1 ? (
          <Button type="primary" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        )}
      </div> */}
    </div>
  );
};

// Khai báo PropTypes để sửa lỗi 'onClose' is missing in props validation
CreateLabModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateLabModal;