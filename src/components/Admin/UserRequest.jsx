import {
  userRequests,
  setPageIndex,
  setPageSize,
} from "../../redux/slices/userRequestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Select, Typography } from "antd";

import RequestTable from "./components/RequestTable";

const { Option } = Select;
const { Text } = Typography;

export default function UserRequest() {
  const dispatch = useDispatch();

  // const { totalCount } = useSelector((state) => state.accounts);
  const { userRequest, pageIndex, pageSize, totalCount, error } = useSelector(
    (state) => state.userrequest
  );

  useEffect(() => {
    dispatch(userRequests({ pageIndex, pageSize, searchKeyword: "" }));
  }, [dispatch, pageIndex, pageSize]);
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

        <RequestTable
          userRequest={userRequest}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
