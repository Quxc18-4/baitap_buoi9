const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentMessage: {
        type: { 
            type: String, 
            enum: ['file', 'text'], // Chỉ cho phép 2 loại này
            required: true 
        },
        content: { type: String, required: true }
    }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model('Message', MessageSchema);