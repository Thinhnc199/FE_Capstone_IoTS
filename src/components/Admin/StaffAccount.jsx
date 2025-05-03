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
import { Select, Button, Modal, Form, Input, Row, Col, message } from "antd";
import SearchAndFilter from "./components/SearchAndFilter";
import AccountsTable from "./components/AccountsTable";
import { PlusOutlined } from "@ant-design/icons";
import { Roles } from "../../redux/constants";
const { Option } = Select;

export default function StaffAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await dispatch(createManagerStaffs(values)).unwrap();
      message.success("Staff created successfully!");
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error(`Error: ${error || "Something went wrong!"}`);
    }
  };

  const { users, pageIndex, pageSize, roles, totalCount, filters } =
    useSelector((state) => state.accounts);
  const currentTab = "staff";

  useEffect(() => {
    dispatch(
      fetchUsers({
        pageIndex,
        pageSize,
        searchKeyword: filters[currentTab].searchKeyword,
        role: Roles.STAFF,
        startFilterDate: filters[currentTab].startFilterDate,
        endFilterDate: filters[currentTab].endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    filters[currentTab].searchKeyword,
    filters[currentTab].startFilterDate,
    filters[currentTab].endFilterDate,
    totalCount,
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
      <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Staff List</h1>
        <div className="flex justify-between items-center">
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
            onClick={showModal}
            icon={<PlusOutlined />}
          >
            New Staff
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

      {/* Modal thêm staff */}
      <Modal
        title={<div className="text-lg">Create Staff</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Submit
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          hideRequiredMark
        >
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim().length === 0) {
                    return Promise.reject(new Error("Full name is required"));
                  }
                  if (value.trim().length < 2) {
                    return Promise.reject(
                      new Error("Full name must be at least 2 characters")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                type="phone"
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Phone is required" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Invalid phone number format",
                  },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim().length === 0) {
                    return Promise.reject(new Error("Address is required"));
                  }
                  if (value.trim().length < 5) {
                    return Promise.reject(
                      new Error("Address must be at least 5 characters")
                    );
                  }
                  if (value.trim().length > 255) {
                    return Promise.reject(
                      new Error("Address cannot exceed 255 characters")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue={Roles.STAFF}
          >
            <Select placeholder="Select a role" disabled>
              <Option value={Roles.STAFF}>Staff</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
