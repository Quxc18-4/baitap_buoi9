const Message = require('../models/Message');

// Giả định bạn có middleware xác thực để lấy currentUser (ID của người đang đăng nhập)
const currentUser = "65e8a...123"; // ID mẫu để demo

exports.getMessagesWithUser = async (req, res) => {
    try {
        const { userID } = req.params;
        // Lấy tin nhắn 2 chiều: (Tôi -> Bạn) HOẶC (Bạn -> Tôi)
        const messages = await Message.find({
            $or: [
                { from: currentUser, to: userID },
                { from: userID, to: currentUser }
            ]
        }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tăng dần

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { to, content, type } = req.body;
        
        const newMessage = new Message({
            from: currentUser,
            to,
            contentMessage: { type, content }
        });

        await newMessage.save();

        // HƯỚNG MỞ: Chỗ này sau này bạn sẽ gọi: 
        // io.to(to).emit('new_message', newMessage); 
        // để gửi tin nhắn realtime qua Socket.

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLastMessages = async (req, res) => {
    try {
        // Logic: Nhóm theo cặp người gửi/nhận và lấy tin nhắn mới nhất
        const lastMessages = await Message.aggregate([
            {
                $match: {
                    $or: [{ from: currentUser }, { to: currentUser }]
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
        res.status(200).json(lastMessages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};