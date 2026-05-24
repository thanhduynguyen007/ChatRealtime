import express from "express";
import { acceptFriendRequest, sendFriendRequest, declineFriendRequest, getAllFriends, getFriendsRequest } from "../controllers/friend.controller.js";
const router = express.Router();

router.post("/requests", sendFriendRequest);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriends);
router.get("/requests", getFriendsRequest);
export default router 