import { errorCode } from "../config/errorCode";

export const checkfile = (file: any) => {
  if (!file) {
    const error: any = new Error("Invalid file.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkPostById = (post: any) => {
  if (!post) {
    const error: any = new Error("Your post does not exit.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkReactionExit = (reaction: any) => {
  if (reaction) {
    const error: any = new Error("Your reaction already exited.");
    error.status = 400;
    error.code = errorCode.alreadyExit;
    throw error;
  }
};

export const checkReactionById = (reaction: any) => {
  if (!reaction) {
    const error: any = new Error("Your reaction does not exit.");
    error.status = 400;
    error.code = errorCode.notMatched;
    throw error;
  }
};

export const checkCommentIfNotExit = (comment: any) => {
  if (!comment) {
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

export const checkIsFriend = (friend: any) => {
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
  if (profile) {
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
