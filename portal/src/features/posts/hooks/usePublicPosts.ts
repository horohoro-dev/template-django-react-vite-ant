import { useState } from "react";
import { usePostsList } from "@/generated/api/public-posts/public-posts";

export const usePublicPosts = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = usePostsList({
    page,
  });

  return {
    posts: data?.results || [],
    totalCount: data?.count || 0,
    page,
    setPage,
    isLoading,
    error,
  };
};
