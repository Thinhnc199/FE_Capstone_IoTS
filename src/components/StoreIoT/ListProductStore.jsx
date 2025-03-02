import {
  fetchProducts,
  setPageIndex,
  setPageSize,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DatePicker, Space } from "antd";
import SearchAndFilterProducts from "./components/SearchAndFilterProducts";
import ProductStoreTables from "./components/productStoreTables";
const { RangePicker } = DatePicker;
export default function ListProductStore() {
  const dispatch = useDispatch();

  const {
    items,
    totalCount,
    pageIndex,
    pageSize,
    error,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword,
        startFilterDate: startFilterDate, // Sử dụng filter của tab hiện tại
        endFilterDate: endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword, // Theo dõi thay đổi của filter trong tab hiện tại
    startFilterDate,
    endFilterDate,
  ]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  if (error) return <p>Error: {error}</p>;
  const onDateChange = (dates, dateStrings) => {
    dispatch(setStartFilterDate({ date: dateStrings[0] })); // Truyền thêm tab
    dispatch(setEndFilterDate({ date: dateStrings[1] })); // Truyền thêm tab
    console.log("Start Date:", dateStrings[0], "End Date:", dateStrings[1]);
  };

  return (
    <div className="font-Mainfont">
      <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Products List</h1>
        <Space wrap>
          <div className="mb-4">
            <p className="font-semibold text-sm">Search by related</p>
            <SearchAndFilterProducts
              setEndFilterDate={setEndFilterDate}
              setStartFilterDate={setStartFilterDate}
              setsearchKeyword={setsearchKeyword}
            />
          </div>
          <div className="flex flex-col items-start mb-4 p-0">
            {" "}
            <p className="font-semibold text-sm">filer date</p>
            <RangePicker onChange={onDateChange} style={{ width: 300 }} />
          </div>
        </Space>

        <ProductStoreTables
          items={items}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
