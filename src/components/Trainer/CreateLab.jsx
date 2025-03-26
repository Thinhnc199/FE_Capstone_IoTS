// import  { useState } from 'react';
// import { Steps } from 'antd';
// import Step1Form from './components/Step1Form';
// import Step2Form from './components/Step2Form';

// const CreateLab = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [labId, setLabId] = useState(null);

//   const steps = [
//     {
//       title: 'Lab Information',
//       content: (
//         <Step1Form
//           onSubmit={(data) => {
//             setLabId(data.labId);
//             setCurrentStep(1);
//           }}
//           initialData={labId ? { labId } : null}
//           goToStep2={() => setCurrentStep(1)}
//         />
//       ),
//     },
//     {
//       title: 'Video Playlist',
//       content: <Step2Form labId={labId} onBack={() => setCurrentStep(0)} />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-mainColer p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         <Steps current={currentStep} className="mb-8">
//           {steps.map((item) => (
//             <Steps.Step key={item.title} title={item.title} />
//           ))}
//         </Steps>
//         <div className="steps-content">{steps[currentStep].content}</div>
//       </div>
//     </div>
//   );
// };

// export default CreateLab;

import { useState, useEffect } from "react";
import { Steps, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Step1Form from "./components/Step1Form";
import Step2Form from "./components/Step2Form";

const CreateLab = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [labId, setLabId] = useState(null);
  const { labId: paramLabId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/trainer/create-lab") {
      // Reset trạng thái thay vì reload
      setLabId(null); // Đảm bảo labId là null khi tạo mới
      setCurrentStep(0); // Reset về bước đầu tiên
    } else if (paramLabId) {
      // Set labId khi vào route update-lab
      setLabId(paramLabId);
    }
  }, [paramLabId, location.pathname]);

  const handleStep1Submit = (data) => {
    if (location.pathname === "/trainer/create-lab") {
      setLabId(null); // Đảm bảo labId là null khi tạo mới
      setCurrentStep(1);
    } else {
      setLabId(data.labId || paramLabId); // Chỉ set labId khi update
      setCurrentStep(1);
    }
  };

  const steps = [
    {
      title: "Lab Information",
      content: (
        <Step1Form
          onSubmit={handleStep1Submit}
          initialData={labId ? { labId } : null}
          goToStep2={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Video Playlist",
      content: <Step2Form labId={labId} onBack={() => setCurrentStep(0)} />,
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            {labId ? "Update Lab" : "Create Lab"}
          </h2>
          <Button onClick={() => navigate("/trainer/labs-management")}>
            Back to Labs
          </Button>
        </div>
        <Steps current={currentStep} className="mb-8">
          {steps.map((item) => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
      </div>
    </div>
  );
};

export default CreateLab;
