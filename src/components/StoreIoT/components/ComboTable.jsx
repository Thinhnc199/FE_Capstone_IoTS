// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Table,
//   Pagination,
//   Button,
//   Image,
//   Tag,
//   Modal,
//   Form,
//   Input,
//   Upload,
//   InputNumber,
//   notification,
//   Dropdown,
//   Tabs,
//   Card,
//   Row,
//   Col,
//   Typography,
// } from "antd";
// import {
//   PlusOutlined,
//   UploadOutlined,
//   SearchOutlined,
//   EditOutlined,
//   EllipsisOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   InfoCircleOutlined,
//   FileTextOutlined,
//   TagsOutlined,
//   ShopOutlined,
//   DollarCircleOutlined,
// } from "@ant-design/icons";
// import {
//   fetchCombos,
//   fetchComboDetails,
//   createCombo,
//   fetchIotDevices,
//   setPageIndex,
//   setPageSize,
//   setSearchKeyword,
//   setStartFilterDate,
//   setEndFilterDate,
// } from "./../../../redux/slices/comboSlice";
// import { getStoreDetails } from "./../../../redux/slices/storeRegistrationSlice";
// import { uploadFiles } from "./../../../api/apiConfig";
// import DeviceSelectionTable from "./DeviceSelectionTable";
// import { useNavigate } from "react-router-dom";

// const ComboTable = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [selectedDevices, setSelectedDevices] = useState([]);
//   const [selectedCombo, setSelectedCombo] = useState(null);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const { Text } = Typography;

//   const {
//     combos,
//     loading,
//     totalCount,
//     pageIndex,
//     pageSize,
//     iotDevices,
//     storeId,
//     userId,
//     searchKeyword,
//     startFilterDate,
//     endFilterDate,
//   } = useSelector((state) => ({
//     combos: state.combo.combos || [],
//     totalCount: state.combo.totalCount || 0,
//     pageIndex: state.combo.pageIndex || 0,
//     pageSize: state.combo.pageSize || 10,
//     iotDevices: Array.isArray(state.combo.iotDevices)
//       ? state.combo.iotDevices
//       : [],
//     storeId:
//       state.storeRegistration.store?.id ||
//       localStorage.getItem("storeId") ||
//       null,
//     loading: state.combo.loading,
//   }));

//   useEffect(() => {
//     dispatch(
//       fetchCombos({
//         pageIndex: pageIndex - 1,
//         pageSize: 10,
//         searchKeyword: searchKeyword || "",
//         startFilterDate,
//         endFilterDate,
//       })
//     );
//     dispatch(
//       fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
//     );
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId && !storeId) {
//       dispatch(getStoreDetails(storedUserId));
//     }
//  }, [dispatch, storeId, searchKeyword, startFilterDate, endFilterDate, pageIndex, pageSize]);

//   const handleSearch = (values) => {
//     const keyword = values.searchKeyword || ""; // Đảm bảo không undefined
//     dispatch(setSearchKeyword(keyword));
//     dispatch(setStartFilterDate(values.startFilterDate?.toISOString() || ""));
//     dispatch(setEndFilterDate(values.endFilterDate?.toISOString() || ""));
//     dispatch(setPageIndex(1)); // Reset về trang 1 khi tìm kiếm
//     // Gọi fetchCombos để làm mới dữ liệu
//     dispatch(
//       fetchCombos({
//         pageIndex: 0, // API thường bắt đầu từ 0
//         pageSize: 10, // Giá trị mặc định hợp lệ
//         searchKeyword: keyword,
//       })
//     );
//   };
//   // const handleSearch = (values) => {
//   //   dispatch(setSearchKeyword(values.searchKeyword));
//   //   dispatch(setStartFilterDate(values.startFilterDate?.toISOString() || ""));
//   //   dispatch(setEndFilterDate(values.endFilterDate?.toISOString() || ""));
//   //   dispatch(setPageIndex(1));
//   // };

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

//   const handleShowDetailModal = async (comboId) => {
//     const response = await dispatch(fetchComboDetails(comboId));
//     setSelectedCombo(response.payload.data);
//     setIsDetailModalVisible(true);
//   };

//   const handleOpenModal = async () => {
//     let currentStoreId = storeId || localStorage.getItem("storeId");
//     if (!currentStoreId && userId) {
//       const res = await dispatch(getStoreDetails(userId));
//       currentStoreId = res.payload?.data?.id;
//     }
//     setSelectedCombo(null);
//     setFileList([]);
//     setSelectedDevices([]);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleCreateCombo = async (values) => {
//     let currentStoreId = localStorage.getItem("storeId");
//     if (!currentStoreId) {
//       const res = await dispatch(getStoreDetails(userId));
//       currentStoreId = res.payload?.data?.id;
//     }

//     let mainImageUrl =
//       values.imageUrl?.trim() ||
//       (fileList.length > 0 ? fileList[0].imageUrl : "");
//     if (!mainImageUrl || !selectedDevices.length) {
//       notification.warning({
//         message: "Validation Error",
//         description: "Image and devices are required.",
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
//       .filter((file) => file.imageUrl !== mainImageUrl)
//       .map((file) => ({
//         imageUrl: file.imageUrl,
//         metaData: file.metaData || "",
//       }));
//     const comboData = {
//       ...values,
//       storeId: currentStoreId,
//       imageUrl: mainImageUrl,
//       deviceComboList: selectedDevices.map((device) => ({
//         iotDeviceId: device.iotDeviceId,
//         amount: device.amount,
//       })),
//       attachmentsList: validAttachments,
//     };

//     try {
//       await dispatch(createCombo(comboData)).unwrap();
//       notification.success({
//         message: "Combo Created",
//         description: "Combo created successfully!",
//       });
//       setIsModalVisible(false);
//       form.resetFields();
//       setFileList([]);
//     } catch (error) {
//       notification.error({ message: "Creation Failed", description: error });
//     }
//   };

//   const handleNavigateToUpdate = (comboId) => {
//     navigate(`/store/combo/update/${comboId}`);
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id" },
//     {
//       title: "Image",
//       dataIndex: "imageUrl",
//       key: "imageUrl",
//       render: (imageUrl) => <Image width={50} src={imageUrl} alt="combo" />,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text, record) => (
//         <a onClick={() => handleShowDetailModal(record.id)}>{text}</a>
//       ),
//     },
//     { title: "Summary", dataIndex: "summary", key: "summary" },
//     {
//       title: "Serial Number",
//       dataIndex: "applicationSerialNumber",
//       key: "applicationSerialNumber",
//     },
//     { title: "Price", dataIndex: "price", key: "price" },
//     { title: "Quantity", dataIndex: "quantity", key: "quantity" },
//     {
//       title: "Active",
//       dataIndex: "isActive",
//       key: "isActive",
//       render: (isActive) => (
//         <Tag color={isActive ? "green" : "red"}>
//           {isActive ? "Active" : "Deactive"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Dropdown
//           menu={{
//             items: [
//               record.isActive
//                 ? {
//                     key: "1",
//                     label: (
//                       <span onClick={() => handleNavigateToUpdate(record.id)}>
//                         <EditOutlined className="text-black mr-2" /> Update
//                         Product
//                       </span>
//                     ),
//                   }
//                 : {
//                     key: "2",
//                     label: (
//                       <span>
//                         <CheckCircleOutlined className="text-green-500 mr-2" />{" "}
//                         Activate
//                       </span>
//                     ),
//                   },
//               // {
//               //   key: "1",
//               //   label: (
//               //     <span onClick={() => handleNavigateToUpdate(record.id)}>
//               //       <EditOutlined className="text-black mr-2" /> Update Product
//               //     </span>
//               //   ),
//               // },
//               {
//                 key: "3",
//                 label: (
//                   <span>
//                     <CloseCircleOutlined className="text-red-500 mr-2" />{" "}
//                     Deactivate
//                   </span>
//                 ),
//               },
//             ],
//           }}
//           trigger={["click"]}
//         >
//           <EllipsisOutlined />
//         </Dropdown>
//       ),
//     },
//   ];

//   return (
//     // <div className="p-6 bg-white min-h-screen">
//     <div className="bg-white rounded-lg p-6 shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Combos List</h1>
//       <div className="flex justify-between items-center mb-6">
//         <Form layout="inline" onFinish={handleSearch}>
//           <Form.Item name="searchKeyword">
//             <Input placeholder="Search by name" />
//           </Form.Item>
//           {/* <Form.Item name="startFilterDate">
//             <DatePicker placeholder="Start Date" />
//           </Form.Item>
//           <Form.Item name="endFilterDate">
//             <DatePicker placeholder="End Date" />
//           </Form.Item> */}
//           <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//             Search
//           </Button>
//         </Form>
//         <Button
//           type="primary"
//           onClick={handleOpenModal}
//           icon={<PlusOutlined />}
//         >
//           Create Combo
//         </Button>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={Array.isArray(combos) ? combos : []}
//         loading={loading}
//         rowKey="id"
//         pagination={false}
//         bordered
//         className="shadow-sm"
//       />
//       <div className="flex justify-between items-center mt-4">
//         <p className="text-gray-600">
//           Showing {(pageIndex - 1) * pageSize + 1} to{" "}
//           {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
//         </p>
//         {/* <Pagination
//           current={pageIndex}
//           pageSize={pageSize}
//           total={totalCount}
//           showSizeChanger
//           pageSizeOptions={[10, 15, 30]}
//           onChange={(page) => {
//             dispatch(setPageIndex(page));
//             dispatch(fetchCombos({ pageIndex: page, pageSize }));
//           }}
//         /> */}
//         <Pagination
//   current={pageIndex}
//   pageSize={pageSize}
//   total={totalCount}
//   showSizeChanger
//   pageSizeOptions={[10, 15, 30]}
//   onChange={(page, newPageSize) => {
//     dispatch(setPageIndex(page));
//     dispatch(setPageSize(newPageSize));
//     dispatch(
//       fetchCombos({
//         pageIndex: page - 1, // Điều chỉnh cho API
//         pageSize: newPageSize,
//         searchKeyword: searchKeyword || "",
//       })
//     );
//   }}
// />
//       </div>

//       <Modal
//         title="Create Combo"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         width={900}
//       >
//         <Form form={form} layout="vertical" onFinish={handleCreateCombo}>
//           {/* Main Image Upload */}
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

//               {/* Combo Name */}
//               <Form.Item
//                 name="name"
//                 label="Combo Name"
//                 rules={[
//                   { required: true, message: "'Combo Name' is required" },
//                 ]}
//               >
//                 <Input placeholder="Enter combo name..." />
//               </Form.Item>

//               {/* Serial Number */}
//               <Form.Item
//                 name="serialNumber"
//                 label="Serial Number"
//                 rules={[
//                   { required: true, message: "'Serial Number' is required" },
//                 ]}
//               >
//                 <Input placeholder="Enter serial number..." />
//               </Form.Item>

//               {/* Summary */}
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

//               {/* Description */}
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
//               {/* Specifications */}
//               <Form.Item name="specifications" label="Specifications">
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Enter specifications..."
//                 />
//               </Form.Item>

//               {/* Notes */}
//               <Form.Item name="notes" label="Notes">
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Any additional notes..."
//                 />
//               </Form.Item>

//               {/* Price and Quantity */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

//               {/* Additional Images */}
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

//           {/* Device Selection Table */}
//           <DeviceSelectionTable
//             selectedDevices={selectedDevices}
//             setSelectedDevices={setSelectedDevices}
//             iotDevices={iotDevices}
//           />

//           {/* Submit Button */}
//           <Form.Item className="mt-6">
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               size="large"
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Create Combo
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title={selectedCombo?.name || "Loading..."}
//         visible={isDetailModalVisible}
//         onCancel={() => setIsDetailModalVisible(false)}
//         footer={null}
//         width={900}
//       >
//         {selectedCombo && (
//           <div className="flex gap-5">
//             <div className="flex-1">
//               <Image
//                 width={300}
//                 src={selectedCombo.imageUrl}
//                 alt="combo"
//                 className="rounded-lg"
//               />
//               {Array.isArray(selectedCombo.attachmentsList) &&
//                 selectedCombo.attachmentsList.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {selectedCombo.attachmentsList.map((attachment) => (
//                       <Image
//                         key={attachment.id}
//                         width={80}
//                         src={attachment.imageUrl}
//                         alt="attachment"
//                         className="rounded"
//                       />
//                     ))}
//                   </div>
//                 )}
//             </div>
//             <div className="flex-2">
//               <Tabs defaultActiveKey="1">
//                 <Tabs.TabPane
//                   tab={
//                     <span>
//                       <InfoCircleOutlined /> General Info
//                     </span>
//                   }
//                   key="1"
//                 >
//                   <Card>
//                     <p>
//                       <ShopOutlined className="text-blue-500 mr-2" />
//                       <strong>Store:</strong>{" "}
//                       {selectedCombo.storeNavigationName}
//                     </p>
//                     <p>
//                       <strong>Summary:</strong> {selectedCombo.summary}
//                     </p>
//                     <p>
//                       <DollarCircleOutlined className="text-blue-500 mr-2" />
//                       <strong>Price:</strong>{" "}
//                       <Text className="text-blue-500 text-lg font-bold">
//                         {selectedCombo.price}
//                       </Text>
//                     </p>
//                     <Row gutter={[16, 16]}>
//                       <Col span={12}>
//                         <p>
//                           <strong>Quantity:</strong> {selectedCombo.quantity}
//                         </p>
//                       </Col>
//                       <Col span={12}>
//                         <p>
//                           <strong>Rating:</strong> {selectedCombo.rating} ⭐
//                         </p>
//                       </Col>
//                     </Row>
//                   </Card>
//                 </Tabs.TabPane>
//                 <Tabs.TabPane
//                   tab={
//                     <span>
//                       <FileTextOutlined /> Description
//                     </span>
//                   }
//                   key="2"
//                 >
//                   <p>{selectedCombo.description}</p>
//                 </Tabs.TabPane>
//                 <Tabs.TabPane
//                   tab={
//                     <span>
//                       <TagsOutlined /> Specifications
//                     </span>
//                   }
//                   key="3"
//                 >
//                   <p>{selectedCombo.specifications}</p>
//                 </Tabs.TabPane>
//                 <Tabs.TabPane
//                   tab={
//                     <span>
//                       <FileTextOutlined /> Notes
//                     </span>
//                   }
//                   key="4"
//                 >
//                   <p>{selectedCombo.notes}</p>
//                 </Tabs.TabPane>
//               </Tabs>
//             </div>
//           </div>
//         )}
//         {selectedCombo?.deviceComboList?.length > 0 && (
//           <Table
//             title={() => "Device List"}
//             dataSource={selectedCombo.deviceComboList}
//             columns={[
//               {
//                 title: "Device Name",
//                 dataIndex: "deviceName",
//                 key: "deviceName",
//               },
//               { title: "Amount", dataIndex: "amount", key: "amount" },
//               {
//                 title: "Original Price",
//                 dataIndex: "originalPrice",
//                 key: "originalPrice",
//               },
//             ]}
//             rowKey="deviceComboId"
//             pagination={false}
//           />
//         )}
//       </Modal>

//       <Modal
//         visible={previewVisible}
//         title="Preview Image"
//         footer={null}
//         onCancel={() => setPreviewVisible(false)}
//       >
//         <img alt="preview" className="w-full" src={previewImage} />
//       </Modal>
//     </div>
//     // </div>
//   );
// };

// export default ComboTable;

import { useEffect, useState, useCallback } from "react";
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
  Dropdown,
  Tabs,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  EditOutlined,
  EllipsisOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  TagsOutlined,
  ShopOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {
  fetchCombos,
  fetchComboDetails,
  createCombo,
  fetchIotDevices,
  setPageIndex,
  setPageSize,
  setSearchKeyword,
  // setStartFilterDate,
  // setEndFilterDate,
} from "./../../../redux/slices/comboSlice";
import { getStoreDetails } from "./../../../redux/slices/storeRegistrationSlice";
import { uploadFiles } from "./../../../api/apiConfig";
import DeviceSelectionTable from "./DeviceSelectionTable";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import BreadcrumbNav from "../../common/BreadcrumbNav";
import {
  validateSummary,
  validateDescription,
} from "./../../../pages/validators";
const ComboTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { Text } = Typography;

  const {
    combos,
    // loading,
    totalCount,
    pageIndex,
    pageSize,
    iotDevices,
    storeId,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  } = useSelector((state) => ({
    combos: state.combo.combos || [],
    totalCount: state.combo.totalCount || 0,
    pageIndex: state.combo.pageIndex || 1, // UI starts at 1
    pageSize: state.combo.pageSize || 10,
    iotDevices: Array.isArray(state.combo.iotDevices)
      ? state.combo.iotDevices
      : [],
    storeId:
      state.storeRegistration.store?.id ||
      localStorage.getItem("storeId") ||
      null,
    loading: state.combo.loading,
    searchKeyword: state.combo.searchKeyword || "",
  }));

  // Debounced fetchCombos to avoid excessive API calls
  const debouncedFetchCombos = useCallback(
    debounce((keyword, pageIdx, size) => {
      dispatch(
        fetchCombos({
          pageIndex: pageIdx - 1, // API starts at 0
          pageSize: size,
          searchKeyword: keyword,
          startFilterDate,
          endFilterDate,
        })
      );
    }, 300), // 300ms debounce
    [dispatch, startFilterDate, endFilterDate]
  );

  // Initial fetch and dependency-based fetch
  useEffect(() => {
    debouncedFetchCombos(searchKeyword, pageIndex, pageSize);
    dispatch(
      fetchIotDevices({ pageIndex: 0, pageSize: 10, searchKeyword: "" })
    );
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && !storeId) {
      dispatch(getStoreDetails(storedUserId));
    }
  }, [
    dispatch,
    storeId,
    pageIndex,
    pageSize,
    searchKeyword,
    debouncedFetchCombos,
  ]);

  // Handle search input change (real-time)
  const handleSearchChange = (e) => {
    const keyword = e.target.value || "";
    dispatch(setSearchKeyword(keyword));
    dispatch(setPageIndex(1)); // Reset to page 1 on new search
    debouncedFetchCombos(keyword, 1, pageSize);
  };

  // Handle file upload
  const handleFileUpload = async ({ file }) => {
    try {
      const imageUrl = await uploadFiles(file);
      setFileList((prevList) => [
        ...prevList,
        { id: imageUrl, imageUrl, metaData: "" },
      ]);
      // } catch (error) {
      //   notification.error({
      //     message: "Upload Failed",
      //     description: error,
      //   });
      // }
    } catch (error) {
      notification.error({
        message: "Upload Failed",
        description: error,
      });
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

  const handleOpenModal = async () => {
    let currentStoreId = storeId || localStorage.getItem("storeId");
    if (!currentStoreId) {
      const res = await dispatch(
        getStoreDetails(localStorage.getItem("userId"))
      );
      currentStoreId = res.payload?.data?.id;
    }
    setSelectedCombo(null);
    setFileList([]);
    setSelectedDevices([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateCombo = async (values) => {
    let currentStoreId = storeId || localStorage.getItem("storeId");
    if (!currentStoreId) {
      const res = await dispatch(
        getStoreDetails(localStorage.getItem("userId"))
      );
      currentStoreId = res.payload?.data?.id;
    }

    const mainImageUrl =
      values.imageUrl?.trim() ||
      (fileList.length > 0 ? fileList[0].imageUrl : "");
    if (!mainImageUrl || !selectedDevices.length) {
      notification.warning({
        message: "Validation Error",
        description: "Image and devices are required.",
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

    try {
      await dispatch(createCombo(comboData)).unwrap();
      notification.success({
        message: "Combo Created",
        description: "Combo created successfully!",
      });
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      debouncedFetchCombos(searchKeyword, pageIndex, pageSize); // Refresh list
    } catch (error) {
      notification.error({
        message: "Creation Failed",
        description: error,
      });
    }
  };

  const handleNavigateToUpdate = (comboId) => {
    navigate(`/store/combo/update/${comboId}`);
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              record.isActive
                ? {
                    key: "1",
                    label: (
                      <span onClick={() => handleNavigateToUpdate(record.id)}>
                        <EditOutlined className="text-black mr-2" /> Update
                        Product
                      </span>
                    ),
                  }
                : {
                    key: "2",
                    label: (
                      <span>
                        <CheckCircleOutlined className="text-green-500 mr-2" />{" "}
                        Activate
                      </span>
                    ),
                  },
              {
                key: "3",
                label: (
                  <span>
                    <CloseCircleOutlined className="text-red-500 mr-2" />{" "}
                    Deactivate
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
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "store", path: "/store" },
            { label: "combo managerment" },
          ]}
        />
      </div>
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h1 className="text-xl font-bold mb-4">Combos List</h1>
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search by name"
            value={searchKeyword}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<PlusOutlined />}
          >
            Create Combo
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={Array.isArray(combos) ? combos : []}
          // loading={loading}
          rowKey="id"
          pagination={false}
          bordered
          className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white  [&_.ant-pagination]:p-2"
          style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
        />
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-600">
            Showing {(pageIndex - 1) * pageSize + 1} to{" "}
            {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
          </p>
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            showSizeChanger
            pageSizeOptions={[10, 15, 30]}
            onChange={(page, newPageSize) => {
              dispatch(setPageIndex(page));
              dispatch(setPageSize(newPageSize));
              debouncedFetchCombos(searchKeyword, page, newPageSize);
            }}
          />
        </div>

        <Modal
          title="Create Combo"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={900}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateCombo}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Create Combo
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={selectedCombo?.name || "Loading..."}
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedCombo && (
            <div className="flex gap-5">
              <div className="flex-1">
                <Image
                  width={300}
                  src={selectedCombo.imageUrl}
                  alt="combo"
                  className="rounded-lg"
                />
                {Array.isArray(selectedCombo.attachmentsList) &&
                  selectedCombo.attachmentsList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCombo.attachmentsList.map((attachment) => (
                        <Image
                          key={attachment.id}
                          width={80}
                          src={attachment.imageUrl}
                          alt="attachment"
                          className="rounded"
                        />
                      ))}
                    </div>
                  )}
              </div>
              <div className="flex-2">
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane
                    tab={
                      <span>
                        <InfoCircleOutlined /> General Info
                      </span>
                    }
                    key="1"
                  >
                    <Card>
                      <p>
                        <ShopOutlined className="text-blue-500 mr-2" />
                        <strong>Store:</strong>{" "}
                        {selectedCombo.storeNavigationName}
                      </p>
                      <p>
                        <strong>Summary:</strong> {selectedCombo.summary}
                      </p>
                      <p>
                        <DollarCircleOutlined className="text-blue-500 mr-2" />
                        <strong>Price:</strong>{" "}
                        <Text className="text-blue-500 text-lg font-bold">
                          {selectedCombo.price}
                        </Text>
                      </p>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <p>
                            <strong>Quantity:</strong> {selectedCombo.quantity}
                          </p>
                        </Col>
                        <Col span={12}>
                          <p>
                            <strong>Rating:</strong> {selectedCombo.rating} ⭐
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <span>
                        <FileTextOutlined /> Description
                      </span>
                    }
                    key="2"
                  >
                    <p>{selectedCombo.description}</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <span>
                        <TagsOutlined /> Specifications
                      </span>
                    }
                    key="3"
                  >
                    <p>{selectedCombo.specifications}</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <span>
                        <FileTextOutlined /> Notes
                      </span>
                    }
                    key="4"
                  >
                    <p>{selectedCombo.notes}</p>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
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
          visible={previewVisible}
          title="Preview Image"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="preview" className="w-full" src={previewImage} />
        </Modal>
      </div>
    </div>
  );
};

export default ComboTable;
