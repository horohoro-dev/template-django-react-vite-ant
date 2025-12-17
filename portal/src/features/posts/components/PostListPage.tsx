import {
  Alert,
  Card,
  Empty,
  Flex,
  List,
  Skeleton,
  Space,
  Typography,
} from "antd";
import type { PublicPostList } from "@/generated/schemas";
import { usePublicPosts } from "../hooks/usePublicPosts";

const { Title, Text } = Typography;

const PostListPage: React.FC = () => {
  const { posts, totalCount, page, setPage, isLoading, error } =
    usePublicPosts();

  if (error) {
    return (
      <Alert
        type="error"
        title="Error"
        description="Failed to load posts"
        showIcon
      />
    );
  }

  if (isLoading) {
    return (
      <Flex vertical gap="large" style={{ width: "100%" }}>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton active />
          </Card>
        ))}
      </Flex>
    );
  }

  if (posts.length === 0) {
    return <Empty description="No posts yet" />;
  }

  return (
    <div>
      <Title level={2}>Published Posts</Title>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          current: page,
          total: totalCount,
          pageSize: 100,
          onChange: setPage,
          showSizeChanger: false,
        }}
        dataSource={posts}
        renderItem={(post: PublicPostList) => (
          <List.Item key={post.id}>
            <Card hoverable>
              <Title level={4}>{post.title}</Title>
              <Space>
                <Text type="secondary">By {post.author.username}</Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">
                  {new Date(post.created_at).toLocaleDateString("ja-JP")}
                </Text>
                <Text type="secondary">|</Text>
                <Text type="secondary">{post.comment_count} comments</Text>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PostListPage;
