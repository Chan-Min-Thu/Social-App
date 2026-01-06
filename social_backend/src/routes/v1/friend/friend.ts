import express from "express";
import {
  acceptFriendController,
  blockFriendController,
  getOtherProfileController,
  getFriendsContorller,
  requestFriendController,
  unblockFriendController,
  // getRequestedFriendsController,
} from "../../../controllers/friend/friendController";

const router = express.Router();

router.post("/friendRequest", requestFriendController);
router.post("/friendAccept", acceptFriendController);
router.post("/friendBlock", blockFriendController);
router.post("/friendUnblock", unblockFriendController);
router.get("/otherProfile/:profileId", getOtherProfileController);
router.get("/friends/:status", getFriendsContorller);
// router.get("/friends/requested", getRequestedFriendsController);

export default router;
