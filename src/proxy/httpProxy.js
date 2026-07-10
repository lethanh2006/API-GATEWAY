// Module thiết lập HTTP Reverse Proxy để điều hướng các HTTP request từ Client tới các Service tương ứng.

const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('../config/services');

/**
 * Thiết lập proxy chuyển tiếp HTTP cho Express App.
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Khi Client gửi request đến Gateway (ví dụ: GET /api/canteen/menu).
 * 2. Express chuyển request qua middleware Gateway Auth thành công (đã gán x-user-payload nếu là private route).
 * 3. Chạy qua cấu hình Proxy này:
 *    - Xác định route `/api/canteen` tương ứng với target Canteen Service (http://localhost:5005).
 *    - `onProxyReq` hoạt động: Ghi đè (hoặc thêm mới) header `x-user-payload` vào request trước khi gửi đi.
 *    - Gửi request đến Canteen Service và đợi phản hồi.
 * 4. Nếu xảy ra lỗi kết nối tới Canteen Service (chưa bật service, crash...):
 *    - `onError` bắt lỗi, log ra màn hình console của Gateway và trả về mã lỗi 500 kèm nội dung "Service Unavailable".
 * 
 * @param {import('express').Application} app - Ứng dụng Express của API Gateway
 */
function setupHttpProxies(app) {
  services.forEach(({ route, target }) => {
    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true, // Tránh lỗi CORS bằng cách chuyển đổi Header Host khớp với target
        onProxyReq: (proxyReq, req, res) => {
          // Nhận thông tin người dùng được mã hóa từ middleware auth của Gateway 
          // và chèn vào headers để gửi đi cho các microservice hạ nguồn.
          if (req.headers['x-user-payload']) {
            proxyReq.setHeader('x-user-payload', req.headers['x-user-payload']);
          }
        },
        onError: (err, req, res) => {
          console.error(`[Proxy Error] Lỗi kết nối tới service ${target}:`, err.message);
          res.status(500).json({ 
            message: 'Service Unavailable (Dịch vụ hiện không khả dụng)', 
            error: err.message 
          });
        }
      })
    );
  });
}

module.exports = {
  setupHttpProxies,
};
