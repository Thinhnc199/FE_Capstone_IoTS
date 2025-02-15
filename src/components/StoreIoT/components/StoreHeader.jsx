import { useSelector } from "react-redux";
import { FaStore } from "react-icons/fa";

const StoreHeader = () => {
  const { userDetails } = useSelector((state) => state.userAuth);
  console.log("User Details:", userDetails?.email);
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
        <span className="text-gray-700">Hi, {userDetails?.email}</span>
      </div>
    </header>
  );
};

export default StoreHeader;
