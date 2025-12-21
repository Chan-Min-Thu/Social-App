import { useEffect, type FC } from "react";
// import { useLoaderData } from "react-router";
import CreatePost from "./child/CreatePost";
import Post from "./child/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { postInfiniteQuery } from "../../api/query";
import HydrateFallBack from "../../components/HydrateFallBack";
import { useInView } from "react-intersection-observer";

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
  type PageType = { posts?: { newCursor?: string; data?: any[] } };

  useEffect(() => {
    const page = data?.pages[0] as PageType | undefined;
    const lastCursor = page && page.newCursor;
    if (inView) {
      fetchNextPage(lastCursor);
    }
  }, [inView, fetchNextPage, refetch]);
  const posts =
    data && data?.pages.flatMap((page: PageType) => page.posts?.data || []);

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
