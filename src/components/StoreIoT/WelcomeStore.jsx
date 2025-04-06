import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Avatar, Card } from "antd";
import { fetchUserRequest } from "../../redux/slices/userAuthSlice";
import { UserOutlined } from "@ant-design/icons";
import DefaultAvatar from "./../../assets/logo1.png";
import { useNavigate } from "react-router-dom";

const WelcomeStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.userAuth);

  const userId = localStorage.getItem("userId");
  const fullname = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "No email provided";
  const imageUrl = localStorage.getItem("imageUrl") || DefaultAvatar;

  const [countdown, setCountdown] = useState(3);

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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/store/dashboard");
    }
  }, [countdown, navigate]);

  if (loading || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Spin size="large" />
        <p className="text-center text-gray-600 mt-4 text-lg">
          Loading your store details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <Card
        className="shadow-xl rounded-3xl p-8 bg-white w-full max-w-lg text-center transform transition-all hover:scale-105"
        bordered={false}
      >
        <Avatar
          size={140}
          src={DefaultAvatar}
          icon={!imageUrl && <UserOutlined />}
          className="mb-6 border-4 border-blue-200 rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome, {fullname}!
        </h1>
        <p className="text-gray-600 text-lg">{email}</p>
        <p className="text-gray-500 mt-4 text-base font-medium">
          Your store dashboard is ready. Redirecting in{" "}
          <span className="text-blue-600 font-semibold">{countdown}</span>...
        </p>
      </Card>
    </div>
  );
};

export default WelcomeStore;
