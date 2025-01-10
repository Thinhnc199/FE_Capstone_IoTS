import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../api/apiConfig";

const DetailAccount = () => {
  const { id } = useParams(); // Lấy ID từ URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserById(id);
        setUser(response.data.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="mb-4">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Full Name:</strong> {user.fullname}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Roles:</strong>{" "}
          {user.roles.map((role) => role.label).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default DetailAccount;
