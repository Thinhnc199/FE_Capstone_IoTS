import Background from "../assets/imgs/backgroundLogin.png";
import PropTypes from "prop-types";
export default function AuthenticationLayout({ children }) {
  return (
    <div className="font-geist w-screen h-screen flex p-10 bg-white">
      <div className=" flex-1 flex items-center justify-center ">
        <img src={Background} alt="auth-background" className="" />
      </div>
      <div className=" flex-1 flex items-center justify-center  ">
        {children}
      </div>
    </div>
  );
}
AuthenticationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
