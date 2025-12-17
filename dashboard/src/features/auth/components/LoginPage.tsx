import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { Navigate } from "react-router-dom";
import { useBoundStore } from "@/stores";
import { useAuth } from "../hooks/useAuth";

const { Title } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const { login, isLoading, error } = useAuth();
  const [form] = Form.useForm<LoginFormValues>();

  const handleSubmit = async (values: LoginFormValues) => {
    await login(values);
  };

  // 既に認証済みの場合はリダイレクト
  if (isAuthenticated) {
    return <Navigate to="/posts" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Dashboard Login
        </Title>

        {error && (
          <Alert
            type="error"
            title="Error"
            description={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text
          type="secondary"
          style={{ display: "block", textAlign: "center" }}
        >
          Demo: admin@example.com / admin123
        </Typography.Text>
      </Card>
    </div>
  );
};

export default LoginPage;
