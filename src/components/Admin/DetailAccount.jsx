import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserDetail } from "../../redux/slices/detailUser";

const DetailAccount = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetail(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="bg-white rounded-md p-6 m-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-6">User Detail</h1>

      {/* Breadcrumb */}
      <div className="mb-4">
        <a href="/admin" className="text-blue-500 hover:underline">
          Home
        </a>{" "}
        / <span className="text-gray-500">User Detail</span>
      </div>

      {/* Thông tin người dùng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Full Name</h3>
          <p>{user.fullname}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Username</h3>
          <p>{user.username}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <p>{user.email}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Phone</h3>
          <p>{user.phone}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Address</h3>
          <p>{user.address}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Roles</h3>
          <ul>
            {user.roles.map((role) => (
              <li key={role.id} className="list-disc pl-5">
                {role.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Status</h3>
          {user.isActive === 1 ? (
            <span className="bg-green-100 text-green-700 border border-green-700 py-1 px-3 rounded-full">
              Active
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-700 border border-gray-700 py-1 px-3 rounded-full">
              Deactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Edit User
        </button>
      </div>
    </div>
  );
};

export default DetailAccount;
