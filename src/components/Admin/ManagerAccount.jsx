import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  fetchRole,
  createManagerStaffs,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Select, Button } from "antd";
import { Col, Drawer, Form, Input, Row, Space, message } from "antd";
import AccountsTable from "./components/AccountsTable";
import { PlusOutlined } from "@ant-design/icons";
import { Roles } from "../../redux/constants";
import SearchAndFilter from "./components/SearchAndFilter";
const { Option } = Select;

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

  const { users, pageIndex, pageSize, roles, totalCount, filters } =
    useSelector((state) => state.accounts);
  const currentTab = "manager";
  useEffect(() => {
    dispatch(
      fetchUsers({
        pageIndex,
        pageSize,
        searchKeyword: filters[currentTab].searchKeyword,
        role: Roles.MANAGER,
        startFilterDate: filters[currentTab].startFilterDate, // Sử dụng filter của tab hiện tại
        endFilterDate: filters[currentTab].endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    filters[currentTab].searchKeyword, // Theo dõi thay đổi của filter trong tab hiện tại
    filters[currentTab].startFilterDate,
    filters[currentTab].endFilterDate,
  ]);

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
      <div className="">
        <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
          <h1 className="text-xl font-bold mb-4">Manager List</h1>
          <div className="flex justify-between items-center ">
            <div className="mb-4">
              <p className="font-semibold text-sm">Search by related</p>
              <SearchAndFilter
                setEndFilterDate={setEndFilterDate}
                setStartFilterDate={setStartFilterDate}
                setsearchKeyword={setsearchKeyword}
                currentTab={currentTab}
              />
            </div>

            <Button
              className="font-medium"
              onClick={showDrawer}
              icon={<PlusOutlined />}
            >
              {" "}
              New Manager
            </Button>
          </div>
          <AccountsTable
            users={users}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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
                initialValue={Roles.MANAGER}
              >
                <Select placeholder="Select a role">
                  <Option value={Roles.MANAGER}>Manager</Option>
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
