import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCombos } from "./../../redux/slices/comboSlice";
import { Input, Select } from "antd";
import ComboList from "./components/ComboList";
import debounce from "lodash/debounce";
import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import Titles from "../../components/common/Titles";
const { Option } = Select;

const ComboPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.combo);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  // Debounced function để gọi API
  const debouncedFetchCombos = useCallback(
    debounce((keyword) => {
      dispatch(
        fetchCombos({ pageIndex: 1, pageSize: 18, searchKeyword: keyword })
      );
    }, 600),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchCombos(searchKeyword);
    return () => debouncedFetchCombos.cancel();
  }, [searchKeyword, debouncedFetchCombos]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <BreadcrumbNav
        items={[{ label: "Home", path: "/" }, { label: "All combos" }]}
      />
      <div className="container mx-auto p-2 sm:p-4 bg-white shadow-lg my-4 sm:my-6">
        <Titles
          titleText="COMBOS - VIEW ALL"
          colorText="text-headerBg"
          strongText="font-semibold"
        />

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between my-6 gap-4">
          <Input
            placeholder="Search combo by name"
            value={searchKeyword}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
            allowClear
          />
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            style={{ width: "200px" }}
            placeholder="Sort by price"
          >
            <Option value="default">Default</Option>
            <Option value="priceLowToHigh">Price: Low to High</Option>
            <Option value="priceHighToLow">Price: High to Low</Option>
          </Select>
        </div>

        {/* Combo List */}
        <ComboList sortOrder={sortOrder} loading={loading} />
      </div>
    </div>
  );
};

export default ComboPage;
