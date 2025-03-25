
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, Input, Select, Image, Tag } from "antd";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import {
//   getLabAdminPagination,
//   getLabStorePagination,
//   getLabTrainerPagination,
//   getLabCustomerPagination,
// } from "./../../../redux/slices/labSlice";
// import debounce from "lodash/debounce";

// const { Option } = Select;

// const LabsTable = ({ role, comboId, userId, storeId }) => {
//   const dispatch = useDispatch();
//   const { labs, loading } = useSelector((state) => state.lab);
//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 5,
//     totalCount: 0,
//   });
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [advancedFilter, setAdvancedFilter] = useState({
//     userId: userId || 0,
//     storeId: storeId || 0,
//     comboId: comboId || 0,
//     labStatus: 0,
//   });

//   useEffect(() => {
//     const fetchLabs = () => {
//       const params = {
//         pageIndex: pagination.pageIndex,
//         pageSize: pagination.pageSize,
//         searchKeyword,
//       };

//       if (role === "store") {
//         dispatch(
//           getLabStorePagination({ comboId: advancedFilter.comboId, params })
//         );
//       } else if (role === "trainer") {
//         dispatch(
//           getLabTrainerPagination({
//             advancedFilter: {
//               ...advancedFilter,
//               userId: advancedFilter.userId || userId,
//             },
//             paginationRequest: params,
//           })
//         );
//       } else if (role === "admin") {
//         dispatch(
//           getLabAdminPagination({
//             advancedFilter,
//             paginationRequest: params,
//           })
//         );
//       } else if (role === "customer") {
//         dispatch(
//           getLabCustomerPagination({
//             paginationRequest: params,
//           })
//         );
//       }
//     };

//     fetchLabs();
//   }, [
//     pagination.pageIndex,
//     pagination.pageSize,
//     searchKeyword,
//     advancedFilter,
//     dispatch,
//     role,
//     userId,
//   ]); // Các dependency cần thiết

//   const handleTableChange = (paginationData) => {
//     setPagination({
//       ...pagination,
//       pageIndex: paginationData.current,
//       pageSize: paginationData.pageSize,
//       totalCount: labs.totalCount || 0,
//     });
//   };

//   const handleSearch = debounce((value) => {
//     setSearchKeyword(value);
//     setPagination({ ...pagination, pageIndex: 1 });
//   }, 300);

//   const handleFilterChange = (key, value) => {
//     setAdvancedFilter((prev) => ({
//       ...prev,
//       [key]: value || 0,
//     }));
//     setPagination({ ...pagination, pageIndex: 1 });
//   };

//   const getStatusTag = (status) => {
//     switch (status) {
//       case 1:
//         return <Tag color="green">Approved</Tag>;
//       case 2:
//         return <Tag color="orange">Pending To Approved</Tag>;
//       case 3:
//         return <Tag color="red">Rejected</Tag>;
//       default:
//         return <Tag color="gray">Unknown</Tag>;
//     }
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       render: (text, record) => (
//         <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
//       ),
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
//         <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
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
//       render: (price) => `$${price}`,
//       sorter: (a, b) => a.price - b.price,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: getStatusTag,
//       filters: [
//         { text: "Approved", value: 1 },
//         { text: "Pending To Approved", value: 2 },
//         { text: "Rejected", value: 3 },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//   ];

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//         Labs Management ({role.charAt(0).toUpperCase() + role.slice(1)})
//       </h2>

//       {/* Search and Filters */}
//       <div className="flex gap-4 mb-4">
//         <Input
//           placeholder="Search by title..."
//           onChange={(e) => handleSearch(e.target.value)}
//           allowClear
//           className="w-1/3"
//         />
//         {(role === "trainer" || role === "admin") && (
//           <>
//             <Select
//               placeholder="Filter by Status"
//               allowClear
//               onChange={(value) => handleFilterChange("labStatus", value)}
//               className="w-1/4"
//             >
//               <Option value={1}>Approved</Option>
//               <Option value={2}>Pending To Approved</Option>
//               <Option value={3}>Rejected</Option>
//             </Select>
//             <Select
//               placeholder="Filter by Combo"
//               allowClear
//               onChange={(value) => handleFilterChange("comboId", value)}
//               className="w-1/4"
//             >
//               <Option value={9}>Combo for developer</Option>
//               <Option value={17}>August Smart Lock</Option>
//               <Option value={20}>IoT Home Automation Starter Kit</Option>
//             </Select>
//           </>
//         )}
//       </div>

//       {/* Table */}
//       <Table
//         columns={columns}
//         dataSource={labs?.data || []} // Giữ nguyên để tránh lỗi khi labs chưa load
//         loading={loading}
//         pagination={{
//           current: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           total: labs?.totalCount || 0,
//           showSizeChanger: true,
//           pageSizeOptions: ["5", "10", "20"],
//           showTotal: (total) => `Total ${total} labs`,
//         }}
//         onChange={handleTableChange}
//         rowKey="id"
//       />
//     </div>
//   );
// };

// LabsTable.propTypes = {
//   role: PropTypes.oneOf(["admin", "trainer", "store"]).isRequired,
//   comboId: PropTypes.number,
//   userId: PropTypes.number,
//   storeId: PropTypes.number,
// };

// LabsTable.defaultProps = {
//   comboId: 0,
//   userId: 0,
//   storeId: 0,
// };

// export default LabsTable;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Select, Image, Tag } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  getLabAdminPagination,
  getLabStorePagination,
  getLabTrainerPagination,
  getLabCustomerPagination,
} from "./../../../redux/slices/labSlice";
import debounce from "lodash/debounce";

const { Option } = Select;

const LabsTable = ({ role, comboId, userId, storeId }) => {
  const dispatch = useDispatch();
  const { labs, loading } = useSelector((state) => state.lab);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [advancedFilter, setAdvancedFilter] = useState({
    userId: userId || 0,
    storeId: storeId || 0,
    comboId: comboId || 0,
    labStatus: 0,
  });

  useEffect(() => {
    const fetchLabs = () => {
      const params = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        searchKeyword,
      };

      if (role === "store") {
        dispatch(
          getLabStorePagination({ comboId: advancedFilter.comboId, params })
        );
      } else if (role === "trainer") {
        dispatch(
          getLabTrainerPagination({
            advancedFilter: {
              ...advancedFilter,
              userId: advancedFilter.userId || userId,
            },
            paginationRequest: params,
          })
        );
      } else if (role === "admin") {
        dispatch(
          getLabAdminPagination({
            advancedFilter,
            paginationRequest: params,
          })
        );
      } else if (role === "customer") {
        dispatch(
          getLabCustomerPagination({
            paginationRequest: params,
          })
        );
      }
    };

    fetchLabs();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchKeyword,
    advancedFilter,
    dispatch,
    role,
    userId,
  ]);

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

  const handleFilterChange = (key, value) => {
    setAdvancedFilter((prev) => ({
      ...prev,
      [key]: value || 0,
    }));
    setPagination({ ...pagination, pageIndex: 1 });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">Approved</Tag>;
      case 2:
        return <Tag color="orange">Pending To Approved</Tag>;
      case 3:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const getDetailPath = (recordId) => {
    switch (role) {
      case "store":
        return `/store/detail-labRequest/${recordId}`;
      case "trainer":
        return `/trainer/detail-lab/${recordId}`;
      case "admin":
        return `/admin/detail-lab/${recordId}`;
      case "customer":
        return `/customer/lab-details/${recordId}`;
      default:
        return "#";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={getDetailPath(record.id)}>{text}</Link>
      ),
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
        <Link to={getDetailPath(record.id)}>{text}</Link>
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
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      filters: [
        { text: "Approved", value: 1 },
        { text: "Pending To Approved", value: 2 },
        { text: "Rejected", value: 3 },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Labs Management ({role.charAt(0).toUpperCase() + role.slice(1)})
      </h2>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-1/3"
        />
        {(role === "trainer" || role === "admin") && (
          <>
            <Select
              placeholder="Filter by Status"
              allowClear
              onChange={(value) => handleFilterChange("labStatus", value)}
              className="w-1/4"
            >
              <Option value={1}>Approved</Option>
              <Option value={2}>Pending To Approved</Option>
              <Option value={3}>Rejected</Option>
            </Select>
            <Select
              placeholder="Filter by Combo"
              allowClear
              onChange={(value) => handleFilterChange("comboId", value)}
              className="w-1/4"
            >
              <Option value={9}>Combo for developer</Option>
              <Option value={17}>August Smart Lock</Option>
              <Option value={20}>IoT Home Automation Starter Kit</Option>
            </Select>
          </>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={labs?.data || []} // Sử dụng labs.data vì state.labs là action.payload.data
        loading={loading}
        pagination={{
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: labs?.totalCount || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) => `Total ${total} labs`,
        }}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
};

LabsTable.propTypes = {
  role: PropTypes.oneOf(["admin", "trainer", "store", "customer"]).isRequired,
  comboId: PropTypes.number,
  userId: PropTypes.number,
  storeId: PropTypes.number,
};

LabsTable.defaultProps = {
  comboId: 0,
  userId: 0,
  storeId: 0,
};

export default LabsTable;