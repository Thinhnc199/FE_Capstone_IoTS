import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationLayout from "../layouts/AuthenticationLayout";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const navigate = useNavigate();

  // Countdown logic
  useState(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Allow only one digit
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    // Verify OTP logic here
    if (otpValue === "123456") {
      navigate("/register-details");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Verify OTP
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 border rounded text-center text-xl"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              Resend OTP in: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
            </p>
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default VerifyOtp;
