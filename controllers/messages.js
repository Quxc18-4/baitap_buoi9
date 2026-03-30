const messageModel = require("../schemas/messages");
const mongoose = require("mongoose");

module.exports = {
    // 1. Lấy toàn bộ tin nhắn giữa 2 người
    getChatHistory: async (currentUserId, targetUserId) => {
        let messages = await messageModel.find({
            $or: [
                { from: currentUserId, to: targetUserId },
                { from: targetUserId, to: currentUserId }
            ]
        }).sort({ createdAt: 1 });
        return messages;
    },

    // 2. Tạo tin nhắn mới
    createMessage: async (from, to, type, content) => {
        let newMessage = new messageModel({
            from: from,
            to: to,
            contentMessage: { type: type, content: content }
        });
        return await newMessage.save();
    },

    // 3. Lấy tin nhắn cuối cùng của mỗi cuộc hội thoại
    getLastMessages: async (userId) => {
        // Chuyển userId từ String sang ObjectId để dùng trong Aggregate
        let userObjectId = new mongoose.Types.ObjectId(userId);

        let lastMessages = await messageModel.aggregate([
            {
                $match: {
                    $or: [{ from: userObjectId }, { to: userObjectId }]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $gt: ["$from", "$to"] },
                            { from: "$from", to: "$to" },
                            { from: "$to", to: "$from" }
                        ]
                    },
                    lastMsg: { $first: "$$ROOT" }
                }
            }
        ]);
        return lastMessages;
    }
};