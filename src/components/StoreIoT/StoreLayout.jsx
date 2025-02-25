// import StoreHeader from "./components/StoreHeader";
// import { Layout } from "antd";
// import PropTypes from "prop-types";
// const { Content } = Layout;

// const StoreLayout = ({ children }) => {
//   return (
//     <Layout className="min-h-screen">
//       {/* Header */}
//       <StoreHeader />
//       <Layout>

//         {/* Main Content Area */}
//         <Layout style={{ padding: "0 24px 24px" }}>
//           <Content
//             style={{
//               padding: 24,
//               margin: 0,
//               minHeight: 280,
//             }}
//           >
//           <main>{children}</main>
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };
// StoreLayout.propTypes = {
//   children: PropTypes.node.isRequired,
// };
// export default StoreLayout;

import StoreHeader from "./components/StoreHeader";
import { Layout } from "antd";
import PropTypes from "prop-types";
import CheckStoreStatus from "./components/CheckStoreStatus"; 

const { Content } = Layout;

const StoreLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* Kiểm tra trạng thái store */}
      <CheckStoreStatus />

      {/* Header */}
      <StoreHeader />
      <Layout>
        {/* Main Content Area */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <main>{children}</main>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

StoreLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreLayout;
