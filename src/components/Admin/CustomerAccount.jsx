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

import { Roles } from "../../redux/constants";
import AccountsTable from "./components/AccountsTable";
import SearchAndFilter from "./components/SearchAndFilter";
export default function CustomerAccount() {
  const dispatch = useDispatch();

  const { users, pageIndex, pageSize, roles, totalCount, filters } =
    useSelector((state) => state.accounts);
  const currentTab = "customer";
  useEffect(() => {
    dispatch(
      fetchUsers({
        pageIndex,
        pageSize,
        searchKeyword: filters[currentTab].searchKeyword,
        role: Roles.CUSTOMER,
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

  return (
    <>
      <div className="">
        <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
          <h1 className="text-xl font-bold mb-4">Customer List</h1>
          <div className="mb-4">
            <p className="font-semibold text-sm">Search by related</p>
            <SearchAndFilter
              setEndFilterDate={setEndFilterDate}
              setStartFilterDate={setStartFilterDate}
              setsearchKeyword={setsearchKeyword}
              currentTab={currentTab}
            />
          </div>
          <AccountsTable
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
    </>
  );
}
