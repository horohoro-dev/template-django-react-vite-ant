import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import {
  getPostsListQueryKey,
  usePostsCreate,
  usePostsDestroy,
  usePostsList,
  usePostsPartialUpdate,
} from "@/generated/api/posts/posts";
import type { PostCreateUpdate } from "@/generated/schemas";

export const usePostListPage = () => {
  // URLクエリパラメータでページ状態を管理
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true, // page=1 はURLから除去
      shallow: false, // データ再取得を確実に
    }),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: number;
    title: string;
    content: string;
    is_published: boolean;
  } | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = usePostsList({
    page,
  });

  const createMutation = usePostsCreate({
    mutation: {
      onSuccess: () => {
        message.success("Post created successfully");
        queryClient.invalidateQueries({ queryKey: getPostsListQueryKey() });
        setIsModalOpen(false);
      },
      onError: () => {
        message.error("Failed to create post");
      },
    },
  });

  const updateMutation = usePostsPartialUpdate({
    mutation: {
      onSuccess: () => {
        message.success("Post updated successfully");
        queryClient.invalidateQueries({ queryKey: getPostsListQueryKey() });
        setIsModalOpen(false);
        setEditingPost(null);
      },
      onError: () => {
        message.error("Failed to update post");
      },
    },
  });

  const deleteMutation = usePostsDestroy({
    mutation: {
      onSuccess: () => {
        message.success("Post deleted successfully");
        queryClient.invalidateQueries({ queryKey: getPostsListQueryKey() });
      },
      onError: () => {
        message.error("Failed to delete post");
      },
    },
  });

  const handleCreate = (values: PostCreateUpdate) => {
    createMutation.mutate({ data: values });
  };

  const handleUpdate = (id: number, values: PostCreateUpdate) => {
    updateMutation.mutate({ id, data: values });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
  }) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  return {
    posts: data?.results || [],
    totalCount: data?.count || 0,
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
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
