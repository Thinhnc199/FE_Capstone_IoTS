import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRequestDetails } from "../../redux/slices/accountSlice";

const DetailUserRequest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userRequestInfo, userDetails, loading, error } = useSelector(
    (state) => state.userRequest
  );

  useEffect(() => {
    dispatch(fetchRequestDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!userRequestInfo || !userDetails) return <p>User not found</p>;

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

      {/* Thông tin yêu cầu người dùng */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Request Information</h3>
        <p>
          <strong>ID:</strong> {userRequestInfo.id}
        </p>
        <p>
          <strong>Email:</strong> {userRequestInfo.email}
        </p>
        <p>
          <strong>Status:</strong> {userRequestInfo.userRequestStatus.label}
        </p>
        <p>
          <strong>Role:</strong> {userRequestInfo.role.label}
        </p>
        <p>
          <strong>Created Date:</strong> {userRequestInfo.createdDate}
        </p>
      </div>

      {/* Thông tin người dùng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Full Name</h3>
          <p>{userDetails.fullname}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Username</h3>
          <p>{userDetails.username}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <p>{userDetails.email}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Phone</h3>
          <p>{userDetails.phone}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Address</h3>
          <p>{userDetails.address}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Created Date</h3>
          <p>{userDetails.createdDate}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailUserRequest;
