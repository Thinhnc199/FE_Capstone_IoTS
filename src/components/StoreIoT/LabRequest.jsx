
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLabStorePagination, clearError } from "../../redux/slices/labSlice";
import RequestLabTable from "./components/RequestLabTable";
import { Input, Spin, notification } from "antd";

const { Search } = Input;

const LabRequest = () => {
  const dispatch = useDispatch();
  const { labs, loading, error } = useSelector((state) => state.lab);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      const params = { pageIndex, pageSize, searchKeyword };
      try {
        const result = await dispatch(getLabStorePagination(params)).unwrap();
        console.log("API response:", result);
      } catch {
        // Lỗi sẽ được xử lý trong useEffect bên dưới
      }
    };
    fetchLabs();
  }, [dispatch, pageIndex, pageSize, searchKeyword]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Failed to fetch labs",
        description: error.message || "Unknown error",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (labs?.totalCount !== undefined) {
      setTotalCount(labs.totalCount);
    }
  }, [labs]);

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPageIndex(1);
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setPageIndex(1);
  };

  // Chỉ lấy labs.data nếu labs tồn tại và có data
  const labData = Array.isArray(labs?.data?.data) ? labs.data.data : [];
  // console.log("labData:", labData);

  return (
    <div className="p-4">
      <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Lab Request Management</h1>

        <div className="mb-4">
          <Search
            placeholder="Search labs by keyword..."
            onSearch={handleSearch}
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            enterButton
            style={{ width: 300 }}
          />
        </div>

        <Spin spinning={loading} tip="Loading labs...">
          {labData.length === 0 && !loading ? (
            <p>No labs found.</p>
          ) : (
            <RequestLabTable
              labs={labData}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default LabRequest;
