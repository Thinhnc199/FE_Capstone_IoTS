import PropTypes from "prop-types";
import Navbar from "./../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainLayout = ({ children }) => {
  return (
    <div className="bg-[#f1f9fc] ">
      <div className="fixed w-full z-[1060]">
        {" "}
        <Navbar></Navbar>
      </div>

      <main className=" bg-[#f1f9fc] pt-24 ">{children}</main>
      <ToastContainer />
      <Footer></Footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
