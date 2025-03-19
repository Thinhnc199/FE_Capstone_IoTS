// src/components/Step2Form.jsx
import  { useState } from 'react';
import { Form, Input, Button, Modal, notification } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Step2Form = ({ labId, onBack }) => {
  const [form] = Form.useForm();
  const [videos, setVideos] = useState([
    {
      labId,
      title: 'Lesson 1: Getting Started',
      description: 'Introduction to the course',
      videoUrl: 'https://www.youtube.com/embed/tkDw607lm4U?si=i6QDwoRLNdHCNYJ9',
    },
  ]);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const handleInsert = (values) => {
    const videoData = { ...values, labId };
    setVideos([videoData, ...videos]);
    form.resetFields();
  };

  const handleDelete = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    form.setFieldsValue(videos[index]);
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleDraft = () => {
    Modal.confirm({
      title: 'Save as Draft',
      content: 'Do you want to submit this lab to Store for collaboration?',
      onOk: () => {
        notification.success({
          message: 'Lab Submitted Successfully!',
          description: 'Redirecting to welcome page in 5 seconds...',
        });
        setTimeout(() => {
          window.location.href = '/trainer/welcome';
        }, 5000);
      },
      onCancel: () => {
        notification.success({ message: 'Draft Saved Successfully!' });
      },
    });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleInsert}
        initialValues={{ title: '', description: '', videoUrl: '' }}
      >
        <Form.Item name="title" label="Video Title" rules={[{ required: true }]}>
          <Input placeholder="Enter video title" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Enter video description" />
        </Form.Item>

        <Form.Item name="videoUrl" label="Video URL" rules={[{ required: true }]}>
          <Input placeholder="Enter YouTube embed URL" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Insert
        </Button>
      </Form>

      <div className="mt-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-bgColer mb-2 rounded shadow-sm"
          >
            <div>
              <p className="font-bold text-textColer">{video.title}</p>
              <p className="text-muted-foreground">{video.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  setCurrentVideoUrl(video.videoUrl);
                  setIsVideoModalVisible(true);
                }}
              />
              <Button icon={<EditOutlined />} onClick={() => handleEdit(index)} />
              <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(index)} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleDraft}>
          Draft
        </Button>
      </div>

      <Modal
        visible={isVideoModalVisible}
        footer={null}
        onCancel={() => setIsVideoModalVisible(false)}
        width={800}
      >
        <iframe
          width="100%"
          height="450"
          src={currentVideoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>
    </div>
  );
};

export default Step2Form;