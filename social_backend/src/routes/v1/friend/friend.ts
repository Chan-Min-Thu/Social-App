import express from "express";
import {
  removeFriendshipController,
  toAcceptFriendController,
  blockFriendController,
  getOtherProfileController,
  getFriendsContorller,
  requestFriendController,
  unblockFriendController,
  // getRequestedFriendsController,
} from "../../../controllers/friend/friendController";

const router = express.Router();

router.post("/friend-request", requestFriendController);
router.post("/friend-accept", toAcceptFriendController);
router.post("/friend-block", blockFriendController);
router.post("/friend-unblock", unblockFriendController);
router.delete("/friend-remove", removeFriendshipController);

router.get("/otherProfile/:profileId", getOtherProfileController);
router.get("/friends/:status", getFriendsContorller);
// router.get("/friends/suggested", getSuggestionFriendController);
// router.get("/friends/requested", getRequestedFriendsController);

export default router;
