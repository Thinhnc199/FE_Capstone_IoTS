// // src/pages/ComboLabsManagement.js
// import  { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Select, Table, Spin, Alert, Typography } from 'antd';
// import {
//   fetchCombos,
//   setPageIndex,
//   setPageSize,
//   setSearchKeyword,
// } from './../../redux/slices/comboSlice';
// import { getLabMemberPagination } from './../../redux/slices/labSlice';

// const { Option } = Select;
// const { Title } = Typography;

// const ComboLabsManagement = () => {
//   const dispatch = useDispatch();

//   // Combo state from Redux
//   const {
//     combos,
//     loading: comboLoading,
//     error: comboError,
//     pageIndex: comboPageIndex,
//     pageSize: comboPageSize,
//   } = useSelector((state) => state.combo);

//   // Lab state from Redux
//   const { labs, loading: labLoading, error: labError } = useSelector((state) => state.lab);

//   const [selectedComboId, setSelectedComboId] = useState(null);

//   // Fetch combos when component mounts
//   useEffect(() => {
//     dispatch(fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: '' }));
//   }, [dispatch]);

//   // Fetch labs when a combo is selected
//   useEffect(() => {
//     if (selectedComboId) {
//       dispatch(
//         getLabMemberPagination({
//           comboId: selectedComboId,
//           params: { pageIndex: 0, pageSize: 10, searchKeyword: '' },
//         })
//       );
//     }
//   }, [selectedComboId, dispatch]);

//   // Handle combo selection
//   const handleComboChange = (value) => {
//     setSelectedComboId(value);
//   };

//   // Table columns for Labs
//   const labColumns = [
//     { title: 'ID', dataIndex: 'id', key: 'id' },
//     { title: 'Title', dataIndex: 'title', key: 'title' },
//     { title: 'Summary', dataIndex: 'summary', key: 'summary' },
//     { title: 'Combo Name', dataIndex: 'comboNavigationName', key: 'comboNavigationName' },
//     { title: 'Store Name', dataIndex: 'storeName', key: 'storeName' },
//     { title: 'Price', dataIndex: 'price', key: 'price' },
//     { title: 'Rating', dataIndex: 'rating', key: 'rating' },
//     { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate' },
//     { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (status === 1 ? 'Active' : 'Inactive') },
//   ];

//   return (
//     <div style={{ padding: '20px' }}>
//       <Title level={2}>Combo Labs Management</Title>

//       {/* Combo Dropdown */}
//       <div style={{ marginBottom: '20px' }}>
//         <Select
//           placeholder="Select a Combo"
//           style={{ width: 300 }}
//           onChange={handleComboChange}
//           loading={comboLoading}
//           value={selectedComboId}
//         >
//           {combos.map((combo) => (
//             <Option key={combo.id} value={combo.id}>
//               {combo.name || `Combo ${combo.id}`} {/* Adjust based on your combo data structure */}
//             </Option>
//           ))}
//         </Select>
//       </div>

//       {/* Error Handling */}
//       {comboError && (
//         <Alert message="Error loading combos" description={comboError} type="error" showIcon style={{ marginBottom: '20px' }} />
//       )}
//       {labError && (
//         <Alert message="Error loading labs" description={labError} type="error" showIcon style={{ marginBottom: '20px' }} />
//       )}

//       {/* Labs Table */}
//       {selectedComboId && (
//         <Spin spinning={labLoading}>
//           <Table
//             columns={labColumns}
//             dataSource={labs?.data?.data || []} // Adjust based on API response structure
//             rowKey="id"
//             pagination={{
//               current: labs?.data?.pageIndex + 1 || 1,
//               pageSize: labs?.data?.pageSize || 10,
//               total: labs?.data?.totalCount || 0,
//               onChange: (page) =>
//                 dispatch(
//                   getLabMemberPagination({
//                     comboId: selectedComboId,
//                     params: { pageIndex: page - 1, pageSize: 10, searchKeyword: '' },
//                   })
//                 ),
//             }}
//           />
//         </Spin>
//       )}
//     </div>
//   );
// };

// export default ComboLabsManagement;

// src/pages/ComboLabsManagement.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Table, Spin, Alert, Typography, Input, Image } from "antd";
import { fetchCombos, setSearchKeyword } from "./../../redux/slices/comboSlice";
import { getLabMemberPagination } from "./../../redux/slices/labSlice";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const ComboLabsManagement = () => {
  const dispatch = useDispatch();

  // Combo state from Redux
  const {
    combos,
    loading: comboLoading,
    error: comboError,
  } = useSelector((state) => state.combo);

  // Lab state from Redux
  const {
    labs,
    loading: labLoading,
    error: labError,
  } = useSelector((state) => state.lab);

  const [selectedComboId, setSelectedComboId] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch combos when component mounts or search text changes
  useEffect(() => {
    dispatch(
      fetchCombos({ pageIndex: 1, pageSize: 10, searchKeyword: searchText })
    );
  }, [dispatch, searchText]);

  // Fetch labs when a combo is selected
  useEffect(() => {
    if (selectedComboId) {
      dispatch(
        getLabMemberPagination({
          comboId: selectedComboId,
          params: { pageIndex: 0, pageSize: 10, searchKeyword: "" },
        })
      );
    }
  }, [selectedComboId, dispatch]);

  // Handle combo selection
  const handleComboChange = (value) => {
    setSelectedComboId(value);
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    dispatch(setSearchKeyword(value));
  };

  // Table columns for Labs
  const labColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/store/detail-labRequest/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="Lab Image"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    { title: "Summary", dataIndex: "summary", key: "summary" },
    {
      title: "Combo Name",
      dataIndex: "comboNavigationName",
      key: "comboNavigationName",
    },
    { title: "Store Name", dataIndex: "storeName", key: "storeName" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Combo Labs Management</Title>

      {/* Combo Dropdown with Search */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Select
          //   showSearch
          placeholder="Select a Combo"
          style={{ width: 300 }}
          onChange={handleComboChange}
          loading={comboLoading}
          value={selectedComboId}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          dropdownRender={(menu) => (
            <>
              <div style={{ padding: "8px" }}>
                <Search
                  placeholder="Search combos"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </div>
              {menu}
            </>
          )}
        >
          {combos.map((combo) => (
            <Option key={combo.id} value={combo.id}>
              {combo.name || `Combo ${combo.id}`}
            </Option>
          ))}
        </Select>
        {comboLoading && <Spin />}
      </div>

      {/* Error Handling */}
      {comboError && (
        <Alert
          message="Error loading combos"
          description={comboError}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}
      {labError && (
        <Alert
          message="Error loading labs"
          description={labError}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}

      {/* Labs Table */}
      {selectedComboId && (
        <Spin spinning={labLoading}>
          <Table
            columns={labColumns}
            dataSource={labs?.data?.data || []}
            rowKey="id"
            pagination={{
              current: labs?.data?.pageIndex + 1 || 1,
              pageSize: labs?.data?.pageSize || 10,
              total: labs?.data?.totalCount || 0,
              onChange: (page) =>
                dispatch(
                  getLabMemberPagination({
                    comboId: selectedComboId,
                    params: {
                      pageIndex: page - 1,
                      pageSize: 10,
                      searchKeyword: "",
                    },
                  })
                ),
            }}
          />
        </Spin>
      )}
    </div>
  );
};

export default ComboLabsManagement;
