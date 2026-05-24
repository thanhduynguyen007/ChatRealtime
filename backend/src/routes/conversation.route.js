import express from 'express'
import { checkFriendship } from '../middlewares/friend.middleware.js';
import { createConversation, getConversations, getMessages } from '../controllers/conversation.controller.js';

const router = express.Router();

router.post("/", checkFriendship, createConversation);
router.get("/", getConversations);
router.post("/:conversationId/messages", getMessages);
export default router;