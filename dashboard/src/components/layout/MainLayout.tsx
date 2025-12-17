import {
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Menu, theme } from "antd";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES_PATHS } from "@/routes/paths";
import { useBoundStore } from "@/stores";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand統合ストアから状態とアクションを取得
  const sidebarCollapsed = useBoundStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useBoundStore((state) => state.toggleSidebar);
  const logout = useBoundStore((state) => state.logout);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate(ROUTES_PATHS.LOGIN);
  };

  const menuItems = [
    {
      key: ROUTES_PATHS.POSTS,
      icon: <FileTextOutlined />,
      label: "Posts",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {sidebarCollapsed ? "D" : "Dashboard"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={
              sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={toggleSidebar}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Flex gap="small">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <NuqsAdapter>
            <Outlet />
          </NuqsAdapter>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
