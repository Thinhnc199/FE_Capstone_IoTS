import { useState, useEffect } from "react";
import DynamicBreadcrumb from "../../components/common/DynamicBreadcrumb";
import {
  Avatar,
  Card,
  Button,
  Input,
  message,
  Progress,
  Divider,
  Modal,
  Form,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, fetchUserById } from "../../redux/slices/accountSlice";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

// Giả lập dữ liệu từ API
// const detailUser = {
//   id: 120,
//   fullname: "John Doe",
//   username: "supercustomer@gmail.com",
//   email: "supercustomer@gmail.com",
//   phone: "0767676284",
//   address: "Bay Area, San Francisco, CA",
//   provinceId: 0,
//   provinceName: null,
//   districtId: 0,
//   districtName: null,
//   wardId: 0,
//   wardName: null,
//   gender: 2, // 1: Male, 2: Female
//   createdBy: null,
//   createdDate: "2025-03-02T08:09:45.713",
//   updatedBy: null,
//   updatedDate: "2025-03-02T08:09:45.713",
//   isActive: 1,
//   roles: [
//     {
//       id: 5,
//       label: "Customer",
//       orders: 5,
//       isActive: 1,
//     },
//   ],
//   imageUrl: null,
// };

// Component chính
export default function ProfilePage() {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  // const [formData, setFormData] = useState(detailUser);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { detailUser } = useSelector((state) => state.accounts);
  const userId = Number(localStorage.getItem("userId"));

  console.log("detailUser", detailUser);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById({ id: userId }));
    }
  }, [dispatch, userId]);
  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(e);
  };

  const handleSaveChanges = () => {
    message.success("Profile updated successfully!");
    // Dispatch API update here
  };

  const handleUpdatePassword = async (values) => {
    try {
      console.log("Updating password:", values);
      await dispatch(
        updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      );
      message.success("Password updated successfully!");
      setIsEditingPassword(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update password. Please try again.", error);
    }
  };

  return (
    <div className=" min-h-screen p-8 mx-auto container">
      <div className=" max-w-6xl mb-4 ">
        <DynamicBreadcrumb />
      </div>
      <div className=" flex items-center justify-center bg-blue-50 mx-auto">
        <div className="flex flex-col md:flex-row gap-8 w-full ">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3 shadow-sm shadow-blue-200 rounded-sm">
            <div className="flex flex-col items-center">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={detailUser.imageUrl}
                className="mb-6 border-4 border-blue-500"
              />
              <h2 className="text-2xl font-semibold">{detailUser.fullname}</h2>
              <p className="text-gray-400 text-lg">{detailUser.username}</p>

              <Button
                type="primary"
                icon={<EditOutlined />}
                className="mt-6"
                size="middle"
                onClick={() => setIsEditingPassword(true)}
              >
                Change password
              </Button>
            </div>

            <Divider className="bg-slate-300"></Divider>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <MailOutlined className="mr-2 text-xl text-yellow-500" />
                <span className="text-gray-700 text-lg">
                  {detailUser.email}
                </span>
              </div>
              <Divider className="bg-slate-300"></Divider>
              <div className="flex items-center">
                <PhoneOutlined className="mr-2 text-xl text-green-500" />
                <span className="text-gray-700 text-lg">
                  {detailUser.phone}
                </span>
              </div>
              <Divider className="bg-slate-300"></Divider>
              <div className="flex items-center">
                <EnvironmentOutlined className="mr-2 text-xl" />
                <span className="text-gray-700 text-lg">
                  {detailUser.address}
                </span>
              </div>
              <Divider className="bg-slate-300"></Divider>
              <p className="text-gray-700 text-lg">
                {detailUser.gender === 1 ? (
                  <ManOutlined className="mr-2 text-xl text-blue-400" />
                ) : (
                  <WomanOutlined className="mr-2 text-xl text-pink-400" />
                )}
                {detailUser.gender === 1 ? "Male" : "Female"}
              </p>
            </div>
          </Card>

          {/* Information and Project Status Cards */}
          <div className="w-full md:w-2/3 space-y-8">
            {/* Information Card */}
            <Card className="shadow-sm shadow-blue-200 w-full rounded-sm ">
              <div className="space-y-6">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-20 gap-y-6 items-center">
                  {/* Full Name */}
                  <p className="text-md font-semibold">Full Name:</p>
                  <Input
                    name="fullName"
                    value={detailUser.fullname}
                    onChange={handleChange}
                    className="w-full h-[2.5rem] rounded-sm"
                  />

                  {/* Email */}
                  <p className="text-md font-semibold">Email:</p>
                  <Input
                    name="email"
                    value={detailUser.email}
                    onChange={handleChange}
                    className="w-full h-[2.5rem] rounded-sm"
                  />

                  {/* Phone */}
                  <p className="text-md font-semibold">Phone:</p>
                  <Input
                    name="phone"
                    value={detailUser.phone}
                    onChange={handleChange}
                    className="w-full h-[2.5rem] rounded-sm"
                  />

                  {/* Address */}
                  <p className=" text-md font-semibold">Address:</p>
                  <Input
                    name="address"
                    value={detailUser.address}
                    onChange={handleChange}
                    className="w-full h-[2.5rem] rounded-sm"
                  />
                  {/* Save Changes Button */}
                  <span></span>
                  <Button
                    type="primary"
                    onClick={handleSaveChanges}
                    className="w-1/4 "
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>

            {/* Project Status Card */}
            <Card className="shadow-sm shadow-blue-200 rounded-sm ">
              <div>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Project Status
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-lg">Web Design</p>
                    <Progress percent={80} showInfo={false} />
                  </div>
                  <div>
                    <p className="text-lg">Website Markup</p>
                    <Progress percent={50} showInfo={false} status="success" />
                  </div>
                  <div>
                    <p className="text-lg">One Page</p>
                    <Progress
                      percent={30}
                      showInfo={false}
                      status="exception"
                    />
                  </div>

                  <div>
                    <p className="text-lg">Backend API</p>
                    <Progress percent={90} showInfo={false} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal Change Password */}
        <Modal
          title="Change Password"
          visible={isEditingPassword}
          onCancel={() => setIsEditingPassword(false)}
          footer={null}
          zIndex={1111}
        >
          <Form form={form} onFinish={handleUpdatePassword}>
            <Form.Item
              name="oldPassword"
              label="Old Password"
              rules={[
                { required: true, message: "Please input your old password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
