// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Form,
//   Input,
//   Upload,
//   InputNumber,
//   notification,
//   Button,
//   Card,
//   Typography,
//   Spin,
//   Modal,
// } from "antd";
// import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import {
//   fetchComboDetails,
//   updateCombo,
//   fetchIotDevices,
// } from "./../../../redux/slices/comboSlice";
// import { uploadFiles } from "./../../../api/apiConfig";
// import DeviceSelectionTable from "./DeviceSelectionTable";

// const { Title } = Typography;

// const ComboUpdatePage = () => {
//   const { comboId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [selectedDevices, setSelectedDevices] = useState([]);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [loading, setLoading] = useState(true);

//   const selectedCombo = useSelector((state) => state.combo.selectedCombo);

//   const iotDevices = useSelector((state) => state.combo.iotDevices || []);

//   useEffect(() => {
//     if (!comboId || comboId === "undefined") {
//       notification.error({
//         message: "Invalid Combo ID",
//         description: "No valid combo ID provided. Redirecting...",
//       });
//       navigate("/store/combo-managerment");
//       return;
//     }

//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const response = await dispatch(fetchComboDetails(comboId)).unwrap();
//         dispatch({ type: "combo/setSelectedCombo", payload: response.data });

//         await dispatch(
//           fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
//         ).unwrap();
//       } catch (error) {
//         notification.error({
//           message: "Error",
//           description: error.message || "Failed to load combo details.",
//         });
//         navigate("/store/combo-managerment");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [dispatch, comboId, navigate]);

//   useEffect(() => {
//     if (!selectedCombo || !selectedCombo.data || !selectedCombo.data.id) return;
//     console.log("Updating form with fetched combo:", selectedCombo.data);

//     form.setFieldsValue({
//       name: selectedCombo.data.name,
//       summary: selectedCombo.data.summary,
//       description: selectedCombo.data.description,
//       specifications: selectedCombo.data.specifications,
//       notes: selectedCombo.data.notes,
//       serialNumber: selectedCombo.data.serialNumber,
//       applicationSerialNumber: selectedCombo.data.applicationSerialNumber,
//       price: selectedCombo.data.price,
//       quantity: selectedCombo.data.quantity,
//     });

//     setFileList([
//       ...(selectedCombo.data.imageUrl
//         ? [
//             {
//               id: selectedCombo.data.imageUrl,
//               imageUrl: selectedCombo.data.imageUrl,
//             },
//           ]
//         : []),
//       ...(selectedCombo.data.attachmentsList || []).map((img) => ({
//         id: img.id,
//         imageUrl: img.imageUrl,
//       })),
//     ]);

//     setSelectedDevices(
//       (selectedCombo.data.deviceComboList || []).map((device) => ({
//         deviceComboId: device.deviceComboId,
//         iotDeviceId: device.iotDeviceId,
//         id: device.iotDeviceId,
//         name: device.deviceName,
//         amount: device.amount,
//       }))
//     );
//   }, [selectedCombo, form]);
//   // useEffect(() => {
//   //   if (!selectedCombo || !selectedCombo.id) return;
//   //   console.log("Updating form with fetched combo:", selectedCombo);

//   //   form.setFieldsValue({
//   //     name: selectedCombo.name,
//   //     summary: selectedCombo.summary,
//   //     description: selectedCombo.description,
//   //     specifications: selectedCombo.specifications,
//   //     notes: selectedCombo.notes,
//   //     serialNumber: selectedCombo.serialNumber,
//   //     applicationSerialNumber: selectedCombo.applicationSerialNumber,
//   //     price: selectedCombo.price,
//   //     quantity: selectedCombo.quantity,
//   //   });

//   //   setFileList([
//   //     { id: selectedCombo.imageUrl, imageUrl: selectedCombo.imageUrl },
//   //     ...(selectedCombo.attachmentsList || []).map((img) => ({
//   //       id: img.id,
//   //       imageUrl: img.imageUrl,
//   //     })),
//   //   ]);

//   //   setSelectedDevices(
//   //     (selectedCombo.deviceComboList || []).map((device) => ({
//   //       iotDeviceId: device.iotDeviceId,
//   //       id: device.iotDeviceId,
//   //       name: device.deviceName,
//   //       amount: device.amount,
//   //     }))
//   //   );
//   // }, [selectedCombo, form]);

//   const handleFileUpload = async ({ file }) => {
//     try {
//       const imageUrl = await uploadFiles(file);
//       setFileList((prevList) => [
//         ...prevList,
//         { id: imageUrl, imageUrl, metaData: "" },
//       ]);
//     } catch (error) {
//       console.error("❌ File upload failed", error);
//     }
//   };

//   const handleRemoveFile = (file) => {
//     setFileList((prev) => prev.filter((f) => f.imageUrl !== file.url));
//   };

//   const handleUpdateCombo = async (values) => {
//     if (!selectedCombo) {
//       notification.error({
//         message: "Update Error",
//         description: "No combo selected for update.",
//       });
//       return;
//     }

//     let mainImageUrl =
//       values.imageUrl?.trim() ||
//       (fileList.length > 0
//         ? fileList[0].imageUrl
//         : selectedCombo.data.imageUrl);

//     if (!mainImageUrl) {
//       notification.warning({
//         message: "Image Required",
//         description: "Please provide an image URL or upload an image.",
//       });
//       return;
//     }

//     // Check if at least one device is selected
//     if (selectedDevices.length === 0) {
//       notification.warning({
//         message: "Device Selection Error",
//         description: "Please select at least one device for the combo.",
//       });
//       return;
//     }

//     const validAttachments = fileList
//       .filter((file) => file.imageUrl && file.imageUrl !== mainImageUrl)
//       .map((file) => ({
//         imageUrl: file.imageUrl,
//         metaData: file.metaData || "",
//       }));

//     // 🚀 Only update if devices were added or removed
//     const existingDevices = selectedCombo.data.deviceComboList || [];

//     // Get the current list of devices (including new devices and those removed)
//     const updatedDevicesMap = new Map();

//     selectedDevices.forEach((device) => {
//       updatedDevicesMap.set(device.iotDeviceId, {
//         deviceComboId: device.deviceComboId,

//         iotDeviceId: device.iotDeviceId,
//         deviceName: device.name,
//         deviceSummary: device.summary || "",
//         amount: device.amount,
//         originalPrice: device.originalPrice || 0,
//         imageUrl: device.imageUrl || "",
//       });
//     });

//     // Filter out any devices that the user has deleted (if any)
//     const updatedDevices = Array.from(updatedDevicesMap.values());

//     // If no devices were changed (added or deleted), return early to avoid duplication
//     if (
//       updatedDevices.length === existingDevices.length &&
//       updatedDevices.every(
//         (dev, index) => dev.iotDeviceId === existingDevices[index].iotDeviceId
//       )
//     ) {
//       notification.info({
//         message: "No Changes",
//         description:
//           "No devices were added or removed, so no update is necessary.",
//       });
//       return;
//     }

//     const comboData = {
//       ...values,
//       comboId: selectedCombo.data.id,
//       imageUrl: mainImageUrl,
//       attachmentsList: validAttachments,
//       deviceComboList: updatedDevices,
//     };

//     try {
//       await dispatch(
//         updateCombo({ comboId: selectedCombo.data.id, comboData })
//       ).unwrap();
//       notification.success({
//         message: "Update Successful",
//         description: "Combo updated successfully!",
//       });
//       navigate("/store/combo-managerment");
//     } catch (error) {
//       notification.error("❌ Update Combo Error:", error);
//       notification.error({
//         message: "Update Failed",
//         description: error,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
//         <div className="flex items-center justify-between mb-6">
//           <Button
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/store/combo-managerment")}
//             className="mr-4"
//           >
//             Back
//           </Button>
//           <Title level={2} className="text-gray-800 ">
//             Edit combo
//           </Title>

//         </div>

//         <Form form={form} layout="vertical" onFinish={handleUpdateCombo}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Form.Item label="Upload Main Image">
//                 <Upload
//                   customRequest={handleFileUpload}
//                   fileList={
//                     fileList.length > 0
//                       ? [
//                           {
//                             uid: fileList[0].id,
//                             name: fileList[0].imageUrl,
//                             url: fileList[0].imageUrl,
//                             thumbUrl: fileList[0].imageUrl,
//                           },
//                         ]
//                       : []
//                   }
//                   listType="picture-card"
//                   onRemove={() => setFileList([])}
//                   maxCount={1}
//                   onPreview={(file) => {
//                     setPreviewImage(file.url || file.thumbUrl);
//                     setPreviewVisible(true);
//                   }}
//                 >
//                   {fileList.length === 0 && <UploadOutlined />}
//                 </Upload>
//               </Form.Item>

//               <Form.Item
//                 name="name"
//                 label="Combo Name"
//                 rules={[
//                   { required: true, message: "'Combo Name' is required" },
//                 ]}
//               >
//                 <Input placeholder="Enter combo name..." />
//               </Form.Item>

//               <Form.Item
//                 name="serialNumber"
//                 label="Serial Number"
//                 rules={[
//                   { required: true, message: "'Serial Number' is required" },
//                 ]}
//               >
//                 <Input placeholder="Enter serial number..." />
//               </Form.Item>

//               <Form.Item
//                 name="summary"
//                 label="Summary"
//                 rules={[{ required: true, message: "'Summary' is required" }]}
//               >
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Short description of the combo..."
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="description"
//                 label="Description"
//                 rules={[
//                   { required: true, message: "'Description' is required" },
//                 ]}
//               >
//                 <Input.TextArea
//                   rows={4}
//                   placeholder="Detailed description of the combo..."
//                 />
//               </Form.Item>
//             </div>

//             <div>
//               <Form.Item name="specifications" label="Specifications">
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Enter specifications..."
//                 />
//               </Form.Item>

//               <Form.Item name="notes" label="Notes">
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Any additional notes..."
//                 />
//               </Form.Item>

//               <div className="grid grid-cols-2 gap-4">
//                 <Form.Item
//                   name="price"
//                   label="Price"
//                   rules={[{ required: true, message: "'Price' is required" }]}
//                 >
//                   <InputNumber
//                     min={0}
//                     className="w-full"
//                     placeholder="Enter price..."
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   name="quantity"
//                   label="Quantity"
//                   rules={[
//                     { required: true, message: "'Quantity' is required" },
//                   ]}
//                 >
//                   <InputNumber
//                     min={1}
//                     className="w-full"
//                     placeholder="Enter quantity..."
//                   />
//                 </Form.Item>
//               </div>

//               <Form.Item label="Additional Images">
//                 <Upload
//                   customRequest={handleFileUpload}
//                   fileList={fileList.slice(1).map((file) => ({
//                     uid: file.imageUrl,
//                     name: file.imageUrl,
//                     url: file.imageUrl,
//                   }))}
//                   listType="picture-card"
//                   onRemove={handleRemoveFile}
//                   onPreview={(file) => {
//                     setPreviewImage(file.url || file.thumbUrl);
//                     setPreviewVisible(true);
//                   }}
//                 >
//                   <UploadOutlined />
//                 </Upload>
//               </Form.Item>
//             </div>
//           </div>

//           <DeviceSelectionTable
//             selectedDevices={selectedDevices}
//             setSelectedDevices={setSelectedDevices}
//             iotDevices={iotDevices}
//           />

//           <Form.Item className="mt-6">
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               size="large"
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Update Combo
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>

//       <Modal
//         visible={previewVisible}
//         title="Preview Image"
//         footer={null}
//         onCancel={() => setPreviewVisible(false)}
//       >
//         <img alt="preview" className="w-full" src={previewImage} />
//       </Modal>
//     </div>
//   );
// };
// export default ComboUpdatePage;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Upload,
  InputNumber,
  notification,
  Button,
  Card,
  Typography,
  Spin,
  Modal,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  fetchComboDetails,
  updateCombo,
  fetchIotDevices,
} from "./../../../redux/slices/comboSlice";
import { uploadFiles } from "./../../../api/apiConfig";
import DeviceSelectionTable from "./DeviceSelectionTable";
import {
  validateSummary,
  validateDescription,
} from "./../../../pages/validators";
const { Title } = Typography;

const ComboUpdatePage = () => {
  const { comboId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedCombo = useSelector((state) => state.combo.selectedCombo);

  const iotDevices = useSelector((state) => state.combo.iotDevices || []);

  useEffect(() => {
    if (!comboId || comboId === "undefined") {
      notification.error({
        message: "Invalid Combo ID",
        description: "No valid combo ID provided. Redirecting...",
      });
      navigate("/store/combo-managerment");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchComboDetails(comboId)).unwrap();
        dispatch({ type: "combo/setSelectedCombo", payload: response.data });

        await dispatch(
          fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
        ).unwrap();
      } catch (error) {
        notification.error({
          message: "Error",
          description: error || "Failed to load combo details.",
        });

        navigate("/store/combo-managerment");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, comboId, navigate]);

  useEffect(() => {
    if (!selectedCombo || !selectedCombo.data || !selectedCombo.data.id) return;
    console.log("Updating form with fetched combo:", selectedCombo.data);

    form.setFieldsValue({
      name: selectedCombo.data.name,
      summary: selectedCombo.data.summary,
      description: selectedCombo.data.description,
      specifications: selectedCombo.data.specifications,
      notes: selectedCombo.data.notes,
      serialNumber: selectedCombo.data.serialNumber,
      applicationSerialNumber: selectedCombo.data.applicationSerialNumber,
      price: selectedCombo.data.price,
      quantity: selectedCombo.data.quantity,
    });

    setFileList([
      ...(selectedCombo.data.imageUrl
        ? [
            {
              id: selectedCombo.data.imageUrl,
              imageUrl: selectedCombo.data.imageUrl,
            },
          ]
        : []),
      ...(selectedCombo.data.attachmentsList || []).map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
      })),
    ]);

    setSelectedDevices(
      (selectedCombo.data.deviceComboList || []).map((device) => ({
        deviceComboId: device.deviceComboId,
        iotDeviceId: device.iotDeviceId,
        id: device.iotDeviceId,
        name: device.deviceName,
        amount: device.amount,
      }))
    );
  }, [selectedCombo, form]);

  const handleFileUpload = async ({ file }) => {
    try {
      const imageUrl = await uploadFiles(file);
      setFileList((prevList) => [
        ...prevList,
        { id: imageUrl, imageUrl, metaData: "" },
      ]);
    } catch (error) {
      console.error("❌ File upload failed", error);
    }
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.imageUrl !== file.url));
  };

  const handleUpdateCombo = async (values) => {
    if (!selectedCombo) {
      notification.error({
        message: "Update Error",
        description: "No combo selected for update.",
      });
      return;
    }

    let mainImageUrl =
      values.imageUrl?.trim() ||
      (fileList.length > 0
        ? fileList[0].imageUrl
        : selectedCombo.data.imageUrl);

    if (!mainImageUrl) {
      notification.warning({
        message: "Image Required",
        description: "Please provide an image URL or upload an image.",
      });
      return;
    }

    // Check if at least one device is selected
    if (selectedDevices.length === 0) {
      notification.warning({
        message: "Device Selection Error",
        description: "Please select at least one device for the combo.",
      });
      return;
    }

    const validAttachments = fileList
      .filter((file) => file.imageUrl && file.imageUrl !== mainImageUrl)
      .map((file) => ({
        imageUrl: file.imageUrl,
        metaData: file.metaData || "",
      }));

    // 🚀 Prepare devices for update
    const updatedDevicesMap = new Map();

    selectedDevices.forEach((device) => {
      updatedDevicesMap.set(device.iotDeviceId, {
        deviceComboId: device.deviceComboId,
        iotDeviceId: device.iotDeviceId,
        deviceName: device.name,
        deviceSummary: device.summary || "",
        amount: device.amount,
        originalPrice: device.originalPrice || 0,
        imageUrl: device.imageUrl || "",
      });
    });

    const updatedDevices = Array.from(updatedDevicesMap.values());

    const comboData = {
      ...values,
      comboId: selectedCombo.data.id,
      imageUrl: mainImageUrl,
      attachmentsList: validAttachments,
      deviceComboList: updatedDevices,
    };

    try {
      await dispatch(
        updateCombo({ comboId: selectedCombo.data.id, comboData })
      ).unwrap();
      notification.success({
        message: "Update Successful",
        description: "Combo updated successfully!",
      });
      navigate("/store/combo-managerment");
    } catch (error) {
      console.error("❌ Update Combo Error:", error);
      notification.error({
        message: "Update Failed",
        description: error || "Failed to update combo.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/store/combo-managerment")}
            className="mr-4"
          >
            Back
          </Button>
          <Title level={2} className="text-gray-800 ">
            Edit combo
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleUpdateCombo}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
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
                  onPreview={(file) => {
                    setPreviewImage(file.url || file.thumbUrl);
                    setPreviewVisible(true);
                  }}
                >
                  {fileList.length === 0 && <UploadOutlined />}
                </Upload>
              </Form.Item>

              <Form.Item
                name="name"
                label="Combo Name"
                rules={[
                  { required: true, message: "'Combo Name' is required" },
                ]}
              >
                <Input placeholder="Enter combo name..." />
              </Form.Item>

              {/* <Form.Item
                name="serialNumber"
                label="Serial Number"
                rules={[
                  { required: true, message: "'Serial Number' is required" },
                ]}
              >
                <Input placeholder="Enter serial number..." />
              </Form.Item> */}
              <Form.Item
                name="serialNumber"
                label="Serial Number"
                rules={[
                  { required: true, message: "'Serial Number' is required" },
                  {
                    max: 15,
                    message: "Serial Number must not exceed 15 characters",
                  },
                ]}
              >
                <Input placeholder="Enter serial number..." maxLength={15} />
              </Form.Item>

              <Form.Item
                name="summary"
                label="Summary"
                rules={[{ required: true, validator: validateSummary }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Short description of the combo..."
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, validator: validateDescription }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Detailed description of the combo..."
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item name="specifications" label="Specifications">
                <Input.TextArea
                  rows={3}
                  placeholder="Enter specifications..."
                />
              </Form.Item>

              <Form.Item name="notes" label="Notes">
                <Input.TextArea
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: "'Price' is required" }]}
                >
                  {/* <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter price..."
                  /> */}
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

                <Form.Item
                  name="quantity"
                  label="Quantity"
                  rules={[
                    { required: true, message: "'Quantity' is required" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Enter quantity..."
                  />
                </Form.Item>
              </div>

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
                    setPreviewImage(file.url || file.thumbUrl);
                    setPreviewVisible(true);
                  }}
                >
                  <UploadOutlined />
                </Upload>
              </Form.Item>
            </div>
          </div>

          <DeviceSelectionTable
            selectedDevices={selectedDevices}
            setSelectedDevices={setSelectedDevices}
            iotDevices={iotDevices}
          />

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Combo
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        visible={previewVisible}
        title="Preview Image"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" className="w-full" src={previewImage} />
      </Modal>
    </div>
  );
};
export default ComboUpdatePage;
