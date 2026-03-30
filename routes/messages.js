var express = require("express");
var router = express.Router();

let messageController = require("../controllers/messages");
let { checkLogin } = require("../utils/authHandler");
let { uploadImage } = require("../utils/uploadHandler");

// GET /:userID - Lấy toàn bộ tin nhắn với 1 user
router.get("/:userID", checkLogin, async function (req, res, next) {
    try {
        let currentUserId = req.userId; // Lấy từ token qua checkLogin
        let targetUserId = req.params.userID;

        let result = await messageController.getChatHistory(currentUserId, targetUserId);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST / - Gửi tin nhắn (Hỗ trợ upload file)
router.post("/", checkLogin, uploadImage.single("file"), async function (req, res, next) {
    try {
        let from = req.userId;
        let to = req.body.to;
        let content = req.body.content;
        let type = "text";

        // Nếu có file được upload, đổi type thành 'file' và gán content là đường dẫn file
        if (req.file) {
            type = "file";
            content = `/uploads/${req.file.filename}`;
        }

        let newMessage = await messageController.createMessage(from, to, type, content);

        // HƯỚNG MỞ CHO REALTIME:
        // Nếu sau này bạn setup Socket.io (ví dụ biến toàn cục global.io)
        // bạn có thể gọi: global.io.to(to).emit("new_message", newMessage);

        res.status(201).send(newMessage);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// GET / - Lấy danh sách tin nhắn cuối cùng của các cuộc hội thoại
router.get("/", checkLogin, async function (req, res, next) {
    try {
        let currentUserId = req.userId;
        let result = await messageController.getLastMessages(currentUserId);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;