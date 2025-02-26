import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/storeSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Spin, message } from "antd";
// import Select from "react-select";

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

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle gender change
  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: Number(e.target.value) });
  };

  // Handle gender change from select dropdown
  // const handleGenderChange = (value) => {
  //   setFormData({ ...formData, gender: value });
  // };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      return message.error("Passwords do not match!");
    }
    if (otp.length !== 6) {
      return message.error("OTP must be 6 digits.");
    }

    const userInfo = {
      email: email,
      fullname: formData.fullname,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      roleId: role,
    };

    // Pass the structured data to the registerUser action
    dispatch(
      registerUser({
        userInfo,
        otp,
        password: formData.password,
        roleId: role,
      })
    ).then((res) => {
      if (!res.error) navigate("/login");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-8">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#00a8e8]">
          Verify & Register
        </h2>

        {/* Prefilled Email (Cannot Edit) */}
        <label className="text-gray-600 text-sm font-medium">
          Email Address
        </label>
        <Input
          value={email || ""}
          disabled
          className="mb-4 bg-gray-100 border-none rounded-lg px-3 py-2 text-gray-600"
        />

        {/* OTP Input */}
        <label className="text-gray-600 text-sm font-medium">Enter OTP</label>
        <Input
          placeholder="6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          className="mb-4 text-center text-lg tracking-widest py-3 border-[#00a8e8] rounded-lg"
        />

        {/* Other Inputs */}
        <div className="space-y-4">
          {/* Full Name */}
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

          {/* Phone Number & Gender in one row */}
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

          {/* Address */}
          <div>
            <label className="text-gray-600 text-sm font-medium">Address</label>
            <Input
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              className="py-2 px-3 rounded-lg"
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
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

        {/* Register Button */}
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
// import { useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Input, Button, Spin, message } from "antd";
// import { registerUser } from "../../redux/slices/storeSlice";

// const OtpUserInfoPage = () => {
//   const location = useLocation();
//   const { email, selectedRole } = location.state || {}; // Retrieve email and roleId from state
//   const [otp, setOtp] = useState("");
//   const [formData, setFormData] = useState({
//     fullname: "",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [isLoading, setIsLoading] = useState(false); // Add isLoading state

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = () => {
//     if (formData.password !== formData.confirmPassword) {
//       return message.error("Passwords do not match!");
//     }
//     if (otp.length !== 6) {
//       return message.error("OTP must be 6 digits.");
//     }

//     const userInfo = {
//       email,
//       fullname: formData.fullname,
//       phone: formData.phone,
//       address: formData.address,
//       roleId: selectedRole, // Dynamically set roleId based on selection
//     };

//     setIsLoading(true); // Set loading to true while the registration is in progress

//     dispatch(
//       registerUser({ userInfo, otp, password: formData.password, roleId: selectedRole })
//     ).then((res) => {
//       setIsLoading(false); // Set loading to false once the registration completes
//       if (!res.error) navigate("/login");
//     }).catch(() => {
//       setIsLoading(false); // Ensure loading is set to false if an error occurs
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-[#00a8e8]">
//           Verify & Register
//         </h2>

//         {/* Prefilled Email (Cannot Edit) */}
//         <label className="text-gray-600 text-sm font-medium">Email Address</label>
//         <Input
//           value={email || ""}
//           disabled
//           className="mb-4 bg-gray-100 border-none rounded-lg px-3 py-2 text-gray-600"
//         />

//         {/* OTP Input */}
//         <label className="text-gray-600 text-sm font-medium">Enter OTP</label>
//         <Input
//           placeholder="6-digit OTP"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
//           className="mb-4 text-center text-lg tracking-widest py-3 border-[#00a8e8] rounded-lg"
//         />

//         {/* Other Inputs */}
//         <label className="text-gray-600 text-sm font-medium">Full Name</label>
//         <Input
//           name="fullname"
//           placeholder="Enter your full name"
//           onChange={handleChange}
//           className="mb-4 py-2 px-3 rounded-lg"
//         />

//         <label className="text-gray-600 text-sm font-medium">Phone Number</label>
//         <Input
//           name="phone"
//           placeholder="Enter your phone number"
//           onChange={handleChange}
//           className="mb-4 py-2 px-3 rounded-lg"
//         />

//         <label className="text-gray-600 text-sm font-medium">Address</label>
//         <Input
//           name="address"
//           placeholder="Enter your address"
//           onChange={handleChange}
//           className="mb-4 py-2 px-3 rounded-lg"
//         />

//         <label className="text-gray-600 text-sm font-medium">Password</label>
//         <Input.Password
//           name="password"
//           placeholder="Enter your password"
//           onChange={handleChange}
//           className="mb-4 py-2 px-3 rounded-lg"
//         />

//         <label className="text-gray-600 text-sm font-medium">Confirm Password</label>
//         <Input.Password
//           name="confirmPassword"
//           placeholder="Confirm your password"
//           onChange={handleChange}
//           className="mb-4 py-2 px-3 rounded-lg"
//         />

//         {/* Register Button */}
//         <Button
//           type="primary"
//           onClick={handleRegister}
//           block
//           className="text-lg font-semibold py-2 rounded-lg bg-[#007AFF] text-white"
//         >
//           {isLoading ? <Spin /> : "Register"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default OtpUserInfoPage;
