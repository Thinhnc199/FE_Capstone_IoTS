// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendOtpStore } from "../../redux/slices/storeSlice";
// import { useNavigate } from "react-router-dom";
// import { Input, Button, Spin } from "antd";

// const EmailOtpPage = () => {
//   const [email, setEmail] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading } = useSelector((state) => state.store);

//   const handleSendOtp = () => {
//     if (!email) return;
//     dispatch(sendOtpStore(email)).then((res) => {
//       if (!res.error) {
//         navigate("/OtpRegister");
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-[#00a8e8]">
//           Store Registration
//         </h2>
//         <Input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mb-4"
//         />
//         <Button type="primary" onClick={handleSendOtp} block disabled={loading}>
//           {loading ? <Spin /> : "Send OTP"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EmailOtpPage;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpStore } from "../../redux/slices/storeSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const EmailOtpPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.store);

  // Email validation regex
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(!isValidEmail(newEmail)); // Validate email in real-time
  };

  const handleSendOtp = () => {
    if (!isValidEmail(email)) {
      message.error("Please enter a valid email address.");
      return;
    }

    dispatch(sendOtpStore(email)).then((res) => {
      if (!res.error) {
        navigate("/OtpRegister");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#007AFF]">
          Store Registration
        </h2>

        {/* Email Input with Validation */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Enter Your Email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00a8e8] transition-all ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">Invalid email format</p>
          )}
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOtp}
          disabled={loading || emailError || !email}
          className={`w-full text-lg font-semibold py-2 rounded-lg bg-[#007AFF] text-white hover:bg-[#008ecb] transition-all duration-300 ${
            loading || emailError || !email
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default EmailOtpPage;
