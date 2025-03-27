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

  // Track form data between steps
  const [step1Data, setStep1Data] = useState(null);

  useEffect(() => {
    if (location.pathname === "/trainer/create-lab") {
      // Reset state for new lab creation
      setLabId(null);
      setStep1Data(null);
      setCurrentStep(0);
    } else if (paramLabId) {
      // Set labId for update mode
      setLabId(paramLabId);
    }
  }, [paramLabId, location.pathname]);

  const handleStep1Submit = (data) => {
    // Store the submitted data and move to next step
    setStep1Data(data);
    setLabId(data.labId || paramLabId);
    setCurrentStep(1);
  };

  const handleStepChange = (step) => {
    // Allow free navigation between steps
    setCurrentStep(step);
  };

  const steps = [
    {
      title: "Lab Information",
      content: (
        <Step1Form
          onSubmit={handleStep1Submit}
          initialData={step1Data || (labId ? { labId } : null)}
          goToStep2={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Video Playlist",
      content: (
        <Step2Form
          labId={labId}
          onBack={() => setCurrentStep(0)}
          onNext={() => setCurrentStep(1)}
        />
      ),
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
        <Steps
          current={currentStep}
          onChange={handleStepChange}
          className="mb-8"
        >
          {steps.map((item) => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
        {/* Optional: Add navigation buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLab;
