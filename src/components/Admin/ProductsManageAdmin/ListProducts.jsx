import {
  fetchProducts,
  setPageIndex,
  setPageSize,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DatePicker } from "antd";
import SearchAndFilterProducts from "../../StoreIoT/components/SearchAndFilterProducts";
import ProductsTables from "../components/productsTables";

const { RangePicker } = DatePicker;

export default function ListProducts() {
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
        searchKeyword,
        startFilterDate,
        endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  const onDateChange = (dates, dateStrings) => {
    dispatch(setStartFilterDate(dateStrings[0])); // Ensure payload matches reducer expectations
    dispatch(setEndFilterDate(dateStrings[1])); // Ensure payload matches reducer expectations
    console.log("Start Date:", dateStrings[0], "End Date:", dateStrings[1]);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Products List</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div>
              <p className="font-semibold text-sm">Search by related</p>
              <SearchAndFilterProducts
                onSearch={(keyword) => dispatch(setsearchKeyword(keyword))}
                onFilterDate={(startDate, endDate) => {
                  dispatch(setStartFilterDate(startDate));
                  dispatch(setEndFilterDate(endDate));
                }}
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="font-semibold text-sm">Filter date</p>
              <RangePicker onChange={onDateChange} style={{ width: 300 }} />
            </div>
          </div>
        </div>

        <ProductsTables
          items={items}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Create Product Modal */}
      </div>
    </div>
  );
}
