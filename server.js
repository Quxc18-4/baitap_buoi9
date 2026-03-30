const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// Thêm thư viện đọc cookie (cần cho authHandler)
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

const app = express();

// 1. Cấu hình Middleware
app.use(express.json()); // Đọc body JSON
app.use(express.urlencoded({ extended: true })); // Đọc body form-urlencoded
app.use(cookieParser()); // Đọc cookie từ request

// Cấu hình thư mục tĩnh để truy cập các file đã upload thông qua URL (ví dụ: http://localhost:3000/uploads/file.jpg)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app')
    .then(() => console.log('✅ Kết nối MongoDB thành công'))
    .catch(err => console.error('❌ Lỗi kết nối:', err));

// 3. Khai báo (Mount) các Routes
// Lưu ý: Tên file trong require() phải khớp với tên file thực tế trong thư mục routes/ của bạn
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users')); 
app.use('/roles', require('./routes/roles')); 
app.use('/upload', require('./routes/upload'));
app.use('/messages', require('./routes/messages'));

// 4. Khởi chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));