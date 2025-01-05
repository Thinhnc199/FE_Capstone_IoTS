import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container mx-auto flex bg-white">
      <div className="hidden md:flex w-1/2 items-center justify-center p-8">
        <img
          src="https://novateus.com/blog/wp-content/uploads/2020/05/internet_of_things_iot-1.jpg"
          alt="IoT Background"
          className="object-contain w-full h-full rounded-lg "
        />
      </div>

   
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Log In
          </h2>
          <form>
            <input
              type="email"
              placeholder="Email or Phone Number"
              className="w-full p-3 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white py-3 rounded font-bold hover:bg-blue-600"
            >
              Log In
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Dont have an account?{" "}
            <Link to="/register" className="text-[#007AFF] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
