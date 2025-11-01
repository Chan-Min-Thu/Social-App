import express from "express";
import {
  acceptFriendController,
  blockFriendController,
  getOtherProfileController,
  requestFriendController,
  unblockFriendController,
} from "../../../controllers/friend/friendController";

const router = express.Router();

router.post("/friendRequest", requestFriendController);
router.post("/friendAccept", acceptFriendController);
router.post("/friendBlock", blockFriendController);
router.post("/friendUnblock", unblockFriendController);
router.get("/otherProfile/:profileId", getOtherProfileController);

export default router;
