import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  fetchRole,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SearchAndFilter from "./components/SearchAndFilter";
import AccountsTable from "./components/AccountsTable";
import { Roles } from "../../redux/constants";

export default function AdminAccount() {
  const dispatch = useDispatch();

  const {
    users,
    pageIndex,
    pageSize,
    error,
    roles,
    searchKeyword,
    startFilterDate,
    endFilterDate,
    totalCount,
  } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(
      fetchUsers({
        pageIndex,
        pageSize,
        searchKeyword,
        role: Roles.ADMIN,
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

  useEffect(() => {
    dispatch(fetchRole());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };
  const adminUsers = users.filter((user) => {
    return user.roles.some((role) => role.label === "Admin");
  });

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="bg-white rounded-md p-4 m-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">Admin List</h1>

        {/* <div className="flex justify-between items-center mb-4">
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
              <Option value={2} label="2 items per page">
                2
              </Option>
              <Option value={5} label="5 items per page">
                5
              </Option>
              <Option value={10} label="10 items per page">
                10
              </Option>
            </Select>
          </div>
          <div>
            <p>
              Total Users: <span className="font-bold">{TotalAcc}</span>
            </p>
          </div>
        </div> */}
        <div className="mb-4">
          <p className="font-semibold text-sm">Search by related</p>
          <SearchAndFilter
            setEndFilterDate={setEndFilterDate}
            setStartFilterDate={setStartFilterDate}
            setsearchKeyword={setsearchKeyword}
          />
        </div>
        <AccountsTable
          users={adminUsers}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          roles={roles || []}
        />
      </div>
    </div>
  );
}
