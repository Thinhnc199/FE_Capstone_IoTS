import  { useState } from 'react';
import { Steps } from 'antd';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';

const NewCreateLab = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [labId, setLabId] = useState(null);

  const steps = [
    {
      title: 'Lab Information',
      content: (
        <Step1Form
          onSubmit={(data) => {
            setLabId(data.labId);
            setCurrentStep(1);
          }}
          initialData={labId ? { labId } : null}
          goToStep2={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: 'Video Playlist',
      content: <Step2Form labId={labId} onBack={() => setCurrentStep(0)} />,
    },
  ];

  return (
    <div className="min-h-screen bg-mainColer p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
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

export default NewCreateLab;
