import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerCustomer } from "../api/apiConfig";

const RegisterCustomer = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
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
  const navigate = useNavigate();

  const validateStep1 = () => {
    let errors = {};
    if (!form.email.trim()) errors.email = "Email is required.";
    if (!form.fullname.trim()) errors.fullname = "Full name is required.";
    if (!form.phone.trim()) errors.phone = "Phone number is required.";

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
    setForm({ ...form, [name]: value });
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
      setStep(2); // Move to Step 2
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

    // 🔥 Cập nhật đúng API payload format
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
      navigate("/login");
    } catch (error) {
      console.error("Error registering customer:", error);
      // const message =
      //   error.response?.data?.message ||
      //   "Registration failed. Please try again.";
      // toast.error(message, {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            {step === 1 ? "Create Account Customer" : "Verify OTP"}
          </h2>
          {step === 1 ? (
            <>
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Input Your Email"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
                    error.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.email}
                  onChange={handleChange}
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
                    error.fullname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.fullname}
                  onChange={handleChange}
                />
                {error.fullname && (
                  <p className="text-red-500 text-sm mt-1">{error.fullname}</p>
                )}
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
                    error.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.phone}
                  onChange={handleChange}
                />
                {error.phone && (
                  <p className="text-red-500 text-sm mt-1">{error.phone}</p>
                )}
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
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
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-gray-700"
                >
                  <option value={1} className="text-gray-700">
                    Male
                  </option>
                  <option value={2} className="text-gray-700">
                    Female
                  </option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-bold hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              >
                Next Step
              </button>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
                    error.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.otp}
                  onChange={handleChange}
                />
                {error.otp && (
                  <p className="text-red-500 text-sm mt-1">{error.otp}</p>
                )}
              </div>
              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
                    error.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute top-3 right-3 cursor-pointer"
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
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] ${
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
                className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
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

  // return (
  //   <AuthenticationLayout>
  //     <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
  //       <div className="max-w-md w-full">
  //         <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
  //           {step === 1 ? "Create Account" : "Verify OTP"}
  //         </h2>
  //         {step === 1 ? (
  //           <>
  //             <div className="mb-4">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 placeholder="Email"
  //                 className={`w-full p-3 border rounded ${
  //                   error.email ? "border-red-500" : ""
  //                 }`}
  //                 value={form.email}
  //                 onChange={handleChange}
  //               />
  //               {error.email && (
  //                 <p className="text-red-500 text-sm mt-1">{error.email}</p>
  //               )}
  //             </div>
  //             <div className="mb-4">
  //               <input
  //                 type="text"
  //                 name="fullname"
  //                 placeholder="Full Name"
  //                 className={`w-full p-3 border rounded ${
  //                   error.fullname ? "border-red-500" : ""
  //                 }`}
  //                 value={form.fullname}
  //                 onChange={handleChange}
  //               />
  //               {error.fullname && (
  //                 <p className="text-red-500 text-sm mt-1">{error.fullname}</p>
  //               )}
  //             </div>
  //             <div className="mb-4">
  //               <input
  //                 type="text"
  //                 name="phone"
  //                 placeholder="Phone Number"
  //                 className={`w-full p-3 border rounded ${
  //                   error.phone ? "border-red-500" : ""
  //                 }`}
  //                 value={form.phone}
  //                 onChange={handleChange}
  //               />
  //               {error.phone && (
  //                 <p className="text-red-500 text-sm mt-1">{error.phone}</p>
  //               )}
  //             </div>
  //             <div className="mb-4">
  //               <input
  //                 type="text"
  //                 name="address"
  //                 placeholder="Address"
  //                 className={`w-full p-3 border rounded ${
  //                   error.address ? "border-red-500" : ""
  //                 }`}
  //                 value={form.address}
  //                 onChange={handleChange}
  //               />
  //               {error.address && (
  //                 <p className="text-red-500 text-sm mt-1">{error.address}</p>
  //               )}
  //             </div>
  //             <div className="mb-4">
  //             <label className="text-gray-600 text-sm font-medium ">
  //               Gender
  //             </label>
  //             <select
  //               value={form.gender}
  //               onChange={handleGenderChange}
  //               className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00a8e8] transition-all text-gray-700 bg-white"
  //             >
  //               <option value={1} className="text-gray-700">
  //                 Male
  //               </option>
  //               <option value={2} className="text-gray-700">
  //                 Female
  //               </option>
  //             </select>
  //             </div>
  //             <button
  //               type="button"
  //               onClick={handleSendEmail}
  //               className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
  //             >
  //               Send Email
  //             </button>
  //           </>
  //         ) : (
  //           <form onSubmit={handleRegister}>
  //             <div className="mb-4">
  //               <input
  //                 type="text"
  //                 name="otp"
  //                 placeholder="OTP"
  //                 className={`w-full p-3 border rounded ${
  //                   error.otp ? "border-red-500" : ""
  //                 }`}
  //                 value={form.otp}
  //                 onChange={handleChange}
  //               />
  //               {error.otp && (
  //                 <p className="text-red-500 text-sm mt-1">{error.otp}</p>
  //               )}
  //             </div>
  //             <div className="mb-4 relative">
  //               <input
  //                 type={showPassword ? "text" : "password"}
  //                 name="password"
  //                 placeholder="Password"
  //                 className={`w-full p-3 border rounded ${
  //                   error.password ? "border-red-500" : ""
  //                 }`}
  //                 value={form.password}
  //                 onChange={handleChange}
  //               />
  //               <span
  //                 className="absolute top-3 right-3 cursor-pointer"
  //                 onClick={() => setShowPassword(!showPassword)}
  //               >
  //                 {showPassword ? <FaEyeSlash /> : <FaEye />}
  //               </span>
  //               {error.password && (
  //                 <p className="text-red-500 text-sm mt-1">{error.password}</p>
  //               )}
  //             </div>
  //             <div className="mb-4">
  //               <input
  //                 type="password"
  //                 name="confirmPassword"
  //                 placeholder="Confirm Password"
  //                 className={`w-full p-3 border rounded ${
  //                   error.confirmPassword ? "border-red-500" : ""
  //                 }`}
  //                 value={form.confirmPassword}
  //                 onChange={handleChange}
  //               />
  //               {error.confirmPassword && (
  //                 <p className="text-red-500 text-sm mt-1">
  //                   {error.confirmPassword}
  //                 </p>
  //               )}
  //             </div>
  //             <button
  //               type="submit"
  //               className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
  //             >
  //               Register
  //             </button>
  //           </form>
  //         )}
  //       </div>
  //     </div>
  //     <ToastContainer />
  //   </AuthenticationLayout>
  // );
};

export default RegisterCustomer;
