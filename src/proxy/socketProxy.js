// File cấu hình Socket Proxy để xử lý các kết nối thời gian thực qua WebSocket (Socket.io).
// Kết nối từ Client -> Gateway -> Chat Service để thực hiện chat trực tuyến.

const { createProxyMiddleware } = require('http-proxy-middleware');
const { CHAT_SERVICE_URL } = require('../config/services');

const socketProxy = createProxyMiddleware({
  target: CHAT_SERVICE_URL,
  changeOrigin: true, // Thay đổi origin của request sang host của Chat Service để tránh lỗi CORS
  ws: true,           // Hỗ trợ WebSocket Upgrade (bắt buộc đối với Socket.io)
  on: {
    error: (err) => console.error('[Socket Proxy Error]', err.message),
  }
});

module.exports = socketProxy;
