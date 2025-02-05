import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  fetchRole,
  createManagerStaffs,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Select, Typography, Button } from "antd";
import { Col, Drawer, Form, Input, Row, Space, message } from "antd";
import SearchAndFilter from "./components/Search";
import AccountsTable from "./components/AccountsTable";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

export default function ManagerAccount() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      await dispatch(createManagerStaffs(values)).unwrap();
      message.success("Staff created successfully!");
      form.resetFields();
      setOpen(false);
    } catch (error) {
      message.error(`Error: ${error || "Something went wrong!"}`);
    }
  };

  const { users, pageIndex, pageSize, roles, totalCount } = useSelector(
    (state) => state.accounts
  );

  useEffect(() => {
    dispatch(fetchUsers({ pageIndex, pageSize, searchKeyword: "", role: 3 }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    dispatch(fetchRole());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center ">
          <SearchAndFilter />
          <Button
            className="m-4 font-medium"
            onClick={showDrawer}
            icon={<PlusOutlined />}
          >
            {" "}
            New Manager
          </Button>
        </div>

        <div className="bg-white rounded-md p-4 m-4 min-h-[60vh] overflow-hidden shadow-lg">
          <h1 className="text-xl font-bold mb-4">Staff List</h1>

          {/* Bộ lọc và phân trang */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Text className="mr-2">Page Size:</Text>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 120 }}
                className="border px-2 py-1"
                dropdownClassName="page-size-dropdown"
                optionLabelProp="label"
              >
                <Option value={10} label="10 items per page">
                  10
                </Option>
                <Option value={15} label="15 items per page">
                  15
                </Option>
                <Option value={30} label="30 items per page">
                  30
                </Option>
              </Select>
            </div>
            <div>
              <p>
                Total Users: <span className="font-bold">{totalCount}</span>
              </p>
            </div>
          </div>

          <AccountsTable
            users={users}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            roles={roles || []}
          />
        </div>
      </div>
      {/* new staff */}
      <Drawer
        title="Create Manager & Staff"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          hideRequiredMark
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter address" }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
                initialValue="3"
              >
                <Select placeholder="Select a role">
                  <Option value="3">Manager</Option>
                  {/* <Option value="3">Manager</Option> */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
