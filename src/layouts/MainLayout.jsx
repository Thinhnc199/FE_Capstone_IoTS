import PropTypes from "prop-types";
import Navbar from "./../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-white">
      <Navbar></Navbar>
      <main className=" py-5 ">{children}</main>
      <Footer></Footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
