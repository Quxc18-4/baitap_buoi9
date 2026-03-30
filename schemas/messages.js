const mongoose = require("mongoose");

const contentMessage = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["file", "text"],
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
)

const messageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        contentMessage: contentMessage
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("message", messageSchema);