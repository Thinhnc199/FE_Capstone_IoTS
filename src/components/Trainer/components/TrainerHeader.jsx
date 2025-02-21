import { useEffect, useState } from "react";
import { FaStore } from "react-icons/fa";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import Logo2 from "../../../assets/logo2.png";

const TrainerHeader = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const trainerEmail = localStorage.getItem("email");
    if (trainerEmail) {
      setEmail(trainerEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
    <div className="flex items-center space-x-3">
      <img
        src={Logo2}
        alt="IoTS Logo"
        className="w-20 h-20 rounded-full"
        title="IoTS Logo"
      />
      <span className="text-lg font-semibold text-blue-600">
        Register to become a Trainer for IoTS
      </span>
    </div>
    <div className="flex items-center space-x-3">
      <FaStore size={20} />
      <span className="text-gray-700">Hi, {email}</span>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        title="Logout"
      >
        Logout
      </Button>
    </div>
  </header>
  );
};

export default TrainerHeader;
