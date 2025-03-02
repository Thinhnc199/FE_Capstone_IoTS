import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUrlImg } from "../../redux/slices/productSlice";
import { createProducts } from "../../redux/slices/productSlice";

import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export default function CreateProducts() {
  const { ProductDatas } = useSelector((state) => state.products);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  console.log("l", ProductDatas);

  const [productDetails, setProductDetails] = useState({
    isHardwareInformation: 0,
    isNetworkConnection: 0,
    isSoftwareOrOperations: 0,
    isPowerSource: 0,
    isSecurity: 0,
  });
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [deviceType, setDeviceType] = useState("1");
  const handleToggle = (field, value) => {
    setProductDetails((prev) => ({
      ...prev,
      [field]: value ? 1 : 0,
    }));
  };
  const handleUpload = async ({ file, onSuccess, onError, isMainImage }) => {
    try {
      const url = await dispatch(getUrlImg(file)).unwrap();
      if (isMainImage) {
        setImageUrl(url);
      } else {
        setFileList((prev) => [...prev, { url, name: file.name }]);
      }
      message.success("Tải ảnh lên thành công!");
      onSuccess();
    } catch (err) {
      message.error("Tải ảnh thất bại!");
      onError(err);
    }
  };

  useEffect(() => {
    // Set storeId from localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      form.setFieldsValue({ storeId: parseInt(userId) });
    }
  }, [form]);

  const handleSubmit = async (values) => {
    // Prepare attachments data
    let uploadedImageUrl = imageUrl; // Giữ URL ảnh nếu đã có

    if (fileList.length > 0 && !imageUrl) {
      // Upload ảnh trước khi gửi form
      const file = fileList[0].originFileObj;
      const response = await dispatch(getUrlImg(file)).unwrap();
      uploadedImageUrl = response; // Cập nhật URL ảnh từ API
    }
    const attachments = fileList.map((file, index) => ({
      id: index,
      imageUrl: file.thumbUrl || file.url,
      metaData: file.name,
    }));

    // Combine form values with attachments
    const productData = {
      ...ProductDatas,
      ...values,
      storeId: parseInt(localStorage.getItem("userId")),
      attachments: attachments,
      imageUrl: uploadedImageUrl || "string",
    };

    // Convert string numbers to actual numbers

    await dispatch(createProducts(productData))
      .unwrap()
      .then(() => {
        message.success("Sản phẩm đã được tạo thành công!");
      })
      .catch((error) => {
        message.error(`Lỗi: ${error.message}`);
      });
  };

  return (
    <div
      className="create-product-container"
      style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}
    >
      <h1>Tạo Sản Phẩm Mới</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          deviceType: 1,
          isHardwareInformation: 0,
          isNetworkConnection: 0,
          isSoftwareOrOperations: 0,
          isPowerSource: 0,
          isSecurity: 0,
          firmwareOTASupport: 0,
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="deviceType"
              label="Loại thiết bị"
              rules={[
                { required: true, message: "Vui lòng chọn loại thiết bị" },
              ]}
            >
              <Select
                placeholder="Chọn loại thiết bị"
                onChange={(value) => setDeviceType(value.pa)}
              >
                <Option value={1}> new</Option>
                <Option value={2}>Like new</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="processingSpeed"
              label="Tốc độ xử lý"
              rules={[
                { required: true, message: "Vui lòng nhập tốc độ xử lý" },
              ]}
            >
              <Input placeholder="Nhập tốc độ xử lý" />
            </Form.Item>

            <Form.Item
              name="serviceLife"
              label="Tuổi thọ dịch vụ"
              rules={[
                { required: true, message: "Vui lòng nhập tuổi thọ dịch vụ" },
              ]}
            >
              <Input placeholder="Nhập tuổi thọ dịch vụ" />
            </Form.Item>

            <Form.Item
              name="durability"
              label="Độ bền"
              rules={[{ required: true, message: "Vui lòng nhập độ bền" }]}
            >
              <Input placeholder="Nhập độ bền" />
            </Form.Item>

            <Form.Item
              name="summary"
              label="Tóm tắt"
              rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}
            >
              <Input placeholder="Nhập tóm tắt" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="ID danh mục"
              rules={[{ required: true, message: "Vui lòng nhập ID danh mục" }]}
            >
              <InputNumber
                placeholder="Nhập ID danh mục"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="manufacturer"
              label="Nhà sản xuất"
              rules={[
                { required: true, message: "Vui lòng nhập nhà sản xuất" },
              ]}
            >
              <Input placeholder="Nhập nhà sản xuất" />
            </Form.Item>

            <Form.Item
              name="model"
              label="Mẫu"
              rules={[{ required: true, message: "Vui lòng nhập mẫu" }]}
            >
              <Input placeholder="Nhập mẫu" />
            </Form.Item>

            <Form.Item
              name="serialNumber"
              label="Số seri"
              rules={[{ required: true, message: "Vui lòng nhập số seri" }]}
            >
              <Input placeholder="Nhập số seri" />
            </Form.Item>

            <Form.Item
              name="specifications"
              label="Thông số kỹ thuật"
              rules={[
                { required: true, message: "Vui lòng nhập thông số kỹ thuật" },
              ]}
            >
              <TextArea rows={4} placeholder="Nhập thông số kỹ thuật" />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Ghi chú"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <TextArea rows={4} placeholder="Nhập ghi chú" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá"
              rules={[
                { required: deviceType === "1", message: "Vui lòng nhập giá" },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá"
                style={{ width: "100%" }}
                disabled={deviceType !== "1"}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="secondHandPrice"
              label="Giá second hand"
              rules={[
                {
                  required: deviceType === "2",
                  message: "Vui lòng nhập giá second hand",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá second hand"
                style={{ width: "100%" }}
                disabled={deviceType !== "2"}
              />
            </Form.Item>

            <Form.Item
              name="secondhandQualityPercent"
              label="Phần trăm chất lượng second hand"
              rules={[
                {
                  message: "Vui lòng nhập phần trăm chất lượng second hand",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace("%", "")}
                style={{ width: "100%" }}
                disabled={deviceType !== "2"}
              />
            </Form.Item>

            <Form.Item label="Ảnh sản phẩm chính">
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

            <Form.Item name="attachments" label="Ảnh đính kèm">
              <Upload
                listType="picture-card"
                multiple={true}
                customRequest={(options) =>
                  handleUpload({ ...options, isMainImage: false })
                }
                // Thay đổi URL API upload của bạn
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item label="Thông tin phần cứng">
              <Switch
                checked={productDetails.isHardwareInformation === 1}
                onChange={(checked) =>
                  handleToggle("isHardwareInformation", checked)
                }
              />
            </Form.Item>

            {productDetails.isHardwareInformation === 1 && (
              <>
                <Form.Item name="mcU_MPU" label="MCU/MPU">
                  <Input placeholder="Nhập thông tin MCU/MPU" />
                </Form.Item>
                <Form.Item name="memory" label="Bộ nhớ">
                  <Input placeholder="Nhập thông tin bộ nhớ" />
                </Form.Item>
                <Form.Item name="wirelessConnection" label="Kết nối không dây">
                  <Input placeholder="Nhập thông tin kết nối không dây" />
                </Form.Item>
                <Form.Item name="connectivity" label="Kết nối">
                  <Input placeholder="Nhập thông tin kết nối" />
                </Form.Item>
                <Form.Item name="sensor" label="Cảm biến">
                  <Input placeholder="Nhập thông tin cảm biến" />
                </Form.Item>
              </>
            )}

            <Form.Item label="Kết nối mạng">
              <Switch
                checked={productDetails.isNetworkConnection === 1}
                onChange={(checked) =>
                  handleToggle("isNetworkConnection", checked)
                }
              />
            </Form.Item>

            {productDetails.isNetworkConnection === 1 && (
              <>
                <Form.Item name="protocol" label="Giao thức">
                  <Input placeholder="Nhập thông tin giao thức" />
                </Form.Item>
                <Form.Item
                  name="dataTransmissionStandard"
                  label="Tiêu chuẩn truyền dữ liệu"
                >
                  <Input placeholder="Nhập thông tin tiêu chuẩn truyền dữ liệu" />
                </Form.Item>
                <Form.Item name="networkSecurity" label="Bảo mật mạng">
                  <Input placeholder="Nhập thông tin bảo mật mạng" />
                </Form.Item>
              </>
            )}

            <Form.Item label="Phần mềm/Vận hành">
              <Switch
                checked={productDetails.isSoftwareOrOperations === 1}
                onChange={(checked) =>
                  handleToggle("isSoftwareOrOperations", checked)
                }
              />
            </Form.Item>

            {productDetails.isSoftwareOrOperations === 1 && (
              <>
                <Form.Item name="firmware" label="Firmware">
                  <Input placeholder="Nhập thông tin firmware" />
                </Form.Item>
                <Form.Item name="firmwareVersion" label="Phiên bản firmware">
                  <InputNumber
                    placeholder="Nhập phiên bản firmware"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="embeddedEperatingSystem"
                  label="Hệ điều hành nhúng"
                >
                  <Input placeholder="Nhập thông tin hệ điều hành nhúng" />
                </Form.Item>
                <Form.Item name="cloudservice" label="Dịch vụ đám mây">
                  <Input placeholder="Nhập thông tin dịch vụ đám mây" />
                </Form.Item>
                <Form.Item
                  name="firmwareOTASupport"
                  label="Hỗ trợ firmware OTA"
                >
                  <Select placeholder="Chọn hỗ trợ firmware OTA">
                    <Option value="0">Không</Option>
                    <Option value="1">Có</Option>
                  </Select>
                </Form.Item>
              </>
            )}
            <Form.Item label="Nguồn điện">
              <Switch
                checked={productDetails.isPowerSource === 1}
                onChange={(checked) => handleToggle("isPowerSource", checked)}
              />
            </Form.Item>

            {productDetails.isPowerSource === 1 && (
              <>
                <Form.Item name="operatingVoltage" label="Điện áp hoạt động">
                  <Input placeholder="Nhập thông tin điện áp hoạt động" />
                </Form.Item>
                <Form.Item name="powerConsumption" label="Mức tiêu thụ điện">
                  <Input placeholder="Nhập thông tin mức tiêu thụ điện" />
                </Form.Item>
                <Form.Item name="powerSource" label="Nguồn điện">
                  <Input placeholder="Nhập thông tin nguồn điện" />
                </Form.Item>
              </>
            )}

            <Form.Item label="Bảo mật">
              <Switch
                checked={productDetails.isSecurity === 1}
                onChange={(checked) => handleToggle("isSecurity", checked)}
              />
            </Form.Item>

            {productDetails.isSecurity === 1 && (
              <>
                <Form.Item name="dataEncryption" label="Mã hóa dữ liệu">
                  <Input placeholder="Nhập thông tin mã hóa dữ liệu" />
                </Form.Item>
                <Form.Item
                  name="deviceAuthentication"
                  label="Xác thực thiết bị"
                >
                  <Input placeholder="Nhập thông tin xác thực thiết bị" />
                </Form.Item>
                <Form.Item name="connectionDelay" label="Độ trễ kết nối">
                  <Input placeholder="Nhập thông tin độ trễ kết nối" />
                </Form.Item>
              </>
            )}
          </div>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
