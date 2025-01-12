import PropTypes from "prop-types";
import Header from "./components/header";
import Sidebar from "./components/sideBar";
export default function AdminLayout({ children }) {
  return (
    <div className="h-screen flex flex-col overflow-y-hidden no-scrollbar">
      <Header />
      <div className="flex h-[calc(100vh-60px)] overflow-y-hidden no-scrollbar bg-white">
        <Sidebar />

        <div className="flex-1 overflow-y-scroll bg-bgColer rounded-md">
          <div className="p-4 rounded-md ">{children}</div>
        </div>
      </div>
    </div>
  );
}
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
