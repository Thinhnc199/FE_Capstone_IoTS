import { useDispatch, useSelector } from "react-redux";
import { createProducts, getUrlImg } from "../../redux/slices/productSlice";
import { fetchAllMaterialCategories } from "../../redux/slices/materialCategorySlice";
import BreadcrumbNav from "../common/BreadcrumbNav";
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
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
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
  const [isUploading, setIsUploading] = useState(false);
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
          { url, name: file.name, uid: file.uid, thumbUrl: url },
        ]);
      }
      message.success("upload img success!");
      onSuccess();
    } catch (err) {
      message.error("upload img fail!");
      onError(err);
    } finally {
      // setUploading(false);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    // Kiểm tra ảnh chính
    if (!imageUrl) {
      message.error("Please upload main image");
      return;
    }

    // Kiểm tra đang upload
    if (isUploading) {
      message.warning("Please wait for images to finish uploading");
      return;
    }

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
        message.error(error);
      });
  };

  return (
    <div className="container mx-auto ">
      <div className=" max-w-6xl mb-4 ">
        <BreadcrumbNav
          items={[
            { label: "Home", path: "/" },
            { label: "store", path: "/store" },
            { label: "list product ", path: "/store/list-product" },
            { label: "new product " },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg ">
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
                  label={
                    <span>
                      Weight (kg)
                      <Tooltip title="Please enter weight in kilograms (e.g. 0.5 for 500 grams)">
                        <QuestionCircleOutlined
                          style={{ marginLeft: 5, color: "#1890ff" }}
                        />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter weight" },
                    {
                      type: "number",
                      min: 0.01,
                      message: "Weight must be at least 0.01 kg",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    placeholder="Enter weight in kg"
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
                  label={
                    <span>
                      Price (VND)
                      <Tooltip title="Please enter price in Vietnamese Dong">
                        <QuestionCircleOutlined
                          style={{ marginLeft: 5, color: "#1890ff" }}
                        />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter price" }]}
                >
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
                                          message:
                                            "Enter specification property",
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
                  name="mainImage"
                  label="Primary Image"
                  rules={[
                    { required: true, message: "Please upload main image" },
                  ]}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e.fileList}
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
    </div>
  );
}

CreateProductPage.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
