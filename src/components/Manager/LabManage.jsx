// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, Input, Select, Image, Tag } from "antd";
// import { useNavigate } from "react-router-dom";
// import { getLabAdminPagination } from "./../../redux/slices/labSlice";
// import debounce from "lodash/debounce";

// const { Option } = Select;

// const LabsTable = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { labs, totalCount } = useSelector((state) => state.lab);

//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 5,
//     totalCount: 0,
//   });
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [labStatus, setLabStatus] = useState(null);

//   useEffect(() => {
//     const fetchLabs = () => {
//       const params = {
//         paginationRequest: {
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           searchKeyword,
//         },
//         advancedFilter: {
//           labStatus: labStatus !== null ? labStatus : undefined,
//         },
//       };

//       dispatch(getLabAdminPagination(params));
//     };

//     fetchLabs();
//   }, [
//     pagination.pageIndex,
//     pagination.pageSize,
//     searchKeyword,
//     labStatus,
//     dispatch,
//   ]);

//   useEffect(() => {
//     setPagination((prev) => ({
//       ...prev,
//       totalCount: totalCount || 0,
//     }));
//   }, [totalCount]);

//   const handleTableChange = (paginationData) => {
//     setPagination({
//       ...pagination,
//       pageIndex: paginationData.current,
//       pageSize: paginationData.pageSize,
//       totalCount: labs?.totalCount || 0,
//     });
//   };

//   const handleSearch = debounce((value) => {
//     setSearchKeyword(value);
//     setPagination({ ...pagination, pageIndex: 1 });
//   }, 300);

//   const handleFilterChange = (value) => {
//     setLabStatus(value);
//     setPagination({ ...pagination, pageIndex: 1 });
//   };

//   const getStatusTag = (status) => {
//     switch (status) {
//       case 1:
//         return <Tag color="green">Active</Tag>;
//       case 2:
//         return <Tag color="yellow">Pending</Tag>;
//       case 3:
//         return <Tag color="red">Rejected</Tag>;
//       default:
//         return <Tag color="grey">Draft</Tag>;
//     }
//   };

//   const handleViewLabDetail = (labId) => {
//     navigate(`/manager/labs-detail/${labId}`);
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Image",
//       dataIndex: "imageUrl",
//       key: "imageUrl",
//       render: (url) => (
//         <Image
//           width={50}
//           src={url || "https://via.placeholder.com/50"}
//           alt="Lab Image"
//         />
//       ),
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//       sorter: (a, b) => a.title.localeCompare(b.title),
//       render: (text, record) => (
//         <span
//           className="cursor-pointer text-blue-500 hover:underline"
//           onClick={() => handleViewLabDetail(record.id)}
//         >
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: "Summary",
//       dataIndex: "summary",
//       key: "summary",
//     },
//     {
//       title: "Combo",
//       dataIndex: "comboNavigationName",
//       key: "comboNavigationName",
//     },
//     {
//       title: "Store",
//       dataIndex: "storeName",
//       key: "storeName",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (price) => `${price.toLocaleString("vi-VN")} VND`,
//       sorter: (a, b) => a.price - b.price,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: getStatusTag,
//       filters: [
//         { text: "Active", value: 1 },
//         { text: "Pending", value: 2 },
//         { text: "Rejected", value: 3 },
//         { text: "Draft", value: 4 },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//   ];

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-lg">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Labs Management</h2>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex gap-4 mb-4">
//         <Input
//           placeholder="Search by title..."
//           onChange={(e) => handleSearch(e.target.value)}
//           allowClear
//           className="w-1/3"
//         />
//         <Select
//           placeholder="Filter by Status"
//           allowClear
//           onChange={handleFilterChange}
//           className="w-1/4"
//         >
//           <Option value={1}>Active</Option>
//           <Option value={2}>Pending</Option>
//           <Option value={3}>Rejected</Option>
//           <Option value={4}>Draft</Option>
//         </Select>
//       </div>

//       {/* Table */}
//       <Table
//         columns={columns}
//         dataSource={labs?.data || []}
//         // loading={loading}
//         pagination={{
//           current: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           total: pagination.totalCount,
//           showSizeChanger: true,
//           pageSizeOptions: ["5", "10", "20"],
//           showTotal: (total) => `Total ${total} labs`,
//         }}
//         onChange={handleTableChange}
//         rowKey="id"
//         className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
//         style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
//       />
//     </div>
//   );
// };

// LabsTable.propTypes = {};

// export default LabsTable;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Image, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { getLabAdminPagination } from "./../../redux/slices/labSlice";
import debounce from "lodash/debounce";

const LabsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { labs, totalCount } = useSelector((state) => state.lab);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchLabs = () => {
      const params = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        searchKeyword,
      };

      dispatch(getLabAdminPagination(params));
    };

    fetchLabs();
  }, [pagination.pageIndex, pagination.pageSize, searchKeyword, dispatch]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalCount: totalCount || 0,
    }));
  }, [totalCount]);

  const handleTableChange = (paginationData) => {
    setPagination({
      ...pagination,
      pageIndex: paginationData.current,
      pageSize: paginationData.pageSize,
      totalCount: labs?.totalCount || 0,
    });
  };

  const handleSearch = debounce((value) => {
    setSearchKeyword(value);
    setPagination({ ...pagination, pageIndex: 1 });
  }, 300);

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">Active</Tag>;
      case 2:
        return <Tag color="yellow">Pending</Tag>;
      case 3:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="grey">Draft</Tag>;
    }
  };

  const handleViewLabDetail = (labId) => {
    navigate(`/manager/labs-detail/${labId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <Image
          width={50}
          src={url || "https://via.placeholder.com/50"}
          alt="Lab Image"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => handleViewLabDetail(record.id)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
    },
    {
      title: "Combo",
      dataIndex: "comboNavigationName",
      key: "comboNavigationName",
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      filters: [
        { text: "Active", value: 1 },
        { text: "Pending", value: 2 },
        { text: "Rejected", value: 3 },
        { text: "Draft", value: 4 },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Labs Management</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-1/3"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={labs?.data || []}
        // loading={loading}
        pagination={{
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: pagination.totalCount,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) => `Total ${total} labs`,
        }}
        onChange={handleTableChange}
        rowKey="id"
        className="[&_.ant-table-thead_th]:!bg-headerBg [&_.ant-table-thead_th]:!border-none [&_.ant-table-thead_th]:!text-white [&_.ant-pagination]:p-2"
        style={{ borderColor: "#1E90FF", headerBg: "#F5222D" }}
      />
    </div>
  );
};

LabsTable.propTypes = {};

export default LabsTable;
