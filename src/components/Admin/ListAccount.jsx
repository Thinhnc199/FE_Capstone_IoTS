import {
  fetchUsers,
  setPageIndex,
  setPageSize,
} from "../../redux/slices/listUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Breadcrumb from "../Atom/Breadcrumb";
import SearchAndFilter from "./components/Search";
export default function ListAccount() {
  const breadcrumbItems = [
    { label: "Home", link: "/admin" },
    { label: "List Account", link: "" },
  ];

  const dispatch = useDispatch();

  const { users, totalCount, pageIndex, pageSize, loading, error } =
    useSelector((state) => state.userList);

  // Gọi API khi component được render
  useEffect(() => {
    dispatch(fetchUsers({ pageIndex, pageSize, searchKeyword: "" }));
  }, [dispatch, pageIndex, pageSize]);

  // Xử lý phân trang
  const handlePageChange = (newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <Breadcrumb items={breadcrumbItems} />
      <SearchAndFilter />
      <h1 className="text-xl font-bold mb-4">User List</h1>

      {/* Bộ lọc và phân trang */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Page Size:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border px-2 py-1"
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div>
          <p>
            Total Users: <span className="font-bold">{totalCount}</span>
          </p>
        </div>
      </div>

      {/* Danh sách người dùng */}
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.fullname}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.roles.map((role) => role.label).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Điều khiển phân trang */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalCount / pageSize) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                pageIndex === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
