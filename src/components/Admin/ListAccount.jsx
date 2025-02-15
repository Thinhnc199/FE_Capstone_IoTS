import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  fetchRole,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Select, Typography } from "antd";
import SearchAndFilter from "./components/Search";
import UserTable from "./components/UserTable";

const { Option } = Select;
const { Text } = Typography;

export default function ListAccount() {
  const dispatch = useDispatch();

  const { users, totalCount, pageIndex, pageSize, error, roles } = useSelector(
    (state) => state.accounts
  );

  useEffect(() => {
    dispatch(fetchUsers({ pageIndex, pageSize, searchKeyword: "" }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    dispatch(fetchRole());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <SearchAndFilter />
      <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">User List</h1>

        {/* Bộ lọc và phân trang */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Text className="mr-2">Page Size:</Text>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ width: 120 }}
              className="border px-2 py-1"
              dropdownClassName="page-size-dropdown"
              optionLabelProp="label"
            >
              <Option value={10} label="10 items per page">
                10
              </Option>
              <Option value={15} label="15 items per page">
                15
              </Option>
              <Option value={30} label="30 items per page">
                30
              </Option>
            </Select>
          </div>
          <div>
            <p>
              Total Users: <span className="font-bold">{totalCount}</span>
            </p>
          </div>
        </div>

        <UserTable
          users={users}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          roles={roles || []}
        />
      </div>
    </div>
  );
}
