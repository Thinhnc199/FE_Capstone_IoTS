import PropTypes from "prop-types";
import HeaderAdmin from "./components/headerAdmin";
import SidebarAdmin from "./components/sideBarAdmin";
import { Layout } from "antd";
import { useSelector } from "react-redux";

const { Sider, Header, Content } = Layout;

export default function AdminLayout({ children }) {
  const { isSidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <Layout style={{ minHeight: "100vh" }} className="bg-bgColer">
      <Sider
        className="site-layout-background bg-white "
        trigger={null}
        collapsible
        collapsed={isSidebarOpen}
        width={250}
      >
        <SidebarAdmin />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <HeaderAdmin />
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

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
