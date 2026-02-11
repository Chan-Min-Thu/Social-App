export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserType = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type UserProfileType = {
  id: string;
  avatarUrl: string;
  coverUrl: string;
  website?: string;
  username: string;
};

export type UserInfoType = {
  bio: string;
  location: string;
  birthDate: Date;
  website: string;
  gender: Gender;
};

export type UpdateProfileParams = {
  profileId: string;
  userInfo: UserInfoType;
};
