// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Card, Input, Pagination, Tag, Button, Row, Col, Spin } from "antd";
// import { Link } from "react-router-dom";
// import { getLabCustomerPagination } from "./../../redux/slices/labSlice";
// import debounce from "lodash/debounce";
// import "./CustomerLabsManagement.css";

// const { Meta } = Card;

// const CustomerLabsManagement = () => {
//   const dispatch = useDispatch();
//   const { labs, loading } = useSelector((state) => state.lab);
//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 10,
//   });
//   const [searchKeyword, setSearchKeyword] = useState("");

//   useEffect(() => {
//     const fetchLabs = () => {
//       const params = {
//         paginationRequest: {
//           pageIndex: pagination.pageIndex - 1, // API dùng index bắt đầu từ 0
//           pageSize: pagination.pageSize,
//           searchKeyword,
//         },
//       };
//       dispatch(getLabCustomerPagination(params));
//     };

//     fetchLabs();
//   }, [pagination.pageIndex, searchKeyword, dispatch]); // Di chuyển fetchLabs vào trong useEffect

//   const handleSearch = debounce((value) => {
//     setSearchKeyword(value);
//     setPagination((prev) => ({ ...prev, pageIndex: 1 }));
//   }, 300);

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, pageIndex: page }));
//   };

//   const getStatusTag = (status) => {
//     switch (status) {
//       case 1:
//         return <Tag color="green">Approved</Tag>;
//       case 2:
//         return <Tag color="orange">Pending</Tag>;
//       case 3:
//         return <Tag color="red">Rejected</Tag>;
//       default:
//         return <Tag color="gray">Unknown</Tag>;
//     }
//   };

//   return (
//     <div className="customer-labs-container p-6">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//         Explore Labs
//       </h2>

//       {/* Search */}
//       <Input
//         placeholder="Search labs by title..."
//         onChange={(e) => handleSearch(e.target.value)}
//         allowClear
//         className="mb-6 w-1/3"
//       />

//       {/* Loading Spinner */}
//       {loading ? (
//         <div className="text-center">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <>
//           {/* Cards */}
//           <Row gutter={[16, 16]}>
//             {labs?.data?.map((lab) => (
//               <Col xs={24} sm={12} md={8} lg={6} key={lab.id}>
//                 <Link to={`/customer/lab-details/${lab.id}`}>
//                   <Card
//                     hoverable
//                     cover={
//                       <img
//                         alt={lab.title}
//                         src={lab.imageUrl}
//                         style={{ height: 150, objectFit: "cover" }}
//                       />
//                     }
//                   >
//                     <Meta
//                       title={lab.title}
//                       description={
//                         <div>
//                           <p>
//                             <strong>Store:</strong> {lab.storeName}
//                           </p>
//                           <p>{getStatusTag(lab.status)}</p>
//                           <Button
//                             type="primary"
//                             size="small"
//                             style={{ marginTop: 8 }}
//                           >
//                             Tutorial
//                           </Button>
//                         </div>
//                       }
//                     />
//                   </Card>
//                 </Link>
//               </Col>
//             ))}
//           </Row>

//           {/* Pagination */}
//           {labs?.totalCount > 0 && (
//             <div className="mt-6 text-center">
//               <Pagination
//                 current={pagination.pageIndex}
//                 pageSize={pagination.pageSize}
//                 total={labs.totalCount}
//                 onChange={handlePageChange}
//                 showSizeChanger={false}
//                 showTotal={(total) => `Total ${total} labs`}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // Xóa PropTypes và defaultProps nếu không dùng userId
// // Nếu muốn giữ userId, uncomment và tích hợp vào logic
// // CustomerLabsManagement.propTypes = {
// //   userId: PropTypes.number,
// // };
// // CustomerLabsManagement.defaultProps = {
// //   userId: 0,
// // };

// export default CustomerLabsManagement;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Input, Pagination, Tag, Button, Row, Col, Spin } from "antd";
import { Link } from "react-router-dom";
import { getLabCustomerPagination } from "./../../redux/slices/labSlice";
import debounce from "lodash/debounce";
import "./CustomerLabsManagement.css";

const { Meta } = Card;

const CustomerLabsManagement = () => {
  const dispatch = useDispatch();
  const { labs, loading } = useSelector((state) => state.lab);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchLabs = () => {
      setSearchLoading(true);
      const params = {
        paginationRequest: {
          pageIndex: pagination.pageIndex - 1,
          pageSize: pagination.pageSize,
          searchKeyword,
        },
      };
      dispatch(getLabCustomerPagination(params)).finally(() =>
        setSearchLoading(false)
      );
    };
    fetchLabs();
  }, [pagination.pageIndex, searchKeyword, dispatch, setSearchLoading,pagination.pageSize]); 

  const handleSearch = debounce((value) => {
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, 300);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }));
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">Approved</Tag>;
      case 2:
        return <Tag color="orange">Pending</Tag>;
      case 3:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  return (
    <div className="max-h-screen bg-white rounded-sm shadow-sm mx-auto p-4 my-4 container">
      <h2 className="text-3xl font-bold mb-8 text-headerBg font-Mainfont">
        Explore Labs
      </h2>

      {/* Search */}
      <div className="mb-8 flex justify-center">
        <Input
          placeholder="Search labs by title..."
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-full max-w-md rounded-lg border-border focus:ring-textColer"
          prefix={searchLoading ? <Spin size="small" /> : null}
          aria-label="Search labs"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" style={{ color: "#007AFF" }} />
        </div>
      ) : (
        <>
          {/* Cards */}
          <Row gutter={[24, 24]} className="justify-center">
            {labs?.data?.map((lab) => (
              <Col xs={24} sm={12} md={8} lg={6} key={lab.id}>
                <Link to={`/customer/lab-details/${lab.id}`} aria-label={`View details of ${lab.title}`}>
                  <Card
                    hoverable
                    className="shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105 bg-card"
                    cover={
                      <img
                        alt={lab.title}
                        src={lab.imageUrl}
                        className="h-40 object-cover w-full"
                      />
                    }
                  >
                    <Meta
                      title={<span className="text-lg font-semibold text-foreground">{lab.title}</span>}
                      description={
                        <div className="text-muted-foreground">
                          <p>
                            <strong>Store:</strong> {lab.storeName}
                          </p>
                          <p className="mt-2">{getStatusTag(lab.status)}</p>
                          <Button
                            type="primary"
                            size="small"
                            className="mt-3 bg-headerBg hover:bg-textColer transition-colors"
                          >
                            View Tutorial
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {labs?.totalCount > 0 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                current={pagination.pageIndex}
                pageSize={pagination.pageSize}
                total={labs.totalCount}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} labs`}
                className="text-textColer"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerLabsManagement;