import { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticationLayout from "../layouts/AuthenticationLayout";

const RegisterEmail = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log("Email submitted:", email);
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Register with Email
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#007AFF] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default RegisterEmail;
