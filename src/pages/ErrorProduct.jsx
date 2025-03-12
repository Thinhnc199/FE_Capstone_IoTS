import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import errorImage from "../assets/imgs/errorproduct.jpg";

const ErrorProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4 text-center">
      <img
        src={errorImage}
        alt="Error"
        className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto object-contain"
      />
      <p className="text-lg md:text-xl text-gray-600 mt-4">
        {`Oops! The product you're looking for doesn't exist.`}
      </p>
      <Button
        type="primary"
        className="mt-4 px-6 py-5 text-base md:text-lg"
        onClick={() => navigate("/")}
      >
        Back Home
      </Button>
    </div>
  );
};

export default ErrorProduct;
