import { errorCode } from "../config/errorCode";
import { CommentType } from "../types/comment.type";
import { FriendType } from "../types/friend.type";
import { PostType } from "../types/post.type";
import { ReactionType } from "../types/reaction.type";

export const checkFile = (file: any) => {
  if (!file) {
    const error: any = new Error("Invalid file.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkPostById = (post: PostType) => {
  if (!post) {
    console.log("post does not exit");
    const error: any = new Error("Your post does not exit.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkReactionExit = (reaction: ReactionType) => {
  if (reaction?.id !== undefined) {
    const error: any = new Error("Your reaction already exited.");
    error.status = 400;
    error.code = errorCode.alreadyExit;
    throw error;
  }
};

export const checkAlreadyRequest = (friend: FriendType) => {
  if (!friend) {
    const error: any = new Error("You don't have request from this person.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkReactionById = (reaction: any) => {
  if (reaction.id === undefined) {
    const error: any = new Error("Your reaction does not exit.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkCommentIfNotExit = (comment: CommentType) => {
  if (!comment) {
    console.log("comment exit.");
    const error: any = new Error("Your comment does not exit.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkAcceptFriendListExit = (acceptFriend: any) => {
  if (acceptFriend.length === 0) {
    const error: any = new Error("You don't have requested friend.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkAlreadyFriend = (friend: any) => {
  if (friend) {
    const error: any = new Error("You were already friend.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkIsFriend = (friend: FriendType) => {
  if (!friend) {
    const error: any = new Error("You are not friend.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkBlockRow = (isBlock: any) => {
  if (!isBlock) {
    const error: any = new Error("You haven't blocked that user.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkAlreadyProfile = (profile: any) => {
  if (profile?.bio !== undefined) {
    const error: any = new Error("You have already created your profile.");
    error.status = 400;
    error.code = errorCode.alreadyExit;
    throw error;
  }
};

export const checkProfileIfNotExit = (profile: any) => {
  if (!profile) {
    const error: any = new Error("Opps! Your profile didn't create yet!");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};
