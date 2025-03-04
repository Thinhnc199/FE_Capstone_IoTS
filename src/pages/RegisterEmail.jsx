import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtpRequest } from "../api/apiConfig";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { success } = useSelector((state) => state.auth);

  // Handle success from redux or navigate directly from the API response
  useEffect(() => {
    if (success) {
      navigate("/registerCustomer");
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gửi yêu cầu OTP
      const response = await sendOtpRequest(email);
      console.log("OTP sent successfully:", response.data);

      // ✅ Hiển thị thông báo thành công
      toast.success("OTP has been sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Chuyển trang sau 3 giây để người dùng có thời gian đọc thông báo
      setTimeout(() => {
        navigate("/register-Customer");
      }, 2000);
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Register with Email
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#007AFF] hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>

      {/* ✅ ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </AuthenticationLayout>
  );
};

export default RegisterEmail;
