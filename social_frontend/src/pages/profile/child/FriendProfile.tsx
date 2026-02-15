import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProfieForOtherFriend } from "../../../api/query";
import Post from "../../../pages/post/child/Post";
import ProfileInfo from "../../../components/ProfileInfo";
import EmptyProfileCard from "../../../components/EmptyProfileCard";
import EmptyFriendCard from "../../../components/EmptyFriendCard";
import FriendsCard from "../../../components/FriendsCard";
import ProfileCard from "../../../components/ProfileCard";
import HydrateFallBack from "../../../components/HydrateFallBack";

const FriendProfile = () => {
  const isFriendProfile = true;
  let param = useParams();
  const userId = param.userId as string;

  const { data, isPending } = useQuery({
    queryKey: ["otherProfile", userId],
    queryFn: () => fetchProfieForOtherFriend(userId),
    enabled: !!userId,
  });

  if (isPending) {
    return <HydrateFallBack />;
  }

  const { id, profile, info, friends, posts } = data.data;

  return (
    <div className="flex w-full flex-col gap-2 my-5">
      <ProfileCard
        profile={profile}
        postLength={posts?.length ?? 0}
        friendLength={friends?.length ?? 0}
        isFriendProfile={isFriendProfile}
      />
      {info?.bio ? (
        <ProfileInfo info={info} id={id} isFriendProfile={isFriendProfile} />
      ) : (
        <EmptyProfileCard isFriendProfile={isFriendProfile} />
      )}
      {friends.length ? (
        <FriendsCard friends={friends} isFriendProfile={isFriendProfile} />
      ) : (
        <EmptyFriendCard />
      )}
      <h1 className="text-xl font-bold my-2">Posts</h1>
      {posts.length && <Post posts={posts} />}
    </div>
  );
};

export default FriendProfile;
