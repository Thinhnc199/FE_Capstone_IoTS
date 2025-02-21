// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendOtpStore } from "../../redux/slices/storeSlice";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";

// const EmailOtpPage = () => {
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading } = useSelector((state) => state.store);

//   // Email validation regex
//   const isValidEmail = (email) => {
//     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
//   };

//   // Handle email input change
//   const handleEmailChange = (e) => {
//     const newEmail = e.target.value;
//     setEmail(newEmail);
//     setEmailError(!isValidEmail(newEmail)); 
//   };

//   const handleSendOtp = () => {
//     if (!isValidEmail(email)) {
//       message.error("Please enter a valid email address.");
//       return;
//     }

//     dispatch(sendOtpStore(email)).then((res) => {
//       if (!res.error) {
//         navigate("/OtpRegister");
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-[#007AFF]">
//           Store Registration
//         </h2>

//         {/* Email Input with Validation */}
//         <div className="mb-4">
//           <label className="block text-gray-600 text-sm font-medium mb-1">
//             Enter Your Email
//           </label>
//           <input
//             type="email"
//             placeholder="example@email.com"
//             value={email}
//             onChange={handleEmailChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00a8e8] transition-all ${
//               emailError ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {emailError && (
//             <p className="text-red-500 text-sm mt-1">Invalid email format</p>
//           )}
//         </div>

//         {/* Send OTP Button */}
//         <button
//           onClick={handleSendOtp}
//           disabled={loading || emailError || !email}
//           className={`w-full text-lg font-semibold py-2 rounded-lg bg-[#007AFF] text-white hover:bg-[#008ecb] transition-all duration-300 ${
//             loading || emailError || !email
//               ? "opacity-50 cursor-not-allowed"
//               : ""
//           }`}
//         >
//           {loading ? "Sending OTP..." : "Send OTP"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmailOtpPage;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../redux/slices/storeSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const EmailOtpPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [selectedRole, setSelectedRole] = useState(6); // Default to Store
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
    setEmailError(!isValidEmail(newEmail)); 
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(Number(e.target.value));
  };

  const handleSendOtp = () => {
    if (!isValidEmail(email)) {
      message.error("Please enter a valid email address.");
      return;
    }

    dispatch(sendOtp({ email, role: selectedRole })).then((res) => {
      if (!res.error) {
        navigate("/OtpRegister", { state: { email, role: selectedRole } });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#007AFF]">
          User Registration
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

        {/* Role Selection (Select dropdown) */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Select Your Role
          </label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00a8e8] transition-all"
          >
            <option value={4}>Trainer</option>
            <option value={6}>Store</option>
          </select>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOtp}
          disabled={loading || emailError || !email}
          className={`w-full text-lg font-semibold py-2 rounded-lg bg-[#007AFF] text-white hover:bg-[#008ecb] transition-all duration-300 ${
            loading || emailError || !email ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default EmailOtpPage;




// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// import { sendOtp } from "../../redux/slices/storeSlice";

// const EmailOtpPage = () => {
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(6); // Default to Store role
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Email validation regex
//   const isValidEmail = (email) => {
//     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
//   };

//   // Handle email input change
//   const handleEmailChange = (e) => {
//     const newEmail = e.target.value;
//     setEmail(newEmail);
//     setEmailError(!isValidEmail(newEmail)); 
//   };

//   // Handle role selection change
//   const handleRoleChange = (e) => {
//     setSelectedRole(e.target.value); // Set roleId based on user's selection
//   };

//   // Handle sending OTP
//   const handleSendOtp = () => {
//     if (!isValidEmail(email)) {
//       message.error("Please enter a valid email address.");
//       return;
//     }

//     const otpApi = selectedRole === 4
//       ? "/api/trainer/create-trainer-user-request-verify-otp"
//       : "/api/store/create-store-user-request-verify-otp";

//     dispatch(sendOtp({ email, otpApi })).then((res) => {
//       if (!res.error) {
//         navigate("/OtpRegister", { state: { email, selectedRole } });
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-[#00a8e8]">
//           User Registration
//         </h2>

//         {/* Role Selection */}
//         <div className="mb-4">
//           <label className="block text-gray-600 text-sm font-medium mb-1">
//             Select Your Role
//           </label>
//           <div className="flex space-x-4">
//             <label>
//               <input
//                 type="radio"
//                 value={4}
//                 checked={selectedRole === 4}
//                 onChange={handleRoleChange}
//                 className="mr-2"
//               />
//               Trainer
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value={6}
//                 checked={selectedRole === 6}
//                 onChange={handleRoleChange}
//                 className="mr-2"
//               />
//               Store
//             </label>
//           </div>
//         </div>

//         {/* Email Input */}
//         <div className="mb-4">
//           <label className="block text-gray-600 text-sm font-medium mb-1">
//             Enter Your Email
//           </label>
//           <input
//             type="email"
//             placeholder="example@email.com"
//             value={email}
//             onChange={handleEmailChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00a8e8] transition-all ${
//               emailError ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {emailError && (
//             <p className="text-red-500 text-sm mt-1">Invalid email format</p>
//           )}
//         </div>

//         {/* Send OTP Button */}
//         <button
//           onClick={handleSendOtp}
//           disabled={emailError || !email}
//           className={`w-full text-lg font-semibold py-2 rounded-lg bg-[#007AFF] text-white hover:bg-[#008ecb] transition-all duration-300 ${
//             emailError || !email ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           Send OTP
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmailOtpPage;
