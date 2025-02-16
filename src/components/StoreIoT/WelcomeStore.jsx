import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Avatar, Card } from "antd";
import { fetchUserRequest } from "../../redux/slices/userAuthSlice";
import { UserOutlined } from "@ant-design/icons";
import DefaultAvatar from "../../assets/logo2.png";

const WelcomeStore = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.userAuth);

  const userId = localStorage.getItem("userId");
  const fullname = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "No email provided";
  const imageUrl = localStorage.getItem("imageUrl");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        await dispatch(fetchUserRequest(userId)).unwrap();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [dispatch, userId]);

  if (loading || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin size="large" />
        <p className="text-center text-gray-600 mt-2">
          Loading your store details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card
        className="shadow-lg rounded-2xl p-6 bg-white w-full max-w-md text-center"
        bordered={false}
      >
        <Avatar
          size={100}
          src={imageUrl || DefaultAvatar}
          icon={!imageUrl && <UserOutlined />}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome, {fullname}!
        </h1>
        <p className="text-gray-700">{email}</p>
        <p className="text-gray-500 mt-2">Your store dashboard is ready.</p>
      </Card>
    </div>
  );
};

export default WelcomeStore;
