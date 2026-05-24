import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"

export const createConversation = async (req, res) => {
    try {
        const { type, name, memberId } = req.body;
        const userId = req.user._id;
        if (!type || (type === 'group' && !name) || !memberId || !Array.isArray(memberId) || memberId.length === 0) {
            return res.status(400).json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" })
        }
        let conversation;
        if (type === 'direct') {
            const participantId = memberId[0];
            conversation = await Conversation.findOne({ type: 'direct', "participantId.userId": { $all: [userId, participantId] } })
            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date()
                });
                await conversation.save();
            }
        };

        if (type === 'group') {
            conversation = new Conversation({
                type: "group",
                participants: [
                    { userId },
                    ...memberId.map((id) => ({ userId: id }))
                ],
                group: {
                    name,
                    createdBy: userId,
                },
                lastMessageAt: new Date()
            })
            await conversation.save();
        }
        if (!conversation) {
            return res.status(400).json({ message: "Conversation type không hợp lệ" })
        }
        await conversation.populate([
            { path: 'participants.userId', select: 'displayName avatarUrl' },
            {
                path: 'seenBy', select: 'displayName avatarUrl'
            },
            { path: 'lastMessage.senderId', select: 'displayName avatarUrl' },
        ]);
        return res.status(201).json({ message: "Tạo thành công", conversation })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId': userId
        }).sort({ lastMessageAt: -1, updatedAt: -1 }).populate({
            path: "participants.userId",
            select: 'displayName avatarUrl'
        }).populate({
            path: 'lastMessage.senderId',
            select: 'displayName avatarUrl'
        }).populate({
            path: "seenBy",
            select: "displayName avatarUrl"
        })

        const formatted = conversations.map((convo) => {
            const participants = (convo.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinedAt: p.joinedAt
            }));
            return {
                ...convo.toObject(),
                unreadCounts: convo.unreadCounts || {},
                participants
            }
        });
        return res.status(200).json({ conversations: formatted })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50, cursor } = req.query;
        const query = { conversationId };
        if (cursor) {
            query.createAt = { $lt: new Date() }
        }
        let messages = await Message.find(query).sort({ createAt: -1 }).limit(Number(limit) + 1);
        let nextCursor = null;
        if (messages.length > Number(limit)) {
            const nextMessage = message[message.length - 1];
            nextCursor = nextMessage.createAt.toISOString();
            messages.pop();
        }
        messages = messages.reverse();
        return res.status(200).json({
            messages, nextCursor
        })
    } catch (error) {
        console.error("Lỗi xảy ra khi lấy message", error);
        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
}