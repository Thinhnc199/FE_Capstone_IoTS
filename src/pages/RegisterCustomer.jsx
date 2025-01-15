import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const RegisterCustomer = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    countryCode: "+1", // Default country code
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(form.phone)) {
      errors.phone = "Phone number must contain only digits.";
    }

    if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    console.log("User registered:", form);
    navigate("/login");
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={`w-full p-3 border rounded ${
                  error.name ? "border-red-500" : ""
                }`}
                value={form.name}
                onChange={handleChange}
              />
              {error.name && (
                <p className="text-red-500 text-sm mt-1">{error.name}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="mb-4 flex">
              <select
                name="countryCode"
                className="border rounded-l"
                value={form.countryCode}
                onChange={handleChange}
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+84">+84 (Vietnam)</option>
                <option value="+91">+91 (India)</option>
              </select>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className={`flex-grow p-3 border rounded-r ${
                  error.phone ? "border-red-500" : ""
                }`}
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            {error.phone && (
              <p className="text-red-500 text-sm mt-1">{error.phone}</p>
            )}

            {/* Password Input */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`w-full p-3 border rounded ${
                  error.password ? "border-red-500" : ""
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

            {/* Confirm Password Input */}
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full p-3 border rounded ${
                  error.confirmPassword ? "border-red-500" : ""
                }`}
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {error.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {error.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default RegisterCustomer;
