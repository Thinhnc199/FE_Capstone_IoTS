// import { useDispatch, useSelector } from "react-redux";
// import { createProducts, getUrlImg } from "../../redux/slices/productSlice";
// import { fetchAllMaterialCategories } from "../../redux/slices/materialCategorySlice";
// import {
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Upload,
//   Row,
//   Col,
//   Select,
//   Button,
//   Spin,
//   Image,
// } from "antd";
// import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// const { TextArea } = Input;
// const { Option } = Select;

// export default function CreateProductPage() {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const dispatch = useDispatch();

//   const { paginatedData, loading } = useSelector(
//     (state) => state.materialCategory
//   );

//   useEffect(() => {
//     dispatch(fetchAllMaterialCategories());
//   }, [dispatch]);

//   //   const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
//   //     try {
//   //       const url = await dispatch(getUrlImg(file)).unwrap();
//   //       if (isMainImage) {
//   //         setImageUrl(url); // Set ảnh chính
//   //       } else {
//   //         // Thêm ảnh phụ vào fileList
//   //         setFileList((prev) => [
//   //           ...prev,
//   //           { url, name: file.name, uid: file.uid },
//   //         ]);
//   //       }
//   //       message.success("upload img success!");
//   //       onSuccess();
//   //     } catch (err) {
//   //       message.error("upload img fail!");
//   //       onError(err);
//   //     } finally {
//   //       setUploading(false);
//   //     }
//   //   };
//   const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };
//   const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
//     setUploading(true);
//     try {
//       const url = await dispatch(getUrlImg(file)).unwrap();
//       if (isMainImage) {
//         setImageUrl(url); // Set ảnh chính
//       } else {
//         // Thêm ảnh phụ vào fileList
//         setFileList((prev) => [
//           ...prev,
//           { url, name: file.name, uid: file.uid },
//         ]);
//       }
//       message.success("upload img success!");
//       onSuccess();
//     } catch (err) {
//       message.error("upload img fail!");
//       onError(err);
//     } finally {
//       setUploading(false);
//     }
//   };
//   const handleSubmit = async (values) => {
//     console.log("Form values:", values);
//     const attachments = fileList.map((file, index) => ({
//       id: index,
//       imageUrl: file.thumbUrl || file.url,
//       metaData: file.name,
//     }));
//     const deviceSpecificationsList =
//       values.deviceSpecificationsList?.map((spec) => ({
//         name: spec.name,
//         deviceSpecificationItemsList:
//           spec.deviceSpecificationItemsList?.map((item) => ({
//             specificationProperty: item.specificationProperty,
//             specificationValue: item.specificationValue,
//           })) || [],
//       })) || [];

//     const productData = {
//       deviceType: 1,
//       ...values,
//       storeId: parseInt(localStorage.getItem("userId")),
//       attachments,
//       imageUrl: imageUrl || "string",
//       deviceSpecificationsList,
//     };
//     console.log("productData", productData);

//     await dispatch(createProducts(productData))
//       .unwrap()
//       .then(() => {
//         message.success("create product success!");
//         form.resetFields();
//         setFileList([]);
//         setImageUrl("");
//       })
//       .catch((error) => {
//         message.error(`err: ${error.message}`);
//       });
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-lg ">
//       <h1 className="text-xl font-bold mb-4">Create New Products </h1>
//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         hideRequiredMark
//         className=""
//       >
//         <Form.Item
//           name="name"
//           label={<p className="font-semibold">Product Name</p>}
//           rules={[{ required: true, message: "Please enter product name" }]}
//         >
//           <Input placeholder="Enter product name" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="weight"
//               label={<p className="font-semibold">Weight</p>}
//               rules={[{ required: true, message: "Please enter weight" }]}
//             >
//               <InputNumber
//                 min={0}
//                 placeholder="Enter weight"
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="categoryId"
//               label={<p className="font-semibold">Category</p>}
//               rules={[{ required: true, message: "Please select a category" }]}
//             >
//               <Select
//                 placeholder="Select a category"
//                 loading={loading}
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().indexOf(input.toLowerCase()) >=
//                   0
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
//           label={<p className="font-semibold">Summary</p>}
//           rules={[{ required: true, message: "Please enter summary" }]}
//         >
//           <TextArea rows={2} placeholder="Enter summary" />
//         </Form.Item>

//         <Form.Item
//           name="description"
//           label={<p className="font-semibold">Description</p>}
//           rules={[{ required: true, message: "Please enter description" }]}
//         >
//           <TextArea rows={4} placeholder="Enter description" />
//         </Form.Item>
//         <Form.Item
//           name="specifications"
//           label={<p className="font-semibold">Specifications</p>}
//           rules={[{ required: true, message: "Please enter specifications" }]}
//         >
//           <TextArea rows={4} placeholder="Enter specifications" />
//         </Form.Item>

//         <Form.Item
//           name="notes"
//           label={<p className="font-semibold">Notes</p>}
//           rules={[{ required: true, message: "Please enter notes" }]}
//         >
//           <TextArea rows={2} placeholder="Enter notes" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="manufacturer"
//               label={<p className="font-semibold">Manufacturer</p>}
//               rules={[{ required: true, message: "Please enter manufacturer" }]}
//             >
//               <Input placeholder="Enter manufacturer" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="model"
//               label={<p className="font-semibold">Model</p>}
//               rules={[{ required: true, message: "Please enter model" }]}
//             >
//               <Input placeholder="Enter model" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="serialNumber"
//               label={<p className="font-semibold">Serial Number</p>}
//               rules={[
//                 { required: true, message: "Please enter serial number" },
//               ]}
//             >
//               <Input placeholder="Enter serial number" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="warrantyMonth"
//               label={<p className="font-semibold">Warranty Month</p>}
//               rules={[
//                 { required: true, message: "Please enter warranty month" },
//               ]}
//             >
//               <InputNumber
//                 min={0}
//                 placeholder="Enter warranty month"
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           name="price"
//           label={<p className="font-semibold">Price</p>}
//           rules={[{ required: true, message: "Please enter price" }]}
//         >
//           <InputNumber
//             min={0}
//             placeholder="Enter price"
//             style={{ width: "100%" }}
//           />
//         </Form.Item>

//         <Form.Item
//           name="quantity"
//           label={<p className="font-semibold">Quantity</p>}
//           rules={[{ required: true, message: "Please enter quantity" }]}
//         >
//           <InputNumber
//             min={0}
//             placeholder="Enter quantity"
//             style={{ width: "100%" }}
//           />
//         </Form.Item>
//         <Form.List name="deviceSpecificationsList">
//           {(fields, { add, remove }) => (
//             <div>
//               {fields.map(({ key, name, ...restField }) => (
//                 <div
//                   key={key}
//                   className="border p-4 mb-4 rounded-lg bg-gray-50"
//                 >
//                   <Row gutter={16} align="middle">
//                     <Col span={18}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, "name"]}
//                         rules={[
//                           {
//                             required: true,
//                             message: "Enter specification name",
//                           },
//                         ]}
//                       >
//                         <Input placeholder="Specification Name" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={6} className="text-right">
//                       <Button
//                         type="text"
//                         icon={<MinusCircleOutlined />}
//                         onClick={() => remove(name)}
//                       />
//                     </Col>
//                   </Row>
//                   <Form.List name={[name, "deviceSpecificationItemsList"]}>
//                     {(subFields, { add: addSub, remove: removeSub }) => (
//                       <div className="bg-white p-3 rounded-lg border">
//                         {subFields.map(
//                           ({ key: subKey, name: subName, ...subRestField }) => (
//                             <Row
//                               key={subKey}
//                               gutter={16}
//                               align="middle"
//                               className="mb-2"
//                             >
//                               <Col span={10}>
//                                 <Form.Item
//                                   {...subRestField}
//                                   name={[subName, "specificationProperty"]}
//                                   rules={[
//                                     {
//                                       required: true,
//                                       message: "Enter specification property",
//                                     },
//                                   ]}
//                                 >
//                                   <Input placeholder="Specification Property" />
//                                 </Form.Item>
//                               </Col>
//                               <Col span={10}>
//                                 <Form.Item
//                                   {...subRestField}
//                                   name={[subName, "specificationValue"]}
//                                   rules={[
//                                     {
//                                       required: true,
//                                       message: "Enter specification value",
//                                     },
//                                   ]}
//                                 >
//                                   <Input placeholder="Specification Value" />
//                                 </Form.Item>
//                               </Col>
//                               <Col span={4} className="text-right">
//                                 <Button
//                                   type="text"
//                                   icon={<MinusCircleOutlined />}
//                                   onClick={() => removeSub(subName)}
//                                 />
//                               </Col>
//                             </Row>
//                           )
//                         )}
//                         <Button
//                           type="dashed"
//                           onClick={() => addSub()}
//                           block
//                           icon={<PlusOutlined />}
//                           className="mt-2"
//                         >
//                           Add Specification Property
//                         </Button>
//                       </div>
//                     )}
//                   </Form.List>
//                 </div>
//               ))}
//               <Button
//                 type="dashed"
//                 onClick={() => add()}
//                 block
//                 icon={<PlusOutlined />}
//                 className="mt-4"
//               >
//                 Add Device Specification
//               </Button>
//             </div>
//           )}
//         </Form.List>
//         <Form.Item
//           label={<p className="font-semibold">Primary Product Image</p>}
//           rules={[{ required: true, message: "Please upload img" }]}
//         >
//           <Upload
//             name="file"
//             listType="picture-card"
//             className="avatar-uploader"
//             showUploadList={false}
//             customRequest={(options) =>
//               handleUpload({ ...options, isMainImage: true })
//             }
//             onPreview={handlePreview}
//           >
//             {imageUrl ? (
//               <img
//                 src={imageUrl}
//                 alt="avatar"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <div>
//                 {uploading ? <Spin /> : <PlusOutlined />}
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>
//             )}
//           </Upload>
//         </Form.Item>
//         {previewImage && (
//           <Image
//             wrapperStyle={{
//               display: "none",
//             }}
//             preview={{
//               visible: previewOpen,
//               onVisibleChange: (visible) => setPreviewOpen(visible),
//               afterOpenChange: (visible) => !visible && setPreviewImage(""),
//             }}
//             src={previewImage}
//           />
//         )}
//         <Form.Item
//           label={<p className="font-semibold">Second Product Image</p>}
//           rules={[{ required: true, message: "Please upload img" }]}
//         >
//           <Upload
//             name="file"
//             listType="picture-card"
//             className="avatar-uploader"
//             showUploadList={true}
//             fileList={fileList}
//             onRemove={(file) => {
//               setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
//             }}
//             customRequest={(options) =>
//               handleUpload({ ...options, isMainImage: false })
//             }
//           >
//             {fileList.length >= 8 ? null : (
//               <div>
//                 {uploading ? <Spin /> : <PlusOutlined />}
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>
//             )}
//           </Upload>
//         </Form.Item>
//       </Form>
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
//         {/* <Button type="primary" onClick={() => form.submit()}>
//           Submit
//         </Button> */}
//         <Button type="primary" onClick={() => form.submit()}>
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// }

// CreateProductPage.propTypes = {
//   isVisible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };

import { useDispatch, useSelector } from "react-redux";
import { createProducts, getUrlImg } from "../../redux/slices/productSlice";
import { fetchAllMaterialCategories } from "../../redux/slices/materialCategorySlice";
import {
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Row,
  Col,
  Select,
  Button,
  Spin,
  Image,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const { TextArea } = Input;
const { Option } = Select;

export default function CreateProductPage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();

  const { paginatedData, loading } = useSelector(
    (state) => state.materialCategory
  );

  useEffect(() => {
    dispatch(fetchAllMaterialCategories());
  }, [dispatch]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
    setUploading(true);
    try {
      const url = await dispatch(getUrlImg(file)).unwrap();
      if (isMainImage) {
        setImageUrl(url);
      } else {
        setFileList((prev) => [
          ...prev,
          { url, name: file.name, uid: file.uid },
        ]);
      }
      message.success("upload img success!");
      onSuccess();
    } catch (err) {
      message.error("upload img fail!");
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    const attachments = fileList.map((file, index) => ({
      id: index,
      imageUrl: file.thumbUrl || file.url,
      metaData: file.name,
    }));
    const deviceSpecificationsList =
      values.deviceSpecificationsList?.map((spec) => ({
        name: spec.name,
        deviceSpecificationItemsList:
          spec.deviceSpecificationItemsList?.map((item) => ({
            specificationProperty: item.specificationProperty,
            specificationValue: item.specificationValue,
          })) || [],
      })) || [];

    const productData = {
      deviceType: 1,
      ...values,
      storeId: parseInt(localStorage.getItem("userId")),
      attachments,
      imageUrl: imageUrl || "string",
      deviceSpecificationsList,
    };
    console.log("productData", productData);

    await dispatch(createProducts(productData))
      .unwrap()
      .then(() => {
        message.success("create product success!");
        form.resetFields();
        setFileList([]);
        setImageUrl("");
      })
      .catch((error) => {
        message.error(`err: ${error.message}`);
      });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Create New Product</h1>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        hideRequiredMark
      >
        {/* Product Basic Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Weight"
                rules={[{ required: true, message: "Please enter weight" }]}
              >
                <InputNumber
                  min={0}
                  placeholder="Enter weight"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  loading={loading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="Manufacturer"
                rules={[
                  { required: true, message: "Please enter manufacturer" },
                ]}
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

          <Row gutter={24}>
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
                label="Warranty (months)"
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

          <Row gutter={24}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="summary"
                label="Summary"
                rules={[{ required: true, message: "Please enter summary" }]}
              >
                <TextArea rows={2} placeholder="Enter summary" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="specifications"
                label="Specifications"
                rules={[
                  { required: true, message: "Please enter specifications" },
                ]}
              >
                <TextArea rows={4} placeholder="Enter specifications" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
                rules={[{ required: true, message: "Please enter notes" }]}
              >
                <TextArea rows={2} placeholder="Enter notes" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Specifications */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Detailed Specifications
          </h2>
          <Form.List name="deviceSpecificationsList">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="border p-4 mb-4 rounded-lg bg-gray-50"
                  >
                    <Row gutter={16} align="middle">
                      <Col span={18}>
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter specification name",
                            },
                          ]}
                        >
                          <Input placeholder="Specification Name" />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="text-right">
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                    <Form.List name={[name, "deviceSpecificationItemsList"]}>
                      {(subFields, { add: addSub, remove: removeSub }) => (
                        <div className="bg-white p-3 rounded-lg border">
                          {subFields.map(
                            ({
                              key: subKey,
                              name: subName,
                              ...subRestField
                            }) => (
                              <Row
                                key={subKey}
                                gutter={16}
                                align="middle"
                                className="mb-2"
                              >
                                <Col span={10}>
                                  <Form.Item
                                    {...subRestField}
                                    name={[subName, "specificationProperty"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter specification property",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Specification Property" />
                                  </Form.Item>
                                </Col>
                                <Col span={10}>
                                  <Form.Item
                                    {...subRestField}
                                    name={[subName, "specificationValue"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter specification value",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Specification Value" />
                                  </Form.Item>
                                </Col>
                                <Col span={4} className="text-right">
                                  <Button
                                    type="text"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => removeSub(subName)}
                                  />
                                </Col>
                              </Row>
                            )
                          )}
                          <Button
                            type="dashed"
                            onClick={() => addSub()}
                            block
                            icon={<PlusOutlined />}
                            className="mt-2"
                          >
                            Add Specification Property
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="mt-4"
                >
                  Add Device Specification
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Primary Image"
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
                  onPreview={handlePreview}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div>
                      {uploading ? <Spin /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                label="Additional Images"
                rules={[{ required: true, message: "Please upload img" }]}
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  fileList={fileList}
                  onRemove={(file) => {
                    setFileList((prev) =>
                      prev.filter((f) => f.uid !== file.uid)
                    );
                  }}
                  customRequest={(options) =>
                    handleUpload({ ...options, isMainImage: false })
                  }
                >
                  {fileList.length >= 8 ? null : (
                    <div>
                      {uploading ? <Spin /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end gap-4">
          <Link to={"/store/list-product"}>
            {" "}
            <Button
              type="primary"
              style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              className="hover:!bg-red-400"
            >
              Cancel
            </Button>
          </Link>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

CreateProductPage.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
