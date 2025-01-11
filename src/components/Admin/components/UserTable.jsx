import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { activeUsers } from "../../../redux/slices/listUser";
import { deActiveUsers } from "../../../redux/slices/listUser";
const UserTable = ({
  users,
  pageSize,
  pageIndex,
  totalCount,
  onPageChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleActive = () => {
    dispatch(activeUsers({ id: selectedUser.id }));
    handleCloseModal();
  };
  const handleDeActive = () => {
    dispatch(deActiveUsers({ id: selectedUser.id }));
    handleCloseModal();
  };
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-200 w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  to={`/admin/list-account/${user.id}`}
                  className="text-blue-500"
                >
                  {user.id}
                </Link>
              </td>
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
              <td className="border border-gray-300 px-4 py-2">
                {user.isActive === 1 ? (
                  <span className="border border-green-700 text-green-700 bg-green-100 py-1 px-3 rounded-md text-sm">
                    Active
                  </span>
                ) : (
                  <span className="border border-gray-700 text-gray-700 bg-gray-100 py-1 px-3 rounded-md text-sm">
                    Deactive
                  </span>
                )}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="text-blue-500 flex justify-center items-center"
                  onClick={() => handleOpenModal(user)}
                >
                  <EllipsisOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Điều khiển phân trang */}
      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(totalCount / pageSize) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`px-3 py-1 border rounded ${
                  pageIndex === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">User Action</h2>
            <p className="mb-4">
              You are about to perform an action for user{" "}
              <strong>{selectedUser?.fullname}</strong> (ID: {selectedUser?.id}
              ).
            </p>

            <div className="flex justify-between">
              <button
                // onClick={() => dispatch(activeUsers({ id: selectedUser.id }))}
                onClick={handleActive}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Activate
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeActive}
              >
                Deactivate
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">
                Update User Role:
              </label>
              <select className="w-full px-3 py-2 mt-1 border rounded-md">
                {selectedUser?.roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  pageSize: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default UserTable;
