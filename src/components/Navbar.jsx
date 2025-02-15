import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faUserCircle,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md mb-1">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 ">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#007AFF]">
          <Link to="/">IOTS</Link>
        </div>

        {/* Menu Links */}
        <ul className="flex space-x-8 text-gray-700">
          <li>
            <Link to="/" className="hover:text-[#007AFF] cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-[#007AFF] cursor-pointer">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#007AFF] cursor-pointer">
              About
            </Link>
          </li>
          <li>
            <Link
              to="/StoreEmail"
              className="hover:text-[#007AFF] cursor-pointer"
            >
              Become Store
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-8">
          {/* Wishlist */}
          <Link to="/wishlist" className="hover:text-[#007AFF]">
            <FontAwesomeIcon
              icon={faHeart}
              className="w-6 h-6 text-gray-700 hover:text-[#FF0000]"
            />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="hover:text-[#007AFF]">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="w-6 h-6 text-gray-700 hover:text-[#007AFF]"
            />
          </Link>

          {/* User Avatar */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="w-8 h-8 text-blue-600 cursor-pointer hover:text-[#007AFF]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border">
                <ul className="py-2">
                  <li className="hover:bg-gray-100">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 w-full text-blue-700"
                    >
                      Log In
                    </Link>
                  </li>
                  <li className="hover:bg-gray-100">
                    <Link
                      to="/emailcustomer"
                      className="flex items-center px-4 py-2 w-full text-blue-700"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Link
            to="/login"
            className="flex items-center px-4 py-2 w-full text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon
              icon={faSignInAlt}
              className="w-6 h-6 text-white mr-2"
            />
            <span className="text-white font-semibold">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
