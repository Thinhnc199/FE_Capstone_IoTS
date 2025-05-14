// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Pagination,
//   message,
//   Drawer,
//   Tag,
//   Space,
// } from "antd";
// import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
// import {
//   fetchPaginatedMaterialCategories,
//   createMaterialCategory,
//   updateMaterialCategory,
//   fetchMaterialCategoryById,
//   setPageIndex,
//   setSearchKeyword,
//   setStartFilterDate,
//   setEndFilterDate,
// } from "../../../redux/slices/materialCategorySlice";

// export default function CategoryManagement() {
//   const dispatch = useDispatch();
//   const [form] = Form.useForm();
//   const [open, setOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const {
//     paginatedData,
//     loading,
//     totalCount,
//     pageIndex,
//     pageSize,
//     filters,
//     selectedCategory,
//   } = useSelector((state) => state.materialCategory);

//   console.log("Redux paginatedDataaa:", paginatedData);

//   // useEffect(() => {
//   //   dispatch(
//   //     fetchPaginatedMaterialCategories({
//   //       pageIndex,
//   //       pageSize,
//   //       searchKeyword: "",

//   //     })
//   //   );
//   // }, [dispatch, pageIndex, pageSize]);
//   useEffect(() => {
//     // Gửi API với các tham số chỉ khi chúng có giá trị
//     const params = {
//       pageIndex,
//       pageSize,
//       searchKeyword: filters.all.searchKeyword || "",
//     };

//     // Thêm searchKeyword vào params nếu nó có giá trị khác "" (chuỗi rỗng)
//     // if (filters.all.searchKeyword) {
//     //   params.searchKeyword = filters.all.searchKeyword;
//     // }

//     dispatch(fetchPaginatedMaterialCategories(params));
//   }, [dispatch, pageIndex, pageSize, filters.all.searchKeyword]);

//   useEffect(() => {
//     if (selectedCategory && isEditing) {
//       form.setFieldsValue({
//         label: selectedCategory.label,
//         description: selectedCategory.description,
//       });
//     }
//   }, [selectedCategory, isEditing, form]);

//   const handleSearch = (values) => {
//     dispatch(setSearchKeyword(values.searchKeyword));
//     dispatch(setStartFilterDate(values.startFilterDate?.toISOString() || ""));
//     dispatch(setEndFilterDate(values.endFilterDate?.toISOString() || ""));
//     dispatch(setPageIndex(1));
//   };

//   const handlePageChange = (page) => {
//     dispatch(setPageIndex(page));
//   };

//   // const handleGetAllCategories = () => {
//   //   dispatch(fetchAllMaterialCategories());
//   // };

//   const showDrawer = () => {
//     setOpen(true);
//     setIsEditing(false);
//     form.resetFields();
//   };

//   const showEditDrawer = (id) => {
//     setSelectedId(id);
//     setIsEditing(true);
//     setOpen(true);
//     dispatch(fetchMaterialCategoryById(id));
//   };

//   const onClose = () => {
//     setOpen(false);
//     setIsEditing(false);
//   };

//   const onFinish = async (values) => {
//     try {
//       if (isEditing) {
//         await dispatch(
//           updateMaterialCategory({ id: selectedId, ...values })
//         ).unwrap();
//         message.success("Material category updated successfully!");
//       } else {
//         await dispatch(createMaterialCategory(values)).unwrap();
//         message.success("Material category created successfully!");
//       }
//       form.resetFields();
//       setOpen(false);
//       dispatch(
//         fetchPaginatedMaterialCategories({
//           pageIndex,
//           pageSize,
//           ...filters.all,
//         })
//       );
//     } catch (error) {
//       message.error(`Error: ${error || "Something went wrong!"}`);
//     }
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Label",
//       dataIndex: "label",
//       key: "label",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Status",
//       key: "status",
//       render: (text, record) => (
//         <Tag color={record.isActive ? "green" : "red"}>
//           {record.isActive ? "Active" : "Deactive"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Button
//           icon={<EditOutlined />}
//           onClick={() => showEditDrawer(record.id)}
//           style={{
//             backgroundColor: "white",
//             color: "#FF6600",
//             border: "1px solid #FF6600",
//           }}
//         >
//           Edit
//         </Button>
//       ),
//     },
//   ];
//   console.log("Redux paginatedDataaa Test:", paginatedData);
//   return (
//     <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
//       <h1 className="text-xl font-bold mb-4">Material Categories</h1>
//       <div className="flex justify-between items-center mb-4">
//         <Form layout="inline" onFinish={handleSearch}>
//           <Form.Item name="searchKeyword">
//             <Input placeholder="Search by name" />
//           </Form.Item>
//           <Form.Item name="startFilterDate">
//             <DatePicker placeholder="Start Date" />
//           </Form.Item>
//           <Form.Item name="endFilterDate">
//             <DatePicker placeholder="End Date" />
//           </Form.Item>
//           <Form.Item></Form.Item>

//           {/* <Button
//             type="primary"
//             icon={<SearchOutlined />}
//             onClick={() =>
//               dispatch(
//                 fetchPaginatedMaterialCategories({
//                   pageIndex,
//                   pageSize,
//                   ...filters.all,
//                 })
//               )
//             }
//           >
//             Search
//           </Button> */}
//           <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//             Search
//           </Button>
//         </Form>
//         <div>
//           <Button
//             type="primary"
//             style={{
//               backgroundColor: "#32CD32",
//               color: "White",
//               border: "1px solid white",
//             }}
//             onClick={showDrawer}
//             icon={<PlusOutlined />}
//             className="ml-2"
//           >
//             New Category
//           </Button>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={Array.isArray(paginatedData) ? paginatedData : []}
//         loading={loading}
//         rowKey="id"
//         pagination={false}
//         className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
//         bordered
//         style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
//       />
//       <div className="flex justify-between items-center mt-4">
//         <p>Total Count: {totalCount}</p>
//         <Pagination
//           current={pageIndex}
//           pageSize={pageSize}
//           total={totalCount}
//           onChange={handlePageChange}
//         />
//       </div>
//       <Drawer
//         title={
//           isEditing ? "Update Material Category" : "Create Material Category"
//         }
//         width={720}
//         onClose={onClose}
//         open={open}
//       >
//         <Form layout="vertical" form={form} onFinish={onFinish}>
//           <Form.Item
//             name="label"
//             label="Label"
//             rules={[{ required: true, message: "Please enter label" }]}
//           >
//             <Input placeholder="Enter label" />
//           </Form.Item>
//           <Form.Item name="description" label="Description">
//             <Input placeholder="Enter description" />
//           </Form.Item>
//           <Space>
//             <Button onClick={onClose}>Cancel</Button>
//             <Button type="primary" onClick={() => form.submit()}>
//               {isEditing ? "Update" : "Submit"}
//             </Button>
//           </Space>
//         </Form>
//       </Drawer>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Pagination,
  message,
  Drawer,
  Tabs,
  Tag,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import {
  fetchPaginatedMaterialCategories,
  createMaterialCategory,
  updateMaterialCategory,
  fetchMaterialCategoryById,
  setPageIndex,
  setPageSize,
  setSearchKeyword,
  setStartFilterDate,
  setEndFilterDate,
  setStatusFilter,
} from "../../../redux/slices/materialCategorySlice";
import TextArea from "antd/es/input/TextArea";

export default function CategoryManagement() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const {
    activeData,
    pendingData,
    totalCountActive,
    totalCountPending,
    loading,
    pageIndex,
    pageSize,
    filters,
    selectedCategory,
    statusFilter,
  } = useSelector((state) => state.materialCategory);

  // useEffect(() => {
  //   dispatch(
  //     fetchPaginatedMaterialCategories({
  //       pageIndex,
  //       pageSize,
  //       searchKeyword: "",

  //     })
  //   );
  // }, [dispatch, pageIndex, pageSize]);
  useEffect(() => {
    // Gửi API với các tham số chỉ khi chúng có giá trị
    const params = {
      pageIndex,
      pageSize,
      searchKeyword: filters.all.searchKeyword || "",
      statusFilter,
    };

    // Thêm searchKeyword vào params nếu nó có giá trị khác "" (chuỗi rỗng)
    // if (filters.all.searchKeyword) {
    //   params.searchKeyword = filters.all.searchKeyword;
    // }

    dispatch(fetchPaginatedMaterialCategories(params));
  }, [dispatch, pageIndex, pageSize, filters.all.searchKeyword, statusFilter]);

  const handleTabChange = (key) => {
    const newStatus = Number(key); // 1 = Active, 2 = Pending
    console.log("🔄 Changing Tab, New StatusFilter:", newStatus);

    setActiveTab(key);
    dispatch(setStatusFilter(newStatus));

    dispatch(
      fetchPaginatedMaterialCategories({
        pageIndex: 1, // Reset về trang đầu tiên khi đổi tab
        pageSize,
        searchKeyword: filters.all.searchKeyword || "",
        statusFilter: newStatus,
      })
    );
  };

  useEffect(() => {
    if (selectedCategory && isEditing) {
      form.setFieldsValue({
        label: selectedCategory.label,
        description: selectedCategory.description,
      });
    }
  }, [selectedCategory, isEditing, form]);

  const handleSearch = (values) => {
    dispatch(setSearchKeyword(values.searchKeyword));
    dispatch(setStartFilterDate(values.startFilterDate?.toISOString() || ""));
    dispatch(setEndFilterDate(values.endFilterDate?.toISOString() || ""));
    dispatch(setPageIndex(1));
  };

  // const handleGetAllCategories = () => {
  //   dispatch(fetchAllMaterialCategories());
  // };

  const showDrawer = (id = null) => {
    setOpen(true);
    if (id) {
      setSelectedId(id);
      setIsEditing(true);
      dispatch(fetchMaterialCategoryById(id));
    } else {
      setSelectedId(null);
      setIsEditing(false);
      form.resetFields();
    }
  };

  const showEditDrawer = (id) => {
    setSelectedId(id);
    setIsEditing(true);
    setOpen(true);
    dispatch(fetchMaterialCategoryById(id));
  };

  const onClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const onFinish = async (values) => {
    try {
      if (isEditing) {
        await dispatch(
          updateMaterialCategory({ id: selectedId, ...values })
        ).unwrap();
        message.success("Material category updated successfully!");
      } else {
        await dispatch(createMaterialCategory(values)).unwrap();
        message.success("Material category created successfully!");
      }
      form.resetFields();
      setOpen(false);
      dispatch(
        fetchPaginatedMaterialCategories({
          pageIndex,
          pageSize,
          ...filters.all,
        })
      );
    } catch (error) {
      console.error(`Error: ${error || "Something went wrong!"}`);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created By",
      dataIndex: "createdByEmail",
      key: "createdByEmail",
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Active" : "Deactive"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        const date = new Date(text);
        return (
          date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
          " " +
          date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => showEditDrawer(record.id)}
          style={{
            backgroundColor: "white",
            color: "#FF6600",
            border: "1px solid #FF6600",
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-md m-4 p-4 min-h-[60vh] overflow-hidden shadow-lg">
      <h1 className="text-xl font-bold mb-4">Material Categories</h1>
      <div className="flex justify-between items-center mb-4">
        <Form layout="inline" onFinish={handleSearch}>
          <Form.Item name="searchKeyword">
            <Input placeholder="Search by name" />
          </Form.Item>
          <Form.Item name="startFilterDate">
            <DatePicker placeholder="Start Date" />
          </Form.Item>
          <Form.Item name="endFilterDate">
            <DatePicker placeholder="End Date" />
          </Form.Item>
          <Form.Item></Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form>
        <div>
          <Button
            type="primary"
            style={{
              color: "White",
              border: "1px solid white",
            }}
            onClick={() => showDrawer()}
            icon={<PlusOutlined />}
            className="ml-2 bg-headerBg text-white"
          >
            New Category
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Active" key="1">
          <Table
            columns={columns}
            dataSource={activeData}
            loading={loading}
            rowKey="id"
            pagination={false}
            bordered
            className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
            style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
          />
          <div className="flex justify-between items-center mt-4 p-2">
            <p>
              <span className="font-medium">
                {(pageIndex - 1) * pageSize + 1} to{" "}
                {Math.min(pageIndex * pageSize, totalCountActive)} of{" "}
                {totalCountActive}
              </span>
            </p>
            <Pagination
              current={pageIndex}
              pageSize={pageSize}
              total={totalCountActive}
              showSizeChanger={true}
              pageSizeOptions={[10, 15, 30]}
              onShowSizeChange={(current, size) => {
                dispatch(setPageSize(size));
                dispatch(setPageIndex(1));
              }}
              onChange={(page) => dispatch(setPageIndex(page))}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Pending" key="2">
          <Table
            columns={columns}
            dataSource={pendingData}
            loading={loading}
            rowKey="id"
            pagination={false}
            bordered
          />
          <div className="flex justify-between items-center mt-4 p-2">
            <p>
              <span className="font-medium">
                {(pageIndex - 1) * pageSize + 1} to{" "}
                {Math.min(pageIndex * pageSize, totalCountPending)} of{" "}
                {totalCountPending}
              </span>
            </p>
            <Pagination
              current={pageIndex}
              pageSize={pageSize}
              total={totalCountPending}
              showSizeChanger={true}
              pageSizeOptions={[10, 15, 30]}
              onShowSizeChange={(current, size) => {
                dispatch(setPageSize(size));
                dispatch(setPageIndex(1));
              }}
              onChange={(page) => dispatch(setPageIndex(page))}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Drawer
        title={
          isEditing ? "Update Material Category" : "Create Material Category"
        }
        width={720}
        onClose={onClose}
        open={open}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="label"
            label="Label"
            rules={[{ required: true, message: "Please enter label" }]}
          >
            <Input placeholder="Enter label" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {isEditing ? "Update" : "Submit"}
            </Button>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
}
