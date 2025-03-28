import {
  userRequests,
  setPageIndex,
  setPageSize,
  setEndFilterDate,
  setStartFilterDate,
  setsearchKeyword,
} from "../../redux/slices/userRequestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import SearchAndFilter from "./components/SearchAndFilter";
import RequestTable from "./components/RequestTable";

export default function UserRequest() {
  const dispatch = useDispatch();

  // const { totalCount } = useSelector((state) => state.accounts);
  const { userRequest, pageIndex, pageSize, totalCount, error, filters } =
    useSelector((state) => state.userrequest);
  const currentTab = "user";
  useEffect(() => {
    dispatch(
      userRequests({
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
    filters[currentTab].searchKeyword,
    filters[currentTab].startFilterDate,
    filters[currentTab].endFilterDate,
  ]);
  console.log("userrequest", userRequest);

  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div className="bg-white rounded-md p-4 min-h-[60vh] overflow-hidden shadow-lg">
        <h1 className="text-xl font-bold mb-4">User Requests</h1>

        <div className="mb-4">
          <p className="font-semibold text-sm">Search by related</p>
          <SearchAndFilter
            setEndFilterDate={setEndFilterDate}
            setStartFilterDate={setStartFilterDate}
            setsearchKeyword={setsearchKeyword}
            currentTab={currentTab}
          />
        </div>
        <RequestTable
          userRequest={userRequest}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
