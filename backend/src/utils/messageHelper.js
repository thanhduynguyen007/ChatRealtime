export const updateConversationAfterCreateMessage = (conversation, message, senderId) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createAt
        }
    });
    conversation.participants.forEach((p) => {
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const prevCount = conversation.unreadCounts.get(memberId) || 0;
        conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1)
    });
}