const ContactPage = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in touch</h1>
        <p className="text-gray-600 mb-8">
          Proin volutpat consequat porttitor. Sed ut tincidunt integer elementum
          id sem. Arcu sed malesuada et magna.
        </p>
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13 12m4.657-4.657A8 8 0 118.343 8.343a8 8 0 0111.314 11.314z"
            />
          </svg>
          <p className="text-gray-600">545 Mavis Island, Chicago, IL 99191</p>
        </div>
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10a4 4 0 118 0m-2 6h4a2 2 0 012 2H5a2 2 0 012-2z"
            />
          </svg>
          <p className="text-gray-600">+1 (555) 234-5678</p>
        </div>
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 5a4 4 0 00-8 0v2m12 6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600">hello@example.com</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-100">
        <form className="space-y-4 max-w-lg mx-auto">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Phone number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Message
            </label>
            <textarea
              id="message"
              placeholder="Message"
              rows="4"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
