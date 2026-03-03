import imageUrl from "@/config/imageUrl";

export const getProfileImageUrl = (avatarUrl: string | null) => {
  if (!avatarUrl) {
    return null;
  }
  return avatarUrl.startsWith("http") ? avatarUrl : imageUrl + avatarUrl;
};
