import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchCombos,
  setPageIndex,
  setPageSize,
  setSearchKeyword,
} from "./../../redux/slices/comboSlice";
import CombosTables from "./components/combosTables";
import { Input } from "antd";

export default function ComboManagement() {
  const dispatch = useDispatch();

  const {
    combos: items,
    totalCount,
    pageIndex,
    pageSize,
    error,
    searchKeyword,
    loading,
  } = useSelector((state) => state.combo);

  useEffect(() => {
    dispatch(
      fetchCombos({
        pageIndex,
        pageSize,
        searchKeyword,
      })
    );
  }, [dispatch, pageIndex, pageSize, searchKeyword]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  // Hàm xử lý khi người dùng nhập từ khóa tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    dispatch(setSearchKeyword(value)); // Cập nhật searchKeyword trong Redux
    dispatch(setPageIndex(1)); // Reset về trang 1 khi tìm kiếm
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div className="bg-white rounded-md m-4 p-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Combo Management</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div>
              <p className="font-semibold text-sm">Search by related</p>
              <Input
                placeholder="Search combos by name..."
                value={searchKeyword}
                onChange={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <CombosTables
            items={items}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}
