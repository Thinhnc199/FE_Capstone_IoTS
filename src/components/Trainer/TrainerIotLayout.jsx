import PropTypes from "prop-types";
import HeaderTrainer from "./components/HeaderTrainer";
import SideBarTrainer from "./components/SideBarTrainer";
import { Layout } from "antd";
import { useSelector } from "react-redux";
// import CheckStoreStatus from "./components/CheckStoreStatus";
const { Sider, Header, Content } = Layout;

export default function TrainerIotLayout({ children }) {
  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <Layout style={{ minHeight: "100vh" }} className="bg-green-50">
      {/* <CheckStoreStatus /> */}
      <Sider
        className="site-layout-background bg-white "
        trigger={null}
        collapsible
        collapsed={isSidebarOpen}
        width={250}
      >
        <SideBarTrainer />
      </Sider>
      <Layout className="site-layout bg-green-50">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <HeaderTrainer />
        </Header>
        <Content style={{ margin: 0 }}>
          <div
            className="site-layout-background bg-green-50"
            style={{ padding: 20, minHeight: 700 }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

TrainerIotLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
