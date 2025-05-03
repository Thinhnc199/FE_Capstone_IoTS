import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Select,
  Row,
  Col,
  Spin,
  Image,
  message,
  Card,
  // Typography,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;
// const { Title } = Typography;

const ProductForm = ({
  form,
  onFinish,
  loading,
  isEditMode = false,
  initialValues = {},
  categories = [],
}) => {
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.imageUrl) setImageUrl(initialValues.imageUrl);
      if (initialValues.attachments) {
        setFileList(
          initialValues.attachments.map((att, index) => ({
            uid: `-${index}`,
            name: `attachment-${index}`,
            url: att.imageUrl,
          }))
        );
      }
    }
  }, [form, initialValues, isEditMode]);

  const handleSubmit = (values) => {
    const productData = {
      deviceType: 1,
      ...values,
      storeId: parseInt(localStorage.getItem("userId")),
      imageUrl: imageUrl || "",
      attachments: fileList.map((file) => ({
        imageUrl: file.url || file.thumbUrl,
        metaData: file.name,
      })),
      deviceSpecificationsList:
        values.deviceSpecificationsList?.map((spec) => ({
          name: spec.name,
          deviceSpecificationItemsList:
            spec.deviceSpecificationItemsList?.map((item) => ({
              specificationProperty: item.specificationProperty,
              specificationValue: item.specificationValue,
            })) || [],
        })) || [],
    };
    onFinish(productData);
  };

  const handleUpload = async (options) => {
    const { file, onSuccess, onError, isMainImage } = options;
    setUploading(true);
    try {
      // Thay bằng logic upload thực tế của bạn
      const url = URL.createObjectURL(file);
      onSuccess(url);
      if (isMainImage) {
        setImageUrl(url);
      } else {
        setFileList((prev) => [
          ...prev,
          { url, name: file.name, uid: file.uid },
        ]);
      }
      message.success("Upload successful!");
    } catch (error) {
      onError(error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      {/* Basic Information */}
      <Card title="Basic Information" className="mb-4">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select a category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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

        <Row gutter={16}>
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
      </Card>

      {/* Description */}
      <Card title="Description" className="mb-4">
        <Row gutter={16}>
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

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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

        <Row gutter={16}>
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
      </Card>

      {/* Specifications */}
      <Card title="Detailed Specifications" className="mb-4">
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
                          ({ key: subKey, name: subName, ...subRestField }) => (
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
      </Card>

      {/* Product Images */}
      <Card title="Product Images" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Primary Image"
              rules={[
                { required: !isEditMode, message: "Please upload main image" },
              ]}
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
                    alt="product"
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
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              label="Additional Images"
              rules={[
                {
                  required: !isEditMode,
                  message: "Please upload at least one image",
                },
              ]}
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                fileList={fileList}
                onRemove={(file) => {
                  setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                }}
                customRequest={(options) =>
                  handleUpload({ ...options, isMainImage: false })
                }
                onPreview={handlePreview}
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
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEditMode ? "Update Product" : "Create Product"}
        </Button>
      </Form.Item>
    </Form>
  );
};
ProductForm.propTypes = {
  form: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isEditMode: PropTypes.bool,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
    categoryId: PropTypes.number,
    manufacturer: PropTypes.string,
    model: PropTypes.string,
    serialNumber: PropTypes.string,
    warrantyMonth: PropTypes.number,
    price: PropTypes.number,
    quantity: PropTypes.number,
    summary: PropTypes.string,
    description: PropTypes.string,
    specifications: PropTypes.string,
    notes: PropTypes.string,
    imageUrl: PropTypes.string,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageUrl: PropTypes.string,
        metaData: PropTypes.string,
      })
    ),
    deviceSpecificationsList: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        deviceSpecificationItemsList: PropTypes.arrayOf(
          PropTypes.shape({
            specificationProperty: PropTypes.string,
            specificationValue: PropTypes.string,
          })
        ),
      })
    ),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

ProductForm.defaultProps = {
  loading: false,
  isEditMode: false,
  initialValues: {},
};
export default ProductForm;
