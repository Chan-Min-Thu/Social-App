import { useEffect, type FC } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { postInfiniteQuery, userQuery } from "@/api/query";
import CreatePost from "@/pages/post/child/CreatePost";
import Post from "@/pages/post/child/Post";
import HydrateFallBack from "@/components/HydrateFallBack";
import type { PostType } from "@/types/post.type";

const PostLayout: FC = () => {
  const { ref, inView } = useInView({ threshold: 0 });
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(postInfiniteQuery());

  const { data: user } = useQuery(userQuery());

  // Define the expected type for a page
  type PageType = {
    hasNextPage: boolean;
    length: number;
    message: string;
    newCursor: string;
    totalPages: number;
    data: PostType[];
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const posts =
    data && data?.pages.flatMap((page: PageType) => page.data || []);

  if (isLoading) {
    return <HydrateFallBack />;
  }

  if (isError) {
    return (
      <div className="w-full text-center text-red-500">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  return (
    <div className="w-full h-auto mb-10">
      <CreatePost user={user.data} />
      {posts && <Post posts={posts} />}
      {hasNextPage ? (
        <div ref={ref} className="w-full flex justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : null}
    </div>
  );
};
export default PostLayout;
