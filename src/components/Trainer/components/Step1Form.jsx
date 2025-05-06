import { useState, useEffect, useRef } from "react";
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
  InputNumber,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  RightCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getLabInformation,
  uploadLabVideo,
  updateLabInformation,
} from "./../../../redux/slices/labSlice";
import { fetchCombos } from "./../../../redux/slices/comboSlice";
import { uploadFiles } from "./../../../api/apiConfig";
import PropTypes from "prop-types";
import {
  validateSummary,
  validateDescription,
} from "./../../../pages/validators";
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
  const [videoUrl, setVideoUrl] = useState(initialData?.previewVideoUrl || "");
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!initialData);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(
    initialData?.comboId || null
  );
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: "" }));
    if (initialData?.labId && !hasFetchedRef.current) {
      console.log("Fetching lab info for labId:", initialData.labId);
      dispatch(getLabInformation(initialData.labId));
      hasFetchedRef.current = true;
    }
  }, [dispatch, initialData?.labId]);

  useEffect(() => {
    console.log("Lab state:", labInfo);
    if (initialData?.labId && labInfo) {
      console.log("Lab info received:", labInfo);
      form.setFieldsValue({
        title: labInfo.title,
        summary: labInfo.summary,
        comboId: labInfo.comboId,
        serialNumber: labInfo.serialNumber,
        description: labInfo.description,
        price: labInfo.price,
      });
      setImageUrl(labInfo.imageUrl || imageUrl);
      setVideoUrl(labInfo.previewVideoUrl || videoUrl);
      setSelectedCombo(labInfo.comboId || null);
    }
  }, [labInfo, form, initialData?.labId, imageUrl, videoUrl]);

  useEffect(() => {
    if (videoFile && isEditMode) {
      const uploadVideo = async () => {
        setUploading(true);
        try {
          const result = await dispatch(uploadLabVideo(videoFile)).unwrap();
          setVideoUrl(result.id);
          notification.success({ message: "Video uploaded successfully!" });
        } catch (err) {
          console.error("Auto-upload video failed:", err);
          notification.error({
            message: "Failed to upload video",
            description: err?.message || "Unknown error",
          });
          setVideoFile(null);
        } finally {
          setUploading(false);
        }
      };
      uploadVideo();
    }
  }, [videoFile, dispatch, isEditMode]);

  const handleFinish = async (values) => {
    if (!initialData?.labId) {
      notification.error({
        message: "No lab ID provided",
        description: "Please provide a lab ID to update",
      });
      return;
    }

    const labData = {
      title: values.title,
      summary: values.summary,
      serialNumber: values.serialNumber,
      comboId: selectedCombo,
      description: values.description,
      imageUrl,
      previewVideoUrl: videoUrl,
      price: parseFloat(values.price),
    };

    try {
      await dispatch(
        updateLabInformation({ labId: initialData.labId, data: labData })
      ).unwrap();
      notification.success({ message: "Lab updated successfully!" });
      onSubmit({ ...labData, labId: initialData.labId });
      setIsEditMode(false);
      goToStep2();
    } catch (error) {
      notification.error({
        message: "Failed to update lab",
        description: error.message,
      });
    }
  };

  const handleComboSelect = (comboId) => {
    setSelectedCombo(comboId);
    setIsComboModalVisible(false);
    form.setFieldsValue({ comboId });
  };

  const handleVideoFileChange = (info) => {
    if (isEditMode) {
      const selectedFile = info.fileList[0]?.originFileObj;
      if (selectedFile) {
        setVideoFile(selectedFile);
      }
    }
  };

  const uploadImageProps = {
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
    disabled: uploading || !isEditMode,
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
        title: labInfo?.title || initialData?.title,
        summary: labInfo?.summary || initialData?.summary,
        comboId: labInfo?.comboId || initialData?.comboId,
        description: labInfo?.description || initialData?.description,
        price: labInfo?.price || initialData?.price,
      }}
      disabled={!isEditMode && !!initialData?.labId}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Lab Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          name="title"
          label={
            <span>
              Title{" "}
              <Tooltip title="Enter a unique title for the lab">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Please enter a title" }]}
          className="mb-4"
        >
          <Input placeholder="Enter lab title" size="large" />
        </Form.Item>
        <Form.Item
          name="serialNumber"
          label={
            <span>
              Serial Number{" "}
              <Tooltip title="Enter a unique serial number for the lab">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Please enter a serial number" }, { max: 15, message: "Serial Number must not exceed 15 characters" },]}
        >
          <Input
            placeholder="Enter serial number"
            size="large"
            className="rounded-md border-gray-300"
            maxLength={15}
          />
        </Form.Item>
      </div>
      <Form.Item
        name="summary"
        label={
          <span>
            Summary{" "}
            <Tooltip title="Provide a brief summary of the lab">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, validator: validateSummary }]}
        className="mb-4"
      >
        <Input placeholder="Enter lab summary" size="large" />
      </Form.Item>
      <Form.Item
        label={
          <span>
            Combo{" "}
            <Tooltip title="Select a combo associated with this lab">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: "Please select a combo" }]}
        className="mb-4"
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
          className="cursor-pointer border-2 border-gray-300 rounded-lg p-2 hover:border-blue-500 transition-colors"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="description"
        label={
          <span>
            Description{" "}
            <Tooltip title="Enter detailed description of the lab">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, validator: validateDescription }]}
        className="mb-4"
      >
        <TextArea
          rows={4}
          placeholder="Enter lab description"
          size="large"
          className="resize-vertical"
        />
      </Form.Item>

      <div className="grid grid-cols-1 gap-8">
        <Form.Item
          label={<span className="text-lg font-medium">Image</span>}
          className="mb-6"
        >
          <div className="flex flex-col items-center">
            <Upload {...uploadImageProps} listType="picture" maxCount={1}>
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                size="large"
                className={`w-64 ${
                  uploading ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600 transition-colors`}
                disabled={uploading || !isEditMode}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Upload>
            {imageUrl && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="relative group w-[300px] h-[200px]">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-300 transition-transform group-hover:scale-105 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-lg transition-opacity">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="middle"
                      onClick={() => setImageUrl("")}
                      disabled={!isEditMode}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-red"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item
          label={<span className="text-lg font-medium">Preview Video</span>}
          className="mb-6"
        >
          <div className="flex flex-col items-center">
            <Upload {...uploadVideoProps}>
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                size="large"
                className={`w-64 ${
                  uploading ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600 transition-colors`}
                disabled={uploading || !isEditMode}
              >
                {uploading ? "Uploading..." : "Select Video"}
              </Button>
            </Upload>
            {videoUrl && (
              <div className="mt-6 flex flex-col items-center gap-4 w-full">
                <div className="relative group w-[300px] h-[200px]">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover rounded-lg border border-gray-300 transition-transform group-hover:scale-105 shadow-md"
                    muted
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-lg transition-opacity">
                    <Button
                      icon={<EyeOutlined />}
                      size="middle"
                      onClick={() => setIsVideoModalVisible(true)}
                      className="opacity-0 group-hover:opacity-100 text-white bg-blue-500 hover:bg-blue-600 transition-opacity mr-2"
                    >
                      View
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="middle"
                      onClick={() => {
                        setVideoUrl("");
                        setVideoFile(null);
                      }}
                      disabled={!isEditMode}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-red"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form.Item>
      </div>

      <Form.Item
        name="price"
        label={
          <span>
            Price ($){" "}
            <Tooltip title="Enter the price for this lab">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: "Please enter a price" }]}
        className="mb-4"
      >
        {/* <Input type="number" placeholder="Enter price" size="large" /> */}
          <InputNumber
                            min={0}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            placeholder="Enter price in VND"
                            style={{ width: "100%" }}
                          />
      </Form.Item>
      <div className="flex justify-end gap-4 mt-6">
        {initialData?.labId && !isEditMode ? (
          <>
            <Button
              onClick={goToStep2}
              disabled={labLoading || comboLoading}
              size="large"
              className="bg-white-500 text-blue"
            >
              <RightCircleOutlined />
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEditMode(true)}
              disabled={labLoading || comboLoading}
              size="large"
              className="bg-yellow-500 text-blue "
            >
              {" "}
              Edit
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={labLoading || comboLoading}
            size="large"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Update
          </Button>
        )}
      </div>
      <Modal
        visible={isVideoModalVisible}
        footer={null}
        onCancel={() => setIsVideoModalVisible(false)}
        width={900}
        className="rounded-lg"
      >
        <video
          controls
          src={videoUrl}
          className="w-full rounded-lg"
          style={{ maxHeight: "500px" }}
        >
          Your browser does not support the video tag.
        </video>
      </Modal>
      <Modal
        title={<span className="text-xl font-semibold">Select a Combo</span>}
        visible={isComboModalVisible}
        onCancel={() => setIsComboModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsComboModalVisible(false)}
            size="large"
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => handleComboSelect(selectedCombo)}
            disabled={!selectedCombo}
            size="large"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save
          </Button>,
        ]}
        width={1000}
        className="rounded-lg"
      >
        <SearchInput
          placeholder="Search combos by name"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          size="large"
          style={{ marginBottom: 16, width: "100%" }}
          className="mb-4"
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
            } cursor-pointer hover:bg-gray-100 transition-colors`,
          })}
          pagination={{
            current: pageIndex,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            onChange: (page, pageSize) =>
              handleTableChange({ current: page, pageSize }),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            className: "mt-4",
          }}
          className="rounded-lg shadow-md"
          size="middle"
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
    labId: PropTypes.number.isRequired,
  }),
  goToStep2: PropTypes.func.isRequired,
};

Step1Form.defaultProps = {
  initialData: {},
};

export default Step1Form;
