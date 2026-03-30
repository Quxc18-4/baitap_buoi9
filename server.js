const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối MongoDB (Thay URI trong file .env của bạn)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app')
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch(err => console.error('Lỗi kết nối:', err));

// Sử dụng Routes
app.use('/api/messages', require('./routes/messageRoutes'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));