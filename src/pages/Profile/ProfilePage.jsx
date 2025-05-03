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
  // Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  fetchUserById,
  updateProfile,
} from "../../redux/slices/accountSlice";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// const { Option } = Select;
export default function ProfilePage() {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const dispatch = useDispatch();
  const { detailUser } = useSelector((state) => state.accounts);
  const userId = Number(localStorage.getItem("userId"));
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      !hasMinLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      return "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return null;
  };
  // Khởi tạo form values khi detailUser thay đổi
  useEffect(() => {
    if (detailUser) {
      profileForm.setFieldsValue({
        fullname: detailUser.fullname,
        phone: detailUser.phone,
        address: detailUser.address,
        gender: detailUser.gender,
        email: detailUser.email,
      });
    }
  }, [detailUser, profileForm]);
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById({ id: userId }));
    }
  }, [dispatch, userId]);

  const handleSaveChanges = async () => {
    try {
      const values = await profileForm.validateFields();
      const resultAction = await dispatch(
        updateProfile({
          id: userId,
          ...values,
        })
      );

      if (updateProfile.fulfilled.match(resultAction)) {
        message.success("Profile updated successfully!");
        dispatch(fetchUserById({ id: userId })); // Refresh data
      }
    } catch (error) {
      console.error("Update profile failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleUpdatePassword = async (values) => {
    try {
      // Check if new password is same as old password
      if (values.oldPassword === values.newPassword) {
        message.error("New password matches old password!");
        return;
      }

      const passwordError = validatePassword(values.newPassword);
      if (passwordError) {
        message.error(passwordError);
        return;
      }

      const resultAction = await dispatch(
        updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      );

      if (updatePassword.fulfilled.match(resultAction)) {
        setIsEditingPassword(false);
        form.resetFields();
        setTimeout(() => {
          handleLogout();
        }, 1000); // đợi 1 giây (1000ms)
      }
    } catch (error) {
      console.error(error);
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
            <Card className="shadow-sm shadow-blue-200 w-full rounded-sm">
              <Form form={profileForm}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-20 gap-y-6 items-center">
                    {/* Full Name */}
                    <div className="flex">
                      <p className="text-md font-semibold">Full Name:</p>
                      <span className="text-red-500 ml-1">*</span>
                    </div>

                    <Form.Item
                      name="fullname"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (!value || value.trim().length === 0) {
                              return Promise.reject(
                                new Error("Full name is required")
                              );
                            }
                            if (value.trim().length < 5) {
                              return Promise.reject(
                                new Error(
                                  "Full Name must be at least 5 characters"
                                )
                              );
                            }
                            if (value.trim().length > 50) {
                              return Promise.reject(
                                new Error(
                                  "Full Name cannot exceed 50 characters"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      className="w-full mb-0"
                    >
                      <Input className="w-full h-[2.5rem] rounded-sm" />
                    </Form.Item>
                    {/* Address */}

                    <div className="flex">
                      <p className="text-md font-semibold">Address:</p>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <Form.Item
                      name="address"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (!value || value.trim().length === 0) {
                              return Promise.reject(
                                new Error("Address is required")
                              );
                            }
                            if (value.trim().length < 5) {
                              return Promise.reject(
                                new Error(
                                  "Address must be at least 5 characters"
                                )
                              );
                            }
                            if (value.trim().length > 255) {
                              return Promise.reject(
                                new Error(
                                  "Address cannot exceed 255 characters"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      className="w-full mb-0"
                    >
                      <Input className="w-full h-[2.5rem] rounded-sm" />
                    </Form.Item>
                    {/* Phone */}

                    <div className="flex">
                      <p className="text-md font-semibold">Phone:</p>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone number!",
                        },
                        {
                          pattern: /^[0-9]{10,15}$/,
                          message: "Please enter a valid phone number!",
                        },
                      ]}
                      className="w-full mb-0"
                    >
                      <Input
                        disabled
                        className="w-full h-[2.5rem] rounded-sm"
                      />
                    </Form.Item>
                    {/* Address */}

                    <div className="flex">
                      <p className="text-md font-semibold">Email:</p>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Email!",
                        },
                      ]}
                      className="w-full mb-0"
                    >
                      <Input
                        disabled
                        className="w-full h-[2.5rem] rounded-sm"
                      />
                    </Form.Item>
                    {/* Gender */}
                    {/* <p className="text-md font-semibold">Gender:</p>
                    <Form.Item name="gender">
                      <Select className="w-full h-[2.5rem] rounded-sm">
                        <Option value={1}>Male</Option>
                        <Option value={2}>Female</Option>
                      </Select>
                    </Form.Item> */}

                    {/* Save Changes Button */}
                    <span></span>
                    <Button
                      type="primary"
                      onClick={handleSaveChanges}
                      className="w-1/4"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>

            {/* Project Status Card */}
            <Card className="shadow-sm shadow-blue-200 rounded-sm ">
              <div>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Order Statistics
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-lg">Total Orders</p>
                    <Progress percent={80} showInfo={false} />
                  </div>
                  <div>
                    <p className="text-lg">Completed</p>
                    <Progress percent={50} showInfo={false} status="success" />
                  </div>
                  <div>
                    <p className="text-lg">Pending</p>
                    <Progress
                      percent={30}
                      showInfo={false}
                      status="exception"
                    />
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
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && getFieldValue("oldPassword") === value) {
                      return Promise.reject(
                        new Error("New password matches old password!")
                      );
                    }
                    const error = validatePassword(value);
                    if (error) return Promise.reject(new Error(error));
                    return Promise.resolve();
                  },
                }),
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
