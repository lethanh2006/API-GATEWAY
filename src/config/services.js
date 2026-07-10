// File cấu hình tập trung cho toàn bộ các dịch vụ và phân quyền đường dẫn của API Gateway.
// Bạn có thể thêm bớt microservice hoặc route công khai tại đây.

require('dotenv').config();

// Cổng chạy chính của API Gateway (mặc định là 3000)
const PORT = process.env.PORT || 3000;

// Secret Key để xác thực chữ ký Token JWT (Phải đồng bộ với Auth Service)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-chatapp';

// Đường dẫn (URL) tới các Microservices hạ nguồn (Downstream Services)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';
const CANTEEN_SERVICE_URL = process.env.CANTEEN_SERVICE_URL || 'http://localhost:5005';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5006';
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:5002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5000';
const TODO_SERVICE_URL = process.env.TODO_SERVICE_URL || 'http://localhost:5003';
const WORKSCHEDULE_SERVICE_URL = process.env.WORKSCHEDULE_SERVICE_URL || 'http://localhost:5004';

// 1. Định nghĩa các Router công khai (Public Routes)
// Client gọi các API này từ bên ngoài (máy của Client) sẽ KHÔNG cần Gateway kiểm tra Token JWT.
// Phù hợp cho các API như đăng nhập, đăng ký, verify hoặc trang tài liệu Swagger.
const publicRoutes = [
  { path: '/api/auth/login', method: 'POST' },
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/auth/verify', method: 'POST' },
  { path: '/api-docs', method: 'GET' },
  { path: '/api/docs-merged.json', method: 'GET' },
];

/**
 * Kiểm tra xem request từ client gửi lên có khớp với một Public Route đã khai báo hay không.
 * @param {import('express').Request} req - Request đối tượng từ Express
 * @returns {boolean} - Trả về true nếu là route công khai, ngược lại là false.
 */
function isPublicRoute(req) {
  return publicRoutes.some(route => 
    req.path.startsWith(route.path) && req.method === route.method
  );
}

// 2. Danh sách các Microservices hạ nguồn mà Gateway cần chuyển tiếp (Proxy)
// - route: Đường dẫn bắt đầu tại Gateway (ví dụ: khi client gọi http://localhost:3000/api/canteen/...)
// - target: URL thực tế của Microservice sẽ tiếp nhận và xử lý request đó.
const services = [
  {
    route: '/api/auth',
    target: AUTH_SERVICE_URL,
  },
  {
    route: '/api/user',
    target: USER_SERVICE_URL,
  },
  {
    route: '/api/chat',
    target: CHAT_SERVICE_URL,
  },
  {
    route: '/api/todo',
    target: TODO_SERVICE_URL,
  },
  {
    route: '/api/workschedule',
    target: WORKSCHEDULE_SERVICE_URL,
  },
  {
    route: '/api/canteen',
    target: CANTEEN_SERVICE_URL,
  },
  {
    route: '/api/payment',
    target: PAYMENT_SERVICE_URL,
  }
];

// 3. Định nghĩa Phân quyền Truy cập theo Vai trò (RBAC Rules tại Gateway)
// Mỗi quy tắc cấu hình gồm:
// - path: Có thể là một chuỗi bắt đầu (string) hoặc một biểu thức chính quy (RegExp)
// - method: Phương thức HTTP áp dụng (nếu bỏ trống nghĩa là áp dụng cho mọi method)
// - roles: Danh sách vai trò được phép truy cập
const rbacRules = [
  // --- Dịch vụ Lịch làm việc (Workschedule Service) ---
  { path: '/api/workschedule/schedule/pending', roles: ['admin'] },
  { path: '/api/workschedule/schedule/all', roles: ['admin'] },
  { path: '/api/workschedule/schedule/heatmap', roles: ['admin'] },
  { path: '/api/workschedule/schedule/requests/bulk-approve', roles: ['admin'] },
  { path: /\/api\/workschedule\/schedule\/requests\/[^/]+\/(approve|reject)$/, method: 'POST', roles: ['admin'] },
  { path: '/api/workschedule/policy', method: 'PATCH', roles: ['admin'] },
  { path: '/api/workschedule/attendance/qr/generate', roles: ['admin'] },
  { path: '/api/workschedule/attendance/today', roles: ['admin'] },
  { path: '/api/workschedule/attendance/report', roles: ['admin'] },

  // --- Dịch vụ Canteen (Canteen Service) ---
  { path: '/api/canteen/admin', roles: ['admin'] },

  // --- Dịch vụ Task/Todo (Todo Service) ---
  { path: /^\/api\/todo\/?$/, method: 'GET', roles: ['admin'] },
  { path: /^\/api\/todo\/?$/, method: 'POST', roles: ['admin'] },
  { path: /\/api\/todo\/[^/]+\/assign$/, method: 'PATCH', roles: ['admin'] },
  { path: /\/api\/todo\/[^/]+$/, method: 'DELETE', roles: ['admin'] },
];

/**
 * Kiểm tra phân quyền truy cập của người dùng đối với API hiện tại.
 * @param {string} path - req.path thực tế gửi lên
 * @param {string} method - req.method (GET, POST, etc.)
 * @param {string} userRole - Vai trò của người dùng
 * @returns {boolean} - true nếu hợp lệ được đi tiếp, false nếu bị chặn
 */
function checkRbac(path, method, userRole) {
  // Tìm quy tắc bảo vệ khớp với request
  const rule = rbacRules.find(r => {
    const pathMatch = typeof r.path === 'string'
      ? path.startsWith(r.path)
      : r.path.test(path);
    const methodMatch = !r.method || r.method === method;
    return pathMatch && methodMatch;
  });

  // Nếu API không bị quản lý trong rbacRules, mặc định cho qua
  if (!rule) {
    return true;
  }

  // Nếu có quy tắc bảo vệ, kiểm tra vai trò của user
  return rule.roles.includes(userRole);
}

module.exports = {
  PORT,
  JWT_SECRET,
  AUTH_SERVICE_URL,
  CHAT_SERVICE_URL,
  publicRoutes,
  isPublicRoute,
  services,
  checkRbac,
};
