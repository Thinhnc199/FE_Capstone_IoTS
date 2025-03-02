import PropTypes from "prop-types";
import HeaderStore from "./components/headerStore";
import SidebarStore from "./components/sideBarStore";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import CheckStoreStatus from "./components/CheckStoreStatus";
const { Sider, Header, Content } = Layout;

export default function StoreIotLayout({ children }) {
  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <Layout style={{ minHeight: "100vh" }} className="bg-bgColer">
      <CheckStoreStatus />
      <Sider
        className="site-layout-background bg-white "
        trigger={null}
        collapsible
        collapsed={isSidebarOpen}
        width={250}
      >
        <SidebarStore />
      </Sider>
      <Layout className="site-layout bg-bgColer">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <HeaderStore />
        </Header>
        <Content style={{ margin: 0 }}>
          <div
            className="site-layout-background bg-bgColer"
            style={{ padding: 20, minHeight: 700 }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

StoreIotLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
