import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Titles from "../components/common/Titles";
import {
  fetchProducts,
  setPageIndex,
  setPageSize,
  setsearchKeyword,
  setCategoryFilterId,
} from "../redux/slices/productSlice";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
import ProductCard from "./Home/components/ProductCard";
import { Pagination, Input, Select } from "antd";
const { Option } = Select;
export default function ViewAllProduct() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { activeData } = useSelector((state) => state.materialCategory);
  const {
    items,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
    categoryFilterId,
    totalCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword,
        startFilterDate: startFilterDate,
        endFilterDate: endFilterDate,
        categoryFilterId: categoryFilterId,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
    categoryFilterId,
  ]);
  useEffect(() => {
    // Reset filter khi không có state từ navigation
    if (!location.state?.fromCategory) {
      dispatch(setCategoryFilterId(null));
    }
  }, [location, dispatch]);
  const handleSearchChange = (e) => {
    dispatch(setsearchKeyword(e.target.value));
  };

  const handlePageChange = (newPage, newPageSize) => {
    dispatch(setPageIndex(newPage));
    dispatch(setPageSize(newPageSize));
  };
  const handleCategoryChange = (value) => {
    dispatch(setCategoryFilterId(value === "default" ? null : value));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <BreadcrumbNav
        items={[{ label: "Home", path: "/" }, { label: "All Product" }]}
      />
      <div className="container mx-auto p-2 sm:p-4 bg-white shadow-lg my-4 sm:my-6">
        <Titles
          titleText="IOT ITEMS - VIEW ALL"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="flex flex-col md:flex-row justify-between my-6 gap-4">
          <Input
            placeholder="Search iot item by name"
            value={searchKeyword}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
            allowClear
          />

          <Select
            value={categoryFilterId || "default"}
            style={{ width: "200px" }}
            placeholder="Filter by category"
            onChange={handleCategoryChange}
          >
            <Option value="default">All Categories</Option>
            {activeData?.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="responsive-grid my-2 sm:my-4">
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">No products available</p>
          )}
        </div>

        {/* Phân trang */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "30", "50"]}
            responsive
          />
        </div>
      </div>
    </div>
  );
}
