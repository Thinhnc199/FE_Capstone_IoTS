const Footer = () => {
  return (
    <footer className="bg-[#007AFF] text-white py-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 ml-4">
        <div>
          <h3 className="font-bold text-xl">
            <img
              src="/images/iots.png"
              alt="IOTS Logo"
              className="inline-block w-23 h-23"
            />
          </h3>
          <p>IOT Materials Trading</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-2 p-2 rounded bg-white text-black w-full"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">Support</h3>
          <p>FPT University</p>
          <p>IOTS@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Account</h3>
          <ul>
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
          </ul>
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-lg">Quick Link</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg">Download App</h3>
          <div className="mt-2">
            <img
              src="https://via.placeholder.com/100x30?text=Google+Play"
              alt="Google Play"
              className="mb-2"
            />
            <img
              src="https://via.placeholder.com/100x30?text=App+Store"
              alt="App Store"
            />
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        © 2025 IOTS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
