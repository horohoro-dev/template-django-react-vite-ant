import { Layout, Typography } from "antd";
import { PostListPage } from "@/features/posts/components";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#001529",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Portal
        </Title>
      </Header>
      <Content style={{ padding: "24px 48px" }}>
        <PostListPage />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Portal - Django + React Template
      </Footer>
    </Layout>
  );
};

export default App;
