import { useEffect, useState } from "react";
import { FaStore } from "react-icons/fa";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
const StoreHeader = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
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
          src="/src/assets/logo1.png"
          alt="Logo"
          className="w-20 h-20 rounded-full"
        />
        <span className="text-lg font-semibold text-blue-600">
          Register to become a seller for IoTS
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <FaStore size={20} />
        <span className="text-gray-700">Hi, {email}</span>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          // className="mt-4"
          onClick={handleLogout}
        ></Button>
      </div>
    </header>
  );
};

export default StoreHeader;
