import { useQuery } from "@tanstack/react-query";
import { profileForMeQuery } from "@/api/query";
import Post from "@/pages/post/child/Post";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileCard from "@/components/ProfileCard";
import FriendsCard from "@/components/FriendsCard";
import EmptyFriendCard from "@/components/EmptyFriendCard";
import EmptyProfileCard from "@/components/EmptyProfileCard";
import HydrateFallBack from "@/components/HydrateFallBack";

const MyProfile = () => {
  const { data, isLoading } = useQuery(profileForMeQuery());

  if (isLoading) {
    return <HydrateFallBack />;
  }

  const { id, profile, info, friends, posts } = data;
  return (
    <div className="flex w-full flex-col gap-2 my-5">
      <ProfileCard
        profile={profile}
        postLength={posts?.length ?? 0}
        friendLength={friends?.length ?? 0}
        isFriendProfile={false}
      />
      {info?.bio ? <ProfileInfo info={info} id={id} isFriendProfile={false}/> : <EmptyProfileCard isFriendProfile={false} />}
      {friends.length ? <FriendsCard friends={friends} isFriendProfile={false}/> : <EmptyFriendCard />}

      <h1 className="text-xl font-bold my-2">Posts</h1>
      {posts.length && <Post posts={posts} />}
    </div>
  );
};
export default MyProfile;
