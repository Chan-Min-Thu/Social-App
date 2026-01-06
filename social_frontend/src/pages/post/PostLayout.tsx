import { useEffect, type FC } from "react";
// import { useLoaderData } from "react-router";
import CreatePost from "./child/CreatePost";
import Post from "./child/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { postInfiniteQuery } from "../../api/query";
import HydrateFallBack from "../../components/HydrateFallBack";
import { useInView } from "react-intersection-observer";
import type { PostType } from "@/types/post.type";

const PostLayout: FC = () => {
  // const { posts } = useLoaderData();
  const { ref, inView } = useInView({ threshold: 0 });
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery(postInfiniteQuery());
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
    const lastCursor = data?.pages[0].newCursor;
    if (inView) {
      fetchNextPage(lastCursor);
    }
  }, [inView, fetchNextPage, hasNextPage, refetch]);

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
      <CreatePost />
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
