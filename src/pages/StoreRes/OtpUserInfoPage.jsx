import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/storeSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Spin, message } from "antd";

const OtpUserInfoPage = () => {
  const location = useLocation();
  const { email, role } = location.state || {};

  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: 1,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.store);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: Number(e.target.value) });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    if (otp.length !== 6) {
      message.error("OTP must be 6 digits.");
      return;
    }

    const userInfo = {
      email: email,
      fullname: formData.fullname,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      roleId: role,
    };

    try {
      await dispatch(
        registerUser({
          userInfo,
          otp,
          password: formData.password,
          roleId: role,
        })
      ).unwrap();
      navigate("/login"); // Chỉ chạy khi thành công
    } catch (error) {
      console.error("Registration error:", error);
      // Thông báo lỗi đã được xử lý trong storeSlice
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-8">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#00a8e8]">
          Verify & Register
        </h2>

        <label className="text-gray-600 text-sm font-medium">
          Email Address
        </label>
        <Input
          value={email || ""}
          disabled
          className="mb-4 bg-gray-100 border-none rounded-lg px-3 py-2 text-gray-600"
        />

        <label className="text-gray-600 text-sm font-medium">Enter OTP</label>
        <Input
          placeholder="6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          className="mb-4 text-center text-lg tracking-widest py-3 border-[#00a8e8] rounded-lg"
        />

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <Input
              name="fullname"
              placeholder="Enter your full name"
              onChange={handleChange}
              className="py-2 px-3 rounded-lg"
            />
          </div>

          <div className="flex space-x-4 items-center">
            <div className="flex-1">
              <label className="text-gray-600 text-sm font-medium">
                Phone Number
              </label>
              <Input
                name="phone"
                placeholder="Enter your phone number"
                onChange={handleChange}
                className="py-2 px-3 rounded-lg"
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-600 text-sm font-medium ">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={handleGenderChange}
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00a8e8] transition-all text-gray-700 bg-white"
              >
                <option value={1} className="text-gray-700">
                  Male
                </option>
                <option value={2} className="text-gray-700">
                  Female
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Address</label>
            <Input
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              className="py-2 px-3 rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">
              Password
            </label>
            <Input.Password
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="py-2 px-3 rounded-lg"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">
              Confirm Password
            </label>
            <Input.Password
              name="confirmPassword"
              placeholder="Re-enter your password"
              onChange={handleChange}
              className="py-2 px-3 rounded-lg"
            />
          </div>
        </div>

        <Button
          type="primary"
          onClick={handleRegister}
          block
          disabled={
            loading ||
            !otp ||
            otp.length !== 6 ||
            !formData.fullname ||
            !formData.phone ||
            !formData.address ||
            !formData.gender ||
            !formData.password ||
            !formData.confirmPassword
          }
          className="mt-6 text-lg font-semibold py-3 rounded-lg bg-[#00a8e8] hover:bg-[#008ecb] transition-all duration-300"
        >
          {loading ? <Spin /> : "Register"}
        </Button>
      </div>
    </div>
  );
};

export default OtpUserInfoPage;


// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../../redux/slices/storeSlice";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Input, Button, Spin, message } from "antd";

// const OtpUserInfoPage = () => {
//   const location = useLocation();
//   const { email, role } = location.state || {};

//   const [otp, setOtp] = useState("");
//   const [formData, setFormData] = useState({
//     fullname: "",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     gender: 1,
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading } = useSelector((state) => state.store);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleGenderChange = (e) => {
//     setFormData({ ...formData, gender: Number(e.target.value) });
//   };

//   const handleRegister = () => {
//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       message.error("Passwords do not match!");
//       return;
//     }
    
//     // Validate OTP length
//     if (otp.length !== 6) {
//       message.error("OTP must be 6 digits.");
//       return;
//     }

//     const userInfo = {
//       email: email,
//       fullname: formData.fullname,
//       phone: formData.phone,
//       address: formData.address,
//       gender: formData.gender,
//       roleId: role,
//     };

//     // Dispatch registerUser and handle the response
//     dispatch(
//       registerUser({
//         userInfo,
//         otp,
//         password: formData.password,
//         roleId: role,
//       })
//     ).then((result) => {
//       // Check if the action was fulfilled (successful)
//       if (result.meta.requestStatus === "fulfilled") {
//         navigate("/login"); // Only navigate on success
//       }
//       // Error handling is already managed by the redux slice via message.error
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-8">
//       <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-[#00a8e8]">
//           Verify & Register
//         </h2>

//         {/* Rest of your JSX remains the same */}
//         <label className="text-gray-600 text-sm font-medium">
//           Email Address
//         </label>
//         <Input
//           value={email || ""}
//           disabled
//           className="mb-4 bg-gray-100 border-none rounded-lg px-3 py-2 text-gray-600"
//         />

//         <label className="text-gray-600 text-sm font-medium">Enter OTP</label>
//         <Input
//           placeholder="6-digit OTP"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
//           className="mb-4 text-center text-lg tracking-widest py-3 border-[#00a8e8] rounded-lg"
//         />

//         <div className="space-y-4">
//           <div>
//             <label className="text-gray-600 text-sm font-medium">
//               Full Name
//             </label>
//             <Input
//               name="fullname"
//               placeholder="Enter your full name"
//               onChange={handleChange}
//               className="py-2 px-3 rounded-lg"
//             />
//           </div>

//           <div className="flex space-x-4 items-center">
//             <div className="flex-1">
//               <label className="text-gray-600 text-sm font-medium">
//                 Phone Number
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="Enter your phone number"
//                 onChange={handleChange}
//                 className="py-2 px-3 rounded-lg"
//               />
//             </div>

//             <div className="flex-1">
//               <label className="text-gray-600 text-sm font-medium ">
//                 Gender
//               </label>
//               <select
//                 value={formData.gender}
//                 onChange={handleGenderChange}
//                 className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00a8e8] transition-all text-gray-700 bg-white"
//               >
//                 <option value={1} className="text-gray-700">
//                   Male
//                 </option>
//                 <option value={2} className="text-gray-700">
//                   Female
//                 </option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="text-gray-600 text-sm font-medium">Address</label>
//             <Input
//               name="address"
//               placeholder="Enter your address"
//               onChange={handleChange}
//               className="py-2 px-3 rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-gray-600 text-sm font-medium">
//               Password
//             </label>
//             <Input.Password
//               name="password"
//               placeholder="Enter your password"
//               onChange={handleChange}
//               className="py-2 px-3 rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-gray-600 text-sm font-medium">
//               Confirm Password
//             </label>
//             <Input.Password
//               name="confirmPassword"
//               placeholder="Re-enter your password"
//               onChange={handleChange}
//               className="py-2 px-3 rounded-lg"
//             />
//           </div>
//         </div>

//         <Button
//           type="primary"
//           onClick={handleRegister}
//           block
//           disabled={
//             loading ||
//             !otp ||
//             otp.length !== 6 ||
//             !formData.fullname ||
//             !formData.phone ||
//             !formData.address ||
//             !formData.gender ||
//             !formData.password ||
//             !formData.confirmPassword
//           }
//           className="mt-6 text-lg font-semibold py-3 rounded-lg bg-[#00a8e8] hover:bg-[#008ecb] transition-all duration-300"
//         >
//           {loading ? <Spin /> : "Register"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default OtpUserInfoPage;