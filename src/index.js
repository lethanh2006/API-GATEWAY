// File khởi chạy chính của API Gateway (Entry Point).
// Tải các module cấu hình, middleware, proxy và khởi động Server Express.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Nhập các thành phần đã được chia nhỏ ra thư mục riêng biệt
const { PORT, services } = require('./config/services');
const { gatewayAuthMiddleware } = require('./middleware/auth');
const socketProxy = require('./proxy/socketProxy');
const { setupHttpProxies } = require('./proxy/httpProxy');
const { setupSwaggerDocs } = require('./routes/docs');

const app = express();

// Cài đặt các Middleware cơ bản hệ thống
app.use(cors()); // Cho phép chia sẻ tài nguyên nguồn gốc chéo (CORS)
app.use(morgan('dev')); // Ghi log chi tiết các request (Morgan) ra màn hình console

// 1. Tích hợp Route gộp tài liệu Swagger API (Swagger Docs)
// Đường dẫn: /api-docs (giao diện web) và /api/docs-merged.json (dữ liệu spec)
setupSwaggerDocs(app);

// 2. Endpoint trang chủ giới thiệu trạng thái hoạt động của Gateway
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gateway is running (API Gateway đang hoạt động bình thường)', 
    services: services.map(s => s.route) 
  });
});

// 3. Đính kèm Middleware xác thực JWT tập trung
// Chỉ chặn các Router KHÔNG bắt đầu bằng /api/auth.
// Các Router thuộc /api/auth (như login, register) sẽ được chuyển thẳng tới Auth Service xử lý.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next(); // Cho qua trực tiếp để proxy chuyển tiếp tới Auth Service tự quyết định
  }
  gatewayAuthMiddleware(req, res, next);
});

// 4. Thiết lập Socket Proxy cho các kết nối WebSockets (/socket.io)
// Giúp chuyển tiếp thời gian thực kết nối Socket.io từ client tới Chat Service
app.use('/socket.io', socketProxy);

// 5. Khởi tạo và thiết lập HTTP Proxy cho từng Microservice hạ nguồn
// Chuyển hướng request tương ứng tới Canteen, Payment, Todo, User...
setupHttpProxies(app);

// Khởi chạy server HTTP lắng nghe ở cổng PORT (3000)
const httpServer = app.listen(PORT, () => {
  console.log(`[Gateway] đang khởi chạy thành công tại: http://localhost:${PORT}`);
});

// Lắng nghe sự kiện nâng cấp giao thức (Upgrade) từ HTTP sang WebSocket
httpServer.on('upgrade', (req, socket, head) => {
  console.log('[Gateway] Nhận được yêu cầu nâng cấp kết nối WS Upgrade:', req.url);
  socketProxy.upgrade(req, socket, head);
});
