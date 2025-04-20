// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { sendOtpRequest } from "../api/apiConfig";
// import AuthenticationLayout from "../layouts/AuthenticationLayout";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const RegisterEmail = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const { success } = useSelector((state) => state.auth);

//   // Handle success from redux or navigate directly from the API response
//   useEffect(() => {
//     if (success) {
//       navigate("/registerCustomer");
//     }
//   }, [success, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Gửi yêu cầu OTP
//       const response = await sendOtpRequest(email);
//       console.log("OTP sent successfully:", response.data);

//       // ✅ Hiển thị thông báo thành công
//       toast.success("OTP has been sent successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });

//       // ✅ Chuyển trang sau 3 giây để người dùng có thời gian đọc thông báo
//       setTimeout(() => {
//         navigate("/register-Customer");
//       }, 2000);
//     } catch (err) {
//       console.error("Failed to send OTP:", err);
//       setError("Failed to send OTP. Please try again.");
//       toast.error("Failed to send OTP. Please try again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthenticationLayout>
//       <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
//         <div className="max-w-md w-full">
//           <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
//             Register with Email
//           </h2>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full p-3 mb-4 border rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={loading}
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </form>
//           <p className="text-center mt-4 text-gray-600">
//             Already have an account?{" "}
//             <a href="/login" className="text-[#007AFF] hover:underline">
//               Log In
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* ✅ ToastContainer để hiển thị thông báo */}
//       <ToastContainer />
//     </AuthenticationLayout>
//   );
// };

// export default RegisterEmail;

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

  // Email validation regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle success from redux or navigate directly from the API response
  useEffect(() => {
    if (success) {
      navigate("/registerCustomer");
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submission
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send OTP request
      const response = await sendOtpRequest(email);
      console.log("OTP sent successfully:", response.data);

      toast.success("OTP has been sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate after 2 seconds to allow toast visibility
      // setTimeout(() => {
      //   navigate("/register-Customer");
      // }, 2000);
      setTimeout(() => {
        navigate("/register-Customer", { state: { email } }); // Truyền email qua state
      }, 2000);
    } catch (err) {
      console.error("Failed to send OTP:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Register with Email
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email (e.g., user@example.com)"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] disabled:opacity-50 transition-all"
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

      <ToastContainer />
    </AuthenticationLayout>
  );
};

export default RegisterEmail;
