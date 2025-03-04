import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Pagination,
  Button,
  Image,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  InputNumber,
  notification,
  DatePicker,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  EditOutlined,
  EllipsisOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  fetchCombos,
  fetchComboDetails,
  createCombo,
  fetchIotDevices,
  setPageIndex,
  setSearchKeyword,
  setStartFilterDate,
  setEndFilterDate,
  updateCombo,
} from "../../redux/slices/comboSlice";
import { getStoreDetails } from "../../redux/slices/storeRegistrationSlice";
import { uploadFiles } from "../../api/apiConfig";
import DeviceSelectionTable from "./components/DeviceSelectionTable";

const ComboTable = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  // 🛠 Lấy dữ liệu từ Redux store hoặc localStorage
  const {
    combos,
    loading,
    totalCount,
    pageIndex,
    pageSize,
    iotDevices,
    storeId,
    userId,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  } = useSelector((state) => ({
    combos: state.combo.combos || [],
    totalCount: state.combo.totalCount || 0,
    pageIndex: state.combo.pageIndex || 0,
    pageSize: state.combo.pageSize || 10,
    iotDevices: Array.isArray(state.combo.iotDevices)
      ? state.combo.iotDevices
      : [],
    storeId:
      state.storeRegistration.store?.id ||
      localStorage.getItem("storeId") ||
      null,
    loading: state.combo.loading,
    
  }));

  // 🛠 Fetch dữ liệu khi component mount
  useEffect(() => {
    dispatch(fetchCombos({ pageIndex: 0, pageSize: 10, searchKeyword: "", startFilterDate: startFilterDate,  endFilterDate: endFilterDate,}));
    dispatch(
      fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
    );

    const storedUserId = localStorage.getItem("userId");

    if (storedUserId && !storeId) {
      console.log("📡 Fetching store details for userId:", storedUserId);
      dispatch(getStoreDetails(storedUserId)).then((res) => {
        if (res.payload?.data?.id) {
          console.log("✅ Store ID fetched & saved:", res.payload.data.id);
        } else {
          console.error("❌ Failed to fetch store ID!");
        }
      });
    }
  }, [dispatch, storeId, searchKeyword, 
     startFilterDate,
    endFilterDate,]);

  // 🛠 Xử lý tìm kiếm
  const handleSearch = (values) => {
    dispatch(setSearchKeyword(values.searchKeyword));
    dispatch(setStartFilterDate(values.startFilterDate?.toISOString() || ""));
    dispatch(setEndFilterDate(values.endFilterDate?.toISOString() || ""));
    dispatch(setPageIndex(1));
  };

  
  // 🛠 Xử lý upload file
  const handleFileUpload = async ({ file }) => {
    try {
      const imageUrl = await uploadFiles(file);
      setFileList((prevList) => [
        ...prevList,
        { id: imageUrl, imageUrl: imageUrl, metaData: "" },
      ]);
      console.log("✅ Image uploaded:", imageUrl);
    } catch (error) {
      console.error("❌ File upload failed:", error);
    }
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.imageUrl !== file.url));
  };

  const handleShowDetailModal = async (comboId) => {
    const response = await dispatch(fetchComboDetails(comboId));
    setSelectedCombo(response.payload.data);
    setIsDetailModalVisible(true);
  };

  // Xử lý mở modal tạo combo
  const handleOpenModal = async () => {
    let currentStoreId = storeId || localStorage.getItem("storeId");

    if (!currentStoreId && userId) {
      console.log("📡 Fetching storeId for user:", userId);
      const res = await dispatch(getStoreDetails(userId));

      if (res.payload?.data?.id) {
        currentStoreId = res.payload.data.id;
        console.log("✅ Store ID fetched:", currentStoreId);
      } else {
        console.error("❌ Cannot open modal - Store ID is missing!");
        return;
      }
    }
    setSelectedCombo(null);
    setFileList([]);
    setSelectedDevices([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateCombo = async (values) => {
    let currentStoreId = localStorage.getItem("storeId");

    if (!currentStoreId) {
      console.error("❌ Store ID is missing! Fetching now...");
      const res = await dispatch(getStoreDetails(userId));

      if (res.payload?.data?.id) {
        currentStoreId = res.payload.data.id;
        console.log("✅ Store ID fetched:", currentStoreId);
      } else {
        console.error("❌ Store ID is still missing! Cannot submit.");
        notification.error({
          message: "Store ID Error",
          description: "Failed to fetch store ID. Please try again.",
        });
        return;
      }
    }

    //  Xử lý ảnh đại diện
    let mainImageUrl =
      values.imageUrl?.trim() ||
      (fileList.length > 0 ? fileList[0].imageUrl : "");

    if (!mainImageUrl) {
      notification.warning({
        message: "Image Required",
        description: "Please provide an image URL or upload an image.",
      });
      return;
    }

    //  Kiểm tra nếu không có thiết bị
    if (!selectedDevices.length) {
      notification.warning({
        message: "Device Selection Required",
        description: "Please select at least one device for the combo.",
      });
      return;
    }
    const validAttachments = fileList
      .filter((file) => file.imageUrl !== mainImageUrl)
      .map((file) => ({
        imageUrl: file.imageUrl,
        metaData: file.metaData || "",
      }));
    const comboData = {
      ...values,
      storeId: currentStoreId,
      imageUrl: mainImageUrl,
      deviceComboList: selectedDevices.map((device) => ({
        iotDeviceId: device.iotDeviceId,
        amount: device.amount,
      })),
      attachmentsList: validAttachments,
    };

    console.log("📡 Sending Payload:", JSON.stringify(comboData, null, 2));

    try {
      await dispatch(createCombo(comboData)).unwrap();
      notification.success({
        message: "Combo Created",
        description: "The combo has been successfully created.",
      });
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("❌ Error creating combo:", error);
      notification.error({
        message: "Creation Failed",
        description: error || "Failed to create combo. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (selectedCombo?.deviceComboList) {
      setSelectedDevices(selectedCombo.deviceComboList);
    }
  }, [selectedCombo]);

  const handleOpenUpdateModal = async (comboId) => {
    try {
      const response = await dispatch(fetchComboDetails(comboId));
      if (!response.payload?.data) {
        notification.error({
          message: "Error",
          description: "Failed to fetch combo details.",
        });
        return;
      }

      const combo = response.payload.data;

      //  Cập nhật form fields
      form.setFieldsValue({
        name: combo.name,
        summary: combo.summary,
        description: combo.description,
        specifications: combo.specifications,
        notes: combo.notes,
        serialNumber: combo.serialNumber,
        applicationSerialNumber: combo.applicationSerialNumber,
        price: combo.price,
        quantity: combo.quantity,
      });

      //  Load danh sách ảnh
      setFileList([
        { id: combo.imageUrl, imageUrl: combo.imageUrl },
        ...(combo.attachmentsList || []).map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
        })),
      ]);

      //  Load danh sách thiết bị
      setSelectedDevices(
        (combo.deviceComboList || []).map((device) => ({
          iotDeviceId: device.iotDeviceId, 
          id: device.iotDeviceId, 
          name: device.deviceName,
          amount: device.amount,
        }))
      );

      setIsUpdateModalVisible(true);
    } catch (error) {
      console.error("❌ Error fetching combo details:", error);
      notification.error({
        message: "Fetch Error",
        description: "Failed to load combo details. Please try again.",
      });
    }
  };

  const handleUpdateCombo = async (values) => {
    if (!selectedCombo) {
      notification.error({
        message: "Update Error",
        description: "No combo selected for update.",
      });
      return;
    }

    // Lấy imageUrl từ form hoặc danh sách fileList
    let mainImageUrl =
      values.imageUrl?.trim() ||
      (fileList.length > 0 ? fileList[0].imageUrl : selectedCombo.imageUrl);

    if (!mainImageUrl) {
      notification.warning({
        message: "Image Required",
        description: "Please provide an image URL or upload an image.",
      });
      return;
    }

    //  Kiểm tra danh sách ảnh bổ sung 
    const validAttachments = fileList
      .filter((file) => file.imageUrl !== mainImageUrl)
      .map((file) => ({
        imageUrl: file.imageUrl,
        metaData: file.metaData || "",
      }));

    if (validAttachments.length === 0) {
      notification.warning({
        message: "Additional Images Required",
        description: "Please upload at least one additional image.",
      });
      return;
    }

    // ✅ Kiểm tra danh sách thiết bị
    if (!selectedDevices.length) {
      notification.warning({
        message: "Device Selection Required",
        description: "Please select at least one device for the combo.",
      });
      return;
    }

    // ✅ Chuẩn bị dữ liệu gửi API
    const comboData = {
      ...values,
      comboId: selectedCombo.id,
      imageUrl: mainImageUrl,
      attachmentsList: validAttachments,
      deviceComboList: selectedDevices.map((device) => ({
        iotDeviceId: device.iotDeviceId, // ✅ Đảm bảo có iotDeviceId
        amount: device.amount,
      })),
    };

    console.log(
      "📡 Sending Update Payload:",
      JSON.stringify(comboData, null, 2)
    );

    try {
      await dispatch(
        updateCombo({ comboId: selectedCombo.id, comboData })
      ).unwrap();
      notification.success({
        message: "Update Successful",
        description: "Combo updated successfully!",
      });
      setIsUpdateModalVisible(false);
      dispatch(fetchCombos({ pageIndex: 0, pageSize: 10, searchKeyword: "" }));
    } catch (error) {
      console.error("❌ Update Combo Error:", error);
      notification.error({
        message: "Update Failed",
        description:
          error.message || "Failed to update combo. Please try again.",
        duration: 3, // Hiển thị thông báo 5 giây
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => <Image width={50} src={imageUrl} alt="combo" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleShowDetailModal(record.id)}>{text}</a>
      ),
    },
    { title: "Summary", dataIndex: "summary", key: "summary" },
    {
      title: "Serial Number",
      dataIndex: "applicationSerialNumber",
      key: "applicationSerialNumber",
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Deactive"}
        </Tag>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button type="primary" onClick={() => handleOpenUpdateModal(record.id)}>
    //       Update
    //     </Button>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: [
              record.isActive
                ? {
                    key: "2",
                    label: (
                      <span onClick={() => handleOpenModal(record, "deactive")}>
                        <CloseCircleOutlined className="text-red-500 mr-2" />
                        Deactivate
                      </span>
                    ),
                  }
                : {
                    key: "1",
                    label: (
                      <span onClick={() => handleOpenModal(record, "active")}>
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        Activate
                      </span>
                    ),
                  },
              {
                key: "3",
                label: (
                  <span
                    onClick={() => handleOpenUpdateModal(record.id)}
                  >
                    <EditOutlined className="text-black mr-2" />
                    Update Product
                  </span>
                ),
              },
            ],
          }}
          trigger={["click"]}
        >
          <EllipsisOutlined />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Combo List</h1>
        <div className="flex justify-between items-center mb-4">
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="searchKeyword">
              <Input placeholder="Search by name" />
            </Form.Item>
            <Form.Item name="startFilterDate">
              <DatePicker placeholder="Start Date" />
            </Form.Item>
            <Form.Item name="endFilterDate">
              <DatePicker placeholder="End Date" />
            </Form.Item>
            <Form.Item></Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Search
            </Button>
          </Form>
          <div>
            <Button
              type="primary"
              onClick={handleOpenModal}
              icon={<PlusOutlined />}
            >
              Create Combo
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={Array.isArray(combos) ? combos : []}
          loading={loading}
          rowKey="id"
          pagination={false}
          bordered
        />
        {/* <Pagination current={pageIndex} pageSize={pageSize} total={totalCount} onChange={(page) => dispatch(fetchCombos({ pageIndex: page, pageSize }))} /> */}
        <div className="flex justify-between items-center mt-4 p-2">
          <p>
            <span className="font-medium">
              {(pageIndex - 1) * pageSize + 1} to{" "}
              {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
            </span>
          </p>
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            showSizeChanger={true}
            pageSizeOptions={[10, 15, 30]}
            onChange={(page) => {
              dispatch(setPageIndex(page));
              dispatch(fetchCombos({ pageIndex: page, pageSize }));
            }}
          />
        </div>

        {/* Detail Modal */}
        <Modal
          title={
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {selectedCombo?.name || "Loading..."}
            </h2>
          }
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={
            [
              // <Button
              //   key="edit"
              //   type="primary"
              //   onClick={() => handleUpdateCombo(true)}
              // >
              //   Edit
              // </Button>,
            ]
          }
          width={900}
        >
          {selectedCombo ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "1", textAlign: "center" }}>
                <Image
                  width={300}
                  src={selectedCombo.imageUrl}
                  alt="combo"
                  style={{ borderRadius: "8px" }}
                />
                {Array.isArray(selectedCombo.attachmentsList) &&
                  selectedCombo.attachmentsList.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "10px",
                        justifyContent: "center",
                      }}
                    >
                      {selectedCombo.attachmentsList.map((attachment) => (
                        <Image
                          key={attachment.id}
                          width={80}
                          src={attachment.imageUrl}
                          alt="attachment"
                          style={{ borderRadius: "4px", cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  )}
              </div>
              <div style={{ flex: "2", fontSize: "16px" }}>
                <p>
                  <strong>Store:</strong> {selectedCombo.storeNavigationName}
                </p>
                <p>
                  <strong>Summary:</strong> {selectedCombo.summary}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCombo.description}
                </p>
                <p>
                  <strong>Specifications:</strong>{" "}
                  {selectedCombo.specifications}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedCombo.notes}
                </p>
                <p>
                  <strong>Serial Number:</strong> {selectedCombo.serialNumber}
                </p>
                <p>
                  <strong>Application Serial Number:</strong>{" "}
                  {selectedCombo.applicationSerialNumber}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  <span
                    style={{
                      color: "#ff4d4f",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedCombo.price} VND
                  </span>
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedCombo.quantity}
                </p>
                <p>
                  <strong>Created By:</strong> {selectedCombo.createdBy}
                </p>
                <p>
                  <strong>Updated By:</strong> {selectedCombo.updatedBy}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {selectedCombo.rating}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading details...</p>
          )}

          {selectedCombo?.deviceComboList?.length > 0 && (
            <Table
              title={() => "Device List"}
              dataSource={selectedCombo.deviceComboList}
              columns={[
                {
                  title: "Device Name",
                  dataIndex: "deviceName",
                  key: "deviceName",
                },
                { title: "Amount", dataIndex: "amount", key: "amount" },
                {
                  title: "Original Price",
                  dataIndex: "originalPrice",
                  key: "originalPrice",
                },
              ]}
              rowKey="deviceComboId"
              pagination={false}
            />
          )}
        </Modal>

        <Modal
          title="Create Combo"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateCombo}>
            {/* ✅ Upload ảnh chính */}
            <Form.Item label="Upload Main Image">
              <Upload
                customRequest={handleFileUpload}
                fileList={
                  fileList.length > 0
                    ? [
                        {
                          uid: fileList[0].id,
                          name: fileList[0].imageUrl,
                          url: fileList[0].imageUrl,
                          thumbUrl: fileList[0].imageUrl,
                        },
                      ]
                    : []
                }
                listType="picture-card"
                onRemove={() => setFileList([])}
                maxCount={1}
              >
                {fileList.length === 0 && <UploadOutlined />}
              </Upload>
            </Form.Item>

            {/* Combo Name */}
            <Form.Item
              name="name"
              label="Combo Name"
              rules={[{ required: true, message: "'Combo Name' is required" }]}
            >
              <Input placeholder="Enter combo name..." />
            </Form.Item>

            {/* Serial Number */}
            <Form.Item
              name="serialNumber"
              label="Serial Number"
              rules={[
                { required: true, message: "'Serial Number' is required" },
              ]}
            >
              <Input placeholder="Enter serial number..." />
            </Form.Item>

            {/* Summary */}
            <Form.Item
              name="summary"
              label="Summary"
              rules={[{ required: true, message: "'Summary' is required" }]}
            >
              <Input.TextArea placeholder="Short description of the combo..." />
            </Form.Item>

            {/* Description */}
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "'Description' is required" }]}
            >
              <Input.TextArea placeholder="Detailed description of the combo..." />
            </Form.Item>

            {/* Specifications */}
            <Form.Item name="specifications" label="Specifications">
              <Input.TextArea placeholder="Enter specifications..." />
            </Form.Item>

            {/* Notes */}
            <Form.Item name="notes" label="Notes">
              <Input.TextArea placeholder="Any additional notes..." />
            </Form.Item>

            {/* Price & Quantity (Side by Side) */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "'Price' is required" }]}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Enter price..."
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "'Quantity' is required" }]}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Enter quantity..."
                />
              </Form.Item>
            </div>

            {/* Upload Image */}
            <Form.Item label="Additional Images">
              <Upload
                customRequest={handleFileUpload}
                fileList={fileList.slice(1).map((file) => ({
                  uid: file.imageUrl,
                  name: file.imageUrl,
                  url: file.imageUrl,
                }))}
                listType="picture-card"
                onRemove={handleRemoveFile}
                onPreview={(file) => {
                  window.open(file.url, "_blank"); // ✅ Phóng to ảnh khi click
                }}
              >
                <UploadOutlined />
              </Upload>
            </Form.Item>

            {/* ✅ Sử dụng DeviceSelectionTable */}
            <DeviceSelectionTable
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              iotDevices={iotDevices}
            />

            {/* Submit Button */}
            <Form.Item className="mt-4">
              <Button type="primary" htmlType="submit" block>
                Create Combo
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Update Combo"
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          footer={null}
          width={900}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdateCombo}>
            <Form.Item label="Upload Main Image">
              <Upload
                customRequest={handleFileUpload}
                fileList={
                  fileList.length > 0
                    ? [
                        {
                          uid: fileList[0].id,
                          name: fileList[0].imageUrl,
                          url: fileList[0].imageUrl,
                          thumbUrl: fileList[0].imageUrl,
                        },
                      ]
                    : []
                }
                listType="picture-card"
                onRemove={() => setFileList([])}
                maxCount={1}
              >
                {fileList.length === 0 && <UploadOutlined />}
              </Upload>
            </Form.Item>

            {/* Combo Name */}
            <Form.Item
              name="name"
              label="Combo Name"
              rules={[{ required: true, message: "'Combo Name' is required" }]}
            >
              <Input placeholder="Enter combo name..." />
            </Form.Item>

            {/* Serial Number */}
            <Form.Item
              name="serialNumber"
              label="Serial Number"
              rules={[
                { required: true, message: "'Serial Number' is required" },
              ]}
            >
              <Input placeholder="Enter serial number..." />
            </Form.Item>

            {/* Summary */}
            <Form.Item
              name="summary"
              label="Summary"
              rules={[{ required: true, message: "'Summary' is required" }]}
            >
              <Input.TextArea placeholder="Short description of the combo..." />
            </Form.Item>

            {/* Description */}
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "'Description' is required" }]}
            >
              <Input.TextArea placeholder="Detailed description of the combo..." />
            </Form.Item>

            {/* Specifications */}
            <Form.Item name="specifications" label="Specifications">
              <Input.TextArea placeholder="Enter specifications..." />
            </Form.Item>

            {/* Notes */}
            <Form.Item name="notes" label="Notes">
              <Input.TextArea placeholder="Any additional notes..." />
            </Form.Item>

            {/* Price & Quantity (Side by Side) */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "'Price' is required" }]}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Enter price..."
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "'Quantity' is required" }]}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Enter quantity..."
                />
              </Form.Item>
            </div>

            {/* Upload Image */}
            <Form.Item label="Additional Images">
              <Upload
                customRequest={handleFileUpload}
                fileList={fileList.slice(1).map((file) => ({
                  uid: file.imageUrl,
                  name: file.imageUrl,
                  url: file.imageUrl,
                }))}
                listType="picture-card"
                onRemove={handleRemoveFile}
                onPreview={(file) => {
                  window.open(file.url, "_blank");
                }}
              >
                <UploadOutlined />
              </Upload>
            </Form.Item>

            {/* ✅ Sử dụng DeviceSelectionTable */}
            <DeviceSelectionTable
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              iotDevices={iotDevices}
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {" "}
                Update Combo{" "}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ComboTable;
