import { useDispatch, useSelector } from "react-redux";
import { createProducts, getUrlImg } from "../../../redux/slices/productSlice";
import { fetchAllMaterialCategories } from "../../../redux/slices/materialCategorySlice";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Upload,
  Row,
  Col,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateProductModal({ isVisible, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const { paginatedData, loading } = useSelector(
    (state) => state.materialCategory
  );

  useEffect(() => {
    dispatch(fetchAllMaterialCategories());
  }, [dispatch]);
  console.log("ProductDatas", items);
  console.log("ProductDatas t", typeof ProductDatas);

  const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
    try {
      const url = await dispatch(getUrlImg(file)).unwrap();
      if (isMainImage) {
        setImageUrl(url);
      } else {
        setFileList((prev) => [...prev, { url, name: file.name }]);
      }
      message.success("upload img success!");
      onSuccess();
    } catch (err) {
      message.error("upload img fail!");
      onError(err);
    }
  };

  const handleSubmit = async (values) => {
    const attachments = fileList.map((file, index) => ({
      id: index,
      imageUrl: file.thumbUrl || file.url,
      metaData: file.name,
    }));

    const productData = {
      ...items,
      ...values,
      storeId: parseInt(localStorage.getItem("userId")),
      attachments,
      imageUrl: imageUrl || "string",
    };

    await dispatch(createProducts(productData))
      .unwrap()
      .then(() => {
        message.success("create product success!");
        form.resetFields();
        setFileList([]);
        setImageUrl("");
        onClose();
      })
      .catch((error) => {
        message.error(`err: ${error.message}`);
      });
  };

  return (
    <Modal
      title="Create New Product"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        hideRequiredMark
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="weight"
              label="Weight"
              rules={[{ required: true, message: "Please enter weight" }]}
            >
              <Input placeholder="Enter weight" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select a category"
                loading={loading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {paginatedData.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="summary"
          label="Summary"
          rules={[{ required: true, message: "Please enter summary" }]}
        >
          <TextArea rows={2} placeholder="Enter summary" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          name="specifications"
          label="specifications"
          rules={[{ required: true, message: "Please enter specifications" }]}
        >
          <TextArea rows={4} placeholder="Enter specifications" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="notes"
          rules={[{ required: true, message: "Please enter notes" }]}
        >
          <TextArea rows={2} placeholder="Enter notes" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
              rules={[{ required: true, message: "Please enter manufacturer" }]}
            >
              <Input placeholder="Enter manufacturer" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: "Please enter model" }]}
            >
              <Input placeholder="Enter model" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serialNumber"
              label="Serial Number"
              rules={[
                { required: true, message: "Please enter serial number" },
              ]}
            >
              <Input placeholder="Enter serial number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="warrantyMonth"
              label="Warranty Month"
              rules={[
                { required: true, message: "Please enter warranty month" },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Enter warranty month"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter quantity"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Primary Product Image"
          rules={[{ required: true, message: "Please upload img" }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={(options) =>
              handleUpload({ ...options, isMainImage: true })
            }
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

CreateProductModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// import { useDispatch, useSelector } from "react-redux";
// import { createProducts, getUrlImg } from "../../../redux/slices/productSlice";
// import { fetchAllMaterialCategories } from "../../../redux/slices/materialCategorySlice";
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Drawer,
//   message,
//   Upload,
//   Row,
//   Col,
//   Select,
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// const { TextArea } = Input;
// const { Option } = Select;

// export default function CreateProductDrawer({ isVisible, onClose }) {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const dispatch = useDispatch();
//   const { items } = useSelector((state) => state.products);
//   const { paginatedData, loading } = useSelector(
//     (state) => state.materialCategory
//   );

//   useEffect(() => {
//     dispatch(fetchAllMaterialCategories());
//   }, [dispatch]);

//   const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
//     try {
//       const url = await dispatch(getUrlImg(file)).unwrap();
//       if (isMainImage) {
//         setImageUrl(url);
//       } else {
//         setFileList((prev) => [...prev, { url, name: file.name }]);
//       }
//       message.success("Upload image success!");
//       onSuccess();
//     } catch (err) {
//       message.error("Upload image failed!");
//       onError(err);
//     }
//   };

//   const handleSubmit = async (values) => {
//     const attachments = fileList.map((file, index) => ({
//       id: index,
//       imageUrl: file.thumbUrl || file.url,
//       metaData: file.name,
//     }));

//     const productData = {
//       ...items,
//       ...values,
//       storeId: parseInt(localStorage.getItem("userId")),
//       attachments,
//       imageUrl: imageUrl || "string",
//     };

//     await dispatch(createProducts(productData))
//       .unwrap()
//       .then(() => {
//         message.success("Create product success!");
//         form.resetFields();
//         setFileList([]);
//         setImageUrl("");
//         onClose();
//       })
//       .catch((error) => {
//         message.error(`Error: ${error.message}`);
//       });
//   };

//   return (
//     <Drawer
//       title="Create New Product"
//       open={isVisible}
//       onClose={onClose}
//       width={600}
//     >
//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         hideRequiredMark
//       >
//         <Form.Item
//           name="name"
//           label="Product Name"
//           rules={[{ required: true, message: "Please enter product name" }]}
//         >
//           <Input placeholder="Enter product name" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="weight"
//               label="Weight"
//               rules={[{ required: true, message: "Please enter weight" }]}
//             >
//               <Input placeholder="Enter weight" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="categoryId"
//               label="Category"
//               rules={[{ required: true, message: "Please select a category" }]}
//             >
//               <Select
//                 placeholder="Select a category"
//                 loading={loading}
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 }
//               >
//                 {paginatedData.map((category) => (
//                   <Option key={category.id} value={category.id}>
//                     {category.label}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           name="summary"
//           label="Summary"
//           rules={[{ required: true, message: "Please enter summary" }]}
//         >
//           <TextArea rows={2} placeholder="Enter summary" />
//         </Form.Item>

//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[{ required: true, message: "Please enter description" }]}
//         >
//           <TextArea rows={4} placeholder="Enter description" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="manufacturer"
//               label="Manufacturer"
//               rules={[{ required: true, message: "Please enter manufacturer" }]}
//             >
//               <Input placeholder="Enter manufacturer" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="model"
//               label="Model"
//               rules={[{ required: true, message: "Please enter model" }]}
//             >
//               <Input placeholder="Enter model" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           name="price"
//           label="Price"
//           rules={[{ required: true, message: "Please enter price" }]}
//         >
//           <InputNumber
//             min={0}
//             placeholder="Enter price"
//             style={{ width: "100%" }}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Primary Product Image"
//           rules={[{ required: true, message: "Please upload an image" }]}
//         >
//           <Upload
//             name="file"
//             listType="picture-card"
//             className="avatar-uploader"
//             showUploadList={false}
//             customRequest={(options) =>
//               handleUpload({ ...options, isMainImage: true })
//             }
//           >
//             {imageUrl ? (
//               <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
//             ) : (
//               <div>
//                 <PlusOutlined />
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>
//             )}
//           </Upload>
//         </Form.Item>

//         {/* Buttons inside Drawer */}
//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button type="primary" onClick={() => form.submit()}>
//             Submit
//           </Button>
//         </div>
//       </Form>
//     </Drawer>
//   );
// }

// CreateProductDrawer.propTypes = {
//   isVisible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };
