// src/components/Step1Form.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Table,
  Image,
  notification,
  Input as SearchInput,
} from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createLabInformation,
  getLabInformation,
} from "./../../../redux/slices/labSlice";
import { fetchCombos } from "./../../../redux/slices/comboSlice";
import { uploadFiles } from "./../../../api/apiConfig";

const { TextArea } = Input;

const Step1Form = ({ onSubmit, initialData, goToStep2 }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    combos,
    loading: comboLoading,
    totalCount,
    pageIndex,
    pageSize,
  } = useSelector((state) => state.combo);
  const { labInfo, loading: labLoading } = useSelector((state) => state.lab);
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://i.pinimg.com/736x/5c/ab/fd/5cabfdca18c19e5cecd8c0c62e8cc697.jpg"
  );
  const [videoUrl, setVideoUrl] = useState(
    initialData?.previewVideoUrl ||
      "https://www.youtube.com/embed/tkDw607lm4U?si=i6QDwoRLNdHCNYJ9"
  );
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!initialData); // Ban đầu dựa trên initialData
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(
    initialData?.comboId || null
  );
  const [uploading, setUploading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch combos khi component mount và cập nhật lại khi có initialData
  useEffect(() => {
    dispatch(fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: "" }));
    if (initialData?.labId) {
      dispatch(getLabInformation(initialData.labId));
    }
    // Khi có initialData (tức là quay lại từ Step 2), cho phép chỉnh sửa
    if (initialData) {
      setIsEditMode(false); // Đặt lại isEditMode để hiển thị nút Edit/Next
    }
  }, [dispatch, initialData]);

  const handleFinish = async (values) => {
    const labData = {
      title: values.title,
      summary: values.summary,
      comboId: selectedCombo,
      description: values.description,
      serialNumber: `LAB${Math.floor(Math.random() * 1000)}`,
      imageUrl,
      previewVideoUrl: videoUrl,
      price: parseFloat(values.price),
    };

    try {
      const response = await dispatch(createLabInformation(labData)).unwrap();
      notification.success({ message: "Lab created successfully!" });
      onSubmit({ ...labData, labId: response?.labId });
    } catch (error) {
      notification.error({
        message: "Failed to create lab",
        description: error.message,
      });
    }
  };

  const handleComboSelect = (comboId) => {
    setSelectedCombo(comboId);
    setIsComboModalVisible(false);
    form.setFieldsValue({ comboId });
  };

  const uploadProps = {
    beforeUpload: async (file) => {
      setUploading(true);
      try {
        const fileId = await uploadFiles(file);
        setImageUrl(fileId);
        notification.success({ message: "Image uploaded successfully!" });
      } catch (error) {
        notification.error({
          message: "Failed to upload image",
          description: error.message,
        });
      } finally {
        setUploading(false);
      }
      return false;
    },
    showUploadList: false,
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    dispatch(fetchCombos({ pageIndex: 1, pageSize, searchKeyword: value }));
  };

  const handleTableChange = (pagination) => {
    dispatch(
      fetchCombos({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        searchKeyword,
      })
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          width={50}
          src={imageUrl || "https://via.placeholder.com/50"}
          alt="Combo Image"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-bold">{text}</span>,
    },
    {
      title: "Store",
      dataIndex: "storeNavigationName",
      key: "storeNavigationName",
      render: (text) => <span>{text || "Unknown Store"}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>${text}</span>,
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        title: initialData?.title || labInfo?.title,
        summary: initialData?.summary || labInfo?.summary,
        comboId: initialData?.comboId || labInfo?.comboId || null,
        description: initialData?.description || labInfo?.description,
        price: initialData?.price || labInfo?.price,
      }}
      disabled={!isEditMode && initialData} // Disable form khi không ở edit mode và có initialData
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Enter lab title" />
      </Form.Item>

      <Form.Item name="summary" label="Summary" rules={[{ required: true }]}>
        <Input placeholder="Enter lab summary" />
      </Form.Item>

      <Form.Item
        label="Combo"
        rules={[{ required: true, message: "Please select a combo" }]}
      >
        <Input
          value={
            selectedCombo
              ? combos.find((combo) => combo.id === selectedCombo)?.name
              : ""
          }
          placeholder="Select a combo"
          readOnly
          onClick={() => setIsComboModalVisible(true)}
          className="cursor-pointer"
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <TextArea rows={4} placeholder="Enter lab description" />
      </Form.Item>

      <Form.Item label="Image">
        <Upload {...uploadProps} listType="picture" maxCount={1}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            Upload Image
          </Button>
        </Upload>
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="preview"
              className="w-32 h-32 object-cover rounded"
            />
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => setImageUrl("")}
              className="mt-2"
            >
              Delete
            </Button>
          </div>
        )}
      </Form.Item>

      <Form.Item label="Preview Video">
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube embed URL"
          addonAfter={
            <EyeOutlined onClick={() => setIsVideoModalVisible(true)} />
          }
        />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <Input type="number" placeholder="Enter price" />
      </Form.Item>

      <div className="flex justify-end gap-4">
        {initialData && !isEditMode ? (
          <>
            <Button onClick={goToStep2} disabled={labLoading || comboLoading}>
              Next
            </Button>
            <Button
              onClick={() => setIsEditMode(true)}
              disabled={labLoading || comboLoading}
            >
              Edit
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={labLoading || comboLoading}
          >
            Submit
          </Button>
        )}
      </div>

      {/* Modal for Video Preview */}
      <Modal
        visible={isVideoModalVisible}
        footer={null}
        onCancel={() => setIsVideoModalVisible(false)}
        width={800}
      >
        <iframe
          width="100%"
          height="450"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>

      {/* Modal for Combo Selection */}
      <Modal
        title="Select a Combo"
        visible={isComboModalVisible}
        onCancel={() => setIsComboModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsComboModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => handleComboSelect(selectedCombo)}
            disabled={!selectedCombo}
          >
            Save
          </Button>,
        ]}
        width={800}
      >
        <SearchInput
          placeholder="Search combos by name"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Table
          loading={comboLoading}
          dataSource={combos}
          columns={columns}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => setSelectedCombo(record.id),
            className: `${
              selectedCombo === record.id ? "bg-bgColer" : ""
            } cursor-pointer`,
          })}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            onChange: (page, pageSize) =>
              handleTableChange({ current: page, pageSize }),
          }}
        />
      </Modal>
    </Form>
  );
};

Step1Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    comboId: PropTypes.number,
    description: PropTypes.string,
    serialNumber: PropTypes.string,
    imageUrl: PropTypes.string,
    previewVideoUrl: PropTypes.string,
    price: PropTypes.number,
    labId: PropTypes.number,
  }),
  goToStep2: PropTypes.func.isRequired,
};

Step1Form.defaultProps = {
  initialData: {},
};

export default Step1Form;
