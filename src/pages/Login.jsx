import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/userAuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Spin, notification } from "antd";
import AuthenticationLayout from "../layouts/AuthenticationLayout";

const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: "bottomRight",
    duration: 3,
  });
};

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // // ✅ Handle login
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   let formValid = true;
  //   const newErrors = { email: "", password: "" };

  //   if (!credentials.email) {
  //     newErrors.email = "Email is required!";
  //     formValid = false;
  //   }
  //   if (!credentials.password) {
  //     newErrors.password = "Password is required!";
  //     formValid = false;
  //   }

  //   if (!formValid) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const result = await dispatch(loginUser(credentials));
  //   if (!result.error) {
  //     const role = result.payload.roleId;
  //     showNotification("success", "Login Successful", "Welcome back!");

  //     switch (role) {
  //       case 1:
  //         navigate("/admin");
  //         break;
  //       case 2:
  //         navigate("/staff/dashboard");
  //         break;
  //       case 3:
  //         navigate("/manager/dashboard");
  //         break;
  //       case 4:
  //         navigate("/trainer/dashboard");
  //         break;
  //       case 5:
  //         navigate("/home");
  //         break;
  //       case 6:
  //         navigate("/store/welcome");
  //         break;
  //       default:
  //         navigate("/home");
  //     }
  //   }
  // };

  // ✅ Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = { email: "", password: "" };

    if (!credentials.email) {
      newErrors.email = "Email is required!";
      formValid = false;
    }
    if (!credentials.password) {
      newErrors.password = "Password is required!";
      formValid = false;
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(loginUser(credentials));

    if (!result.error) {
      const { roleId, isActive } = result.payload;
      showNotification("success", "Login Successful", "Welcome back!");

      switch (roleId) {
        case 1:
          navigate("/admin");
          break;
        case 2:
          navigate("/staff/dashboard");
          break;
        case 3:
          navigate("/manager/dashboard");
          break;
        case 4:
          navigate("/trainer/dashboard");
          break;
        case 5:
          navigate("/home");
          break;
        case 6:
          if (isActive === 1) {
            navigate("/store/welcome");
          } else if (isActive === 2) {
            navigate("/store/registerStore");
          } else {
            navigate("/home");
          }
          break;
        default:
          navigate("/home");
      }
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-5">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Log In
          </h2>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <label className="text-gray-600 text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              className={`w-full p-3 mb-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email}</p>
            )}

            {/* Password Input */}
            <label className="text-gray-600 text-sm font-medium">
              Password
            </label>
            <Input.Password
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className={`w-full p-3 mb-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-3">{errors.password}</p>
            )}

            {/* Login Button */}
            <Button
              type="primary"
              htmlType="submit"
              block
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Spin /> : "Log In"}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-4 text-gray-600">
            Dont have an account?{" "}
            <Link
              to="/emailcustomer"
              className="text-[#007AFF] hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default Login;
