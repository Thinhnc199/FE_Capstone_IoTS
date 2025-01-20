// import {
//   fetchUsers,
//   setPageIndex,
//   setPageSize,
//   fetchRole,
// } from "../../redux/slices/accountSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";

// import SearchAndFilter from "./components/Search";
// import UserTable from "./components/UserTable";

// export default function ListAccount() {
//   const dispatch = useDispatch();

//   const { users, totalCount, pageIndex, pageSize, error, roles } = useSelector(
//     (state) => state.accounts
//   );
//   useEffect(() => {
//     dispatch(fetchUsers({ pageIndex, pageSize, searchKeyword: "" }));
//   }, [dispatch, pageIndex, pageSize]);
//   useEffect(() => {
//     dispatch(fetchRole());
//   }, [dispatch]);

//   const handlePageChange = (newPage) => {
//     dispatch(setPageIndex(newPage));
//   };

//   const handlePageSizeChange = (event) => {
//     dispatch(setPageSize(Number(event.target.value)));
//   };

//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       <SearchAndFilter />
//       <div className="bg-white rounded-md p-4 m-4 min-h-[60vh] overflow-hidden">
//         <h1 className="text-xl font-bold mb-4">User List</h1>

//         {/* Bộ lọc và phân trang */}
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <label className="mr-2">Page Size:</label>
//             <select
//               value={pageSize}
//               onChange={handlePageSizeChange}
//               className="border px-2 py-1"
//             >
//               <option value={2}>2</option>
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//             </select>
//           </div>
//           <div>
//             <p>
//               Total Users: <span className="font-bold">{totalCount}</span>
//             </p>
//           </div>
//         </div>

//         <UserTable
//           users={users}
//           pageSize={pageSize}
//           pageIndex={pageIndex}
//           totalCount={totalCount}
//           onPageChange={handlePageChange}
//           roles={roles || []}
//         />
//       </div>
//     </div>
//   );
// }
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
    <div className="p-4">
      <SearchAndFilter />
      <div className="bg-white rounded-md p-4 m-4 min-h-[60vh] overflow-hidden shadow-lg">
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
