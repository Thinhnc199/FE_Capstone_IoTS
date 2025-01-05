import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container mx-auto flex bg-white">
      <div className="hidden md:flex w-1/2 items-center justify-center p-8">
        <img
          src="https://iotbusinessnews.com/WordPress/wp-content/uploads/IoT-internet-of-things-planet.jpg"
          alt="IoT Background"
          className="object-contain w-full h-full rounded-lg "
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#007AFF] mb-6 text-center">
            Create an Account
          </h2>
          <form>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-4 border rounded"
            />
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
              Create Account
            </button>
            <button
              type="button"
              className="w-full border border-black text-gray-600 py-3 mt-2 rounded hover:bg-gray-100 flex items-center justify-center"
            >
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB&psig=AOvVaw3FcWugC_mhXWCYG5kjy2pI&ust=1736118487265000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLDRhLeX3YoDFQAAAAAdAAAAABAE"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
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
    </div>
  );
};

export default Register;
