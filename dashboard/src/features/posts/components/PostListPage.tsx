import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import type { PostList } from "@/generated/schemas";
import { usePostListPage } from "../hooks/usePostListPage";
import {
  PostFilterProvider,
  type StatusFilter,
  usePostFilter,
} from "../stores/postFilterStore";

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * 投稿一覧コンテンツ（フィルターストアを使用）
 */
const PostListContent: React.FC = () => {
  const {
    posts,
    totalCount,
    page,
    setPage,
    isLoading,
    error,
    isModalOpen,
    editingPost,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating,
    isUpdating,
  } = usePostListPage();

  // Context + Zustand パターンでフィルター状態を取得
  const { searchQuery, statusFilter, setSearchQuery, setStatusFilter, reset } =
    usePostFilter();

  const [form] = Form.useForm();

  useEffect(() => {
    if (editingPost) {
      form.setFieldsValue(editingPost);
    } else {
      form.resetFields();
    }
  }, [editingPost, form]);

  // クライアントサイドフィルタリング
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 検索クエリでフィルター
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase());

      // ステータスでフィルター
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.is_published) ||
        (statusFilter === "draft" && !post.is_published);

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  const columns: ColumnsType<PostList> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: ["author", "username"],
      key: "author",
    },
    {
      title: "Status",
      dataIndex: "is_published",
      key: "is_published",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Comments",
      dataIndex: "comment_count",
      key: "comment_count",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("ja-JP"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() =>
              openEditModal({
                id: record.id,
                title: record.title,
                content: "",
                is_published: record.is_published ?? false,
              })
            }
          />
          <Popconfirm
            title="Delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFormSubmit = (values: {
    title: string;
    content: string;
    is_published: boolean;
  }) => {
    if (editingPost) {
      handleUpdate(editingPost.id, values);
    } else {
      handleCreate(values);
    }
  };

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

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Posts
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Create Post
        </Button>
      </Flex>

      {/* フィルターセクション（Context + Zustand パターンのデモ） */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Flex gap="middle" align="center" wrap="wrap">
          <Space>
            <Text type="secondary">Search:</Text>
            <Input
              placeholder="Search by title..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
          </Space>
          <Space>
            <Text type="secondary">Status:</Text>
            <Select
              value={statusFilter}
              onChange={(value: StatusFilter) => setStatusFilter(value)}
              style={{ width: 120 }}
              options={[
                { value: "all", label: "All" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </Space>
          <Button onClick={reset} size="small">
            Reset Filters
          </Button>
          <Text type="secondary">
            Showing {filteredPosts.length} of {posts.length} posts
          </Text>
        </Flex>
      </Card>

      {isLoading ? (
        <SkeletonTable columns={7} rows={5} />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          pagination={{
            current: page,
            total: totalCount,
            pageSize: 100,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
          }}
        />
      )}

      <Modal
        title={editingPost ? "Edit Post" : "Create Post"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ is_published: false }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="is_published"
            label="Published"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Flex justify="end" gap="small">
              <Button onClick={closeModal}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
              >
                {editingPost ? "Update" : "Create"}
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

/**
 * 投稿一覧ページ
 *
 * PostFilterProviderでラップすることで、
 * 子コンポーネントでフィルター状態を共有できる
 */
const PostListPage: React.FC = () => {
  return (
    <PostFilterProvider>
      <PostListContent />
    </PostFilterProvider>
  );
};

export default PostListPage;
