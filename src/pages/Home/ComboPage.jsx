import { useEffect, useState, useCallback } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchCombos } from "./../../redux/slices/comboSlice";
import { Input, Select } from "antd";
import ComboList from "./components/ComboList";
import debounce from "lodash/debounce"; 

const { Option } = Select;

const ComboPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.combo);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  // Debounced function để gọi API
  const debouncedFetchCombos = useCallback(
    debounce((keyword) => {
      dispatch(fetchCombos({ pageIndex: 1, pageSize: 18, searchKeyword: keyword }));
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
    <div className="container mx-auto py-12 px-6 bg-mainColer">
      <div className="mb-8 p-4 rounded-md space-y-4 bg-white">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-headerBg mb-10">
          Combo List
        </h1>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
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