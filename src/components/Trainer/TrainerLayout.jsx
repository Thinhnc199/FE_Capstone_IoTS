import { Layout } from "antd";
import PropTypes from "prop-types";
import TrainerHeader from "./components/TrainerHeader";
const { Content } = Layout;

const TrainerLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <TrainerHeader />
      <Layout>

        {/* Main Content Area */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
          <main>{children}</main>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
TrainerLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default TrainerLayout;
