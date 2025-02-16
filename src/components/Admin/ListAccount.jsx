import {
  fetchUsers,
  setPageIndex,
  setPageSize,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
  fetchRole,
} from "../../redux/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import SearchAndFilter from "./components/SearchAndFilter";
import UserTable from "./components/UserTable";

export default function ListAccount() {
  const dispatch = useDispatch();

  const { users, totalCount, pageIndex, pageSize, error, roles, filters } =
    useSelector((state) => state.accounts);
  const currentTab = "all";
  useEffect(() => {
    dispatch(
      fetchUsers({
        pageIndex,
        pageSize,
        searchKeyword: filters[currentTab].searchKeyword,
        startFilterDate: filters[currentTab].startFilterDate, // Sử dụng filter của tab hiện tại
        endFilterDate: filters[currentTab].endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    filters[currentTab].searchKeyword, // Theo dõi thay đổi của filter trong tab hiện tại
    filters[currentTab].startFilterDate,
    filters[currentTab].endFilterDate,
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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div className="bg-white rounded-md p-4  min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">User List</h1>

        <div className="mb-4">
          <p className="font-semibold text-sm">Search by related</p>
          <SearchAndFilter
            setEndFilterDate={setEndFilterDate}
            setStartFilterDate={setStartFilterDate}
            setsearchKeyword={setsearchKeyword}
            currentTab={currentTab}
          />
        </div>
        <UserTable
          users={users}
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
