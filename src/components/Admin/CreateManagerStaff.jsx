import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  fetchRole,
  createManagerStaffs,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Form, Input, Button, Select, message, Row, Col } from "antd";
import SearchAndFilter from "./components/Search";
import UserTable from "./components/UserTable";

const { Option } = Select;

export default function CreateManagerStaff() {
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(createManagerStaffs(values))
      .then(() => {
        message.success("Manager/Staff created successfully!");
      })
      .catch((err) => {
        message.error(`Error: ${err.message}`);
      });
  };

  const { users, totalCount, pageIndex, pageSize, error, roles } = useSelector(
    (state) => state.accounts
  );

  useEffect(() => {
    dispatch(fetchUsers({ pageIndex, pageSize, searchKeyword: "" }));
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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <SearchAndFilter />

      <Row gutter={16}>
        {/* Form Create Manager */}
        <Col span={24} md={12}>
          <div className="bg-white rounded-md p-4 shadow-lg">
            <h1 className="text-xl font-bold mb-4">Create Manager & Staff</h1>
            <Form
              name="createManagerStaff"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[
                  { required: true, message: "Please input your full name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Role"
                name="roleId"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Select>
                  <Option value="2">Staff</Option>
                  <Option value="3">Manager</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* User Table with Pagination */}
        <Col span={24} md={12}>
          <div className="bg-white rounded-md p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="mr-2">Page Size:</label>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  style={{ width: 120 }}
                  className="border px-2 py-1"
                >
                  <Option value={2}>2</Option>
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                </Select>
              </div>

              <div>
                <p>
                  Total Users: <span className="font-bold">{totalCount}</span>
                </p>
              </div>
            </div>

            {/* User Table */}
            <UserTable
              users={users}
              pageSize={pageSize}
              pageIndex={pageIndex}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              roles={roles || []}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
