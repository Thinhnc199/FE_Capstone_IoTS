import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Typography, Spin } from "antd";
import {
  SettingFilled,
  PercentageOutlined,
  CalendarOutlined,
  SaveOutlined,
  SyncOutlined,
  HistoryOutlined,
  //   UserOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getGeneralSettings,
  UpdateGeneralSettings,
} from "../../redux/slices/settingSilce";

const { Title } = Typography;

const GeneralSettings = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { dataGeneralSettings, loading } = useSelector(
    (state) => state.setting
  );
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getGeneralSettings());
  }, [dispatch]);

  useEffect(() => {
    if (dataGeneralSettings) {
      form.setFieldsValue({
        applicationFeePercent: dataGeneralSettings.applicationFeePercent,
        orderSuccessDays: dataGeneralSettings.orderSuccessDays,
      });
    }
  }, [dataGeneralSettings, form]);

  const handleSubmit = async (values) => {
    try {
      setUpdating(true);
      await dispatch(
        UpdateGeneralSettings({
          id: dataGeneralSettings.id,
          applicationFeePercent: values.applicationFeePercent,
          orderSuccessDays: values.orderSuccessDays,
        })
      ).unwrap();

      message.success("Settings updated successfully");
    } catch (error) {
      message.error(error || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 min-h-screen container mx-auto ">
      <Title
        level={2}
        className="flex items-center text-2xl font-bold text-gray-800 mb-6"
      >
        <SettingFilled className="mr-2" />
        General Settings
      </Title>
      <Spin spinning={loading}>
        <Card className="shadow-md rounded-lg bg-white p-6">
          {dataGeneralSettings && (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label={
                  <span className="flex items-center">
                    <PercentageOutlined className="mr-2" />
                    Application Fee Percentage
                  </span>
                }
                name="applicationFeePercent"
                rules={[
                  {
                    required: true,
                    message: "Please enter the fee percentage",
                  },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    transform: (value) => Number(value),
                    message: "Fee must be between 0 and 100%",
                  },
                ]}
              >
                <Input type="number" suffix="%" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    Order Success Days
                  </span>
                }
                name="orderSuccessDays"
                rules={[
                  {
                    required: true,
                    message: "Please enter the number of days",
                  },
                  {
                    type: "number",
                    min: 1,
                    transform: (value) => Number(value),
                    message: "Number of days must be at least 1",
                  },
                ]}
              >
                <Input type="number" suffix="days" />
              </Form.Item>

              <Form.Item>
                <div className="flex space-x-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updating}
                    icon={<SaveOutlined />}
                  >
                    Save Settings
                  </Button>
                  <Button
                    onClick={() => dispatch(getGeneralSettings())}
                    icon={<SyncOutlined />}
                  >
                    Refresh
                  </Button>
                </div>
              </Form.Item>

              {dataGeneralSettings.updatedDate && (
                <div className="mt-4 text-gray-500 flex items-center">
                  <HistoryOutlined className="mr-1" />
                  <span className="mr-2">
                    Last Updated:{" "}
                    {new Date(dataGeneralSettings.updatedDate).toLocaleString()}
                  </span>
                  {/* <UserOutlined className="mr-1" /> */}
                  {/* <span>by user ID: {dataGeneralSettings.updatedBy}</span> */}
                </div>
              )}
            </Form>
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default GeneralSettings;
