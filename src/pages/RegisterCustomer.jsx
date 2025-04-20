import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { registerCustomer } from "../api/apiConfig";

const RegisterCustomer = () => {
  const location = useLocation(); // Lấy location để truy cập state

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: location.state?.email || "", // Lấy email từ state nếu có
    fullname: "",
    phone: "",
    address: "",
    gender: 1,
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate();

  const validateStep1 = () => {
    let errors = {};
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Email is invalid.";

    if (!form.fullname.trim()) errors.fullname = "Full name is required.";

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^[0][0-9]{9}$/.test(form.phone)) {
      errors.phone = "Phone must be 10 digits and start with 0.";
    }

    if (!form.address.trim()) errors.address = "Address is required.";
    return errors;
  };

  const validateStep2 = () => {
    let errors = {};
    if (!form.otp.trim()) errors.otp = "OTP is required.";
    if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handleGenderChange = (e) => {
    setForm({ ...form, gender: Number(e.target.value) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phone, only allow numbers
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (error[name]) {
      setError({ ...error, [name]: "" });
    }
  };

  const handleSendEmail = async () => {
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      // toast.success("An OTP has been sent to your email.", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
      setStep(2);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const data = {
      userInfomation: {
        email: form.email,
        fullname: form.fullname,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        roleId: 5,
      },
      otp: form.otp,
      password: form.password,
    };

    try {
      const response = await registerCustomer(data);
      toast.success(
        response.message || "Registration successful! Please log in.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      // window.location.href = "/login";
    } catch (error) {
      console.error("Error registering customer:", error);
      // toast.error("Registration failed. Please try again.", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            {step === 1 ? "Create Account Customer" : "Verify OTP"}
          </h2>

          {step === 1 ? (
            <>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.email ? "border-red-500" : "border-gray-300"
                  } ${
                    location.state?.email
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : ""
                  }`}
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!location.state?.email}
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.fullname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.fullname}
                  onChange={handleChange}
                />
                {error.fullname && (
                  <p className="text-red-500 text-sm mt-1">{error.fullname}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number (e.g., 0123456789)"
                  maxLength="10"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.phone}
                  onChange={handleChange}
                />
                {error.phone && (
                  <p className="text-red-500 text-sm mt-1">{error.phone}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.address ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.address}
                  onChange={handleChange}
                />
                {error.address && (
                  <p className="text-red-500 text-sm mt-1">{error.address}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="text-gray-600 text-sm font-medium block mb-2">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={handleGenderChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
                >
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
              >
                Next Step
              </button>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-[#007AFF] hover:text-blue-600 transition-colors"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.otp}
                  onChange={handleChange}
                />
                {error.otp && (
                  <p className="text-red-500 text-sm mt-1">{error.otp}</p>
                )}
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all ${
                    error.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {error.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </AuthenticationLayout>
  );
};

export default RegisterCustomer;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AuthenticationLayout from "../layouts/AuthenticationLayout";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { registerCustomer } from "../api/apiConfig";

// const RegisterCustomer = () => {
//   const [form, setForm] = useState({
//     email: "",
//     fullname: "",
//     phone: "",
//     address: "",
//     gender: 1,
//     otp: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     let errors = {};
//     if (!form.email.trim()) errors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email is invalid.";
//     if (!form.fullname.trim()) errors.fullname = "Full name is required.";
//     if (!form.phone.trim()) errors.phone = "Phone number is required.";
//     else if (!/^[0][0-9]{9}$/.test(form.phone))
//       errors.phone = "Phone must be 10 digits and start with 0.";
//     if (!form.address.trim()) errors.address = "Address is required.";
//     if (!form.otp.trim()) errors.otp = "OTP is required.";
//     if (form.password.length < 6)
//       errors.password = "Password must be at least 6 characters.";
//     if (form.password !== form.confirmPassword)
//       errors.confirmPassword = "Passwords do not match.";
//     return errors;
//   };

//   const handleGenderChange = (e) => {
//     setForm({ ...form, gender: Number(e.target.value) });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "phone" && !/^\d*$/.test(value)) return;
//     setForm({ ...form, [name]: value });
//     if (error[name]) setError({ ...error, [name]: "" });
//   };

//   const handleChangeOTP = (e, index) => {
//     const newOtp = form.otp.split("") || Array(6).fill("");
//     newOtp[index] = e.target.value;
//     setForm({ ...form, otp: newOtp.join("") });
//     if (error.otp) setError({ ...error, otp: "" });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setError(errors);
//       return;
//     }

//     const data = {
//       userInfomation: {
//         email: form.email,
//         fullname: form.fullname,
//         phone: form.phone,
//         address: form.address,
//         gender: form.gender,
//         roleId: 5,
//       },
//       otp: form.otp,
//       password: form.password,
//     };

//     try {
//       const response = await registerCustomer(data);
//       toast.success(response.message || "Registration successful! Please log in.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/login");
//     } catch (error) {
//       console.error("Error registering customer:", error);
//       toast.error("Registration failed. Please try again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <AuthenticationLayout>
//       <div className="flex justify-center items-center min-h-screen w-full p-4">
//         <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-bold text-[#007AFF] mb-6 text-center">
//             Create Account
//           </h2>

//           <form onSubmit={handleRegister} className="space-y-6">
//             {/* Thông tin cá nhân */}
//             <div className="grid grid-cols-1 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.email}
//                   onChange={handleChange}
//                 />
//                 {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   name="fullname"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.fullname ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.fullname}
//                   onChange={handleChange}
//                 />
//                 {error.fullname && <p className="text-red-500 text-xs mt-1">{error.fullname}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   maxLength="10"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.phone ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.phone}
//                   onChange={handleChange}
//                 />
//                 {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.address ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.address}
//                   onChange={handleChange}
//                 />
//                 {error.address && <p className="text-red-500 text-xs mt-1">{error.address}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                 <select
//                   value={form.gender}
//                   onChange={handleGenderChange}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
//                 >
//                   <option value={1}>Male</option>
//                   <option value={2}>Female</option>
//                 </select>
//               </div>
//             </div>

//             {/* OTP */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter OTP</label>
//               <div className="flex justify-center space-x-2">
//                 {Array.from({ length: 6 }, (_, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     name={`otp-${index}`}
//                     maxLength={1}
//                     className={`w-10 h-10 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                       error.otp ? "border-red-500" : "border-gray-300"
//                     }`}
//                     value={form.otp[index] || ""}
//                     onChange={(e) => handleChangeOTP(e, index)}
//                     onKeyUp={(e) => {
//                       if (e.target.value.length === 1 && index < 5) {
//                         document.getElementsByName(`otp-${index + 1}`)[0].focus();
//                       }
//                     }}
//                   />
//                 ))}
//               </div>
//               {error.otp && <p className="text-red-500 text-xs mt-2 text-center">{error.otp}</p>}
//             </div>

//             {/* Mật khẩu */}
//             <div className="grid grid-cols-1 gap-4">
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.password}
//                   onChange={handleChange}
//                 />
//                 <span
//                   className="absolute top-9 right-3 cursor-pointer text-gray-500"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//                 {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
//                     error.confirmPassword ? "border-red-500" : "border-gray-300"
//                   }`}
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                 />
//                 {error.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>
//                 )}
//               </div>
//             </div>

//             {/* Nút Register */}
//             <button
//               type="submit"
//               className="w-full bg-[#007AFF] text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
//             >
//               Register
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </AuthenticationLayout>
//   );
// };

// export default RegisterCustomer;
