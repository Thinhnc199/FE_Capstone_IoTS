import {
  fetchProducts,
  setPageIndex,
  setPageSize,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchAndFilterProducts from "./components/SearchAndFilterProducts";
import ProductStoreTables from "./components/productStoreTables";

export default function ListProductStore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    window.scrollTo(0, 0);
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
    totalCount,
  ]);
  console.log("totaltotal", totalCount);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  const handleCreateProduct = () => {
    navigate("/store/create-product");
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
          </div>

          {/* Button Create Product */}
          <Button
            onClick={handleCreateProduct}
            className="font-medium"
            icon={<PlusOutlined />}
          >
            New Product
          </Button>
        </div>

        <ProductStoreTables
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
