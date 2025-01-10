import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const SearchAndFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="">
      <div className="p-4 flex items-center space-x-2">
        {/* Ô input chứa icon search */}
        <div className="relative w-30vw">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 pl-10 pr-2 border border-gray-300 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Icon Search */}
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Bộ lọc */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2  border border-gray-300 rounded-md"
        >
          <option value="all">Filter</option>
          <option value="price">test</option>
          <option value="type">test</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
