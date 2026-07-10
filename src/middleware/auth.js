// Middleware xác thực JWT tập trung tại API Gateway.
// Thực hiện tự xác thực chữ ký token trực tiếp tại Gateway (Stateless Verification) bằng JWT_SECRET.
// Không còn tạo request HTTP gọi sang Auth Service giúp tăng hiệu năng tối đa và tránh nghẽn cổ chai.

const jwt = require('jsonwebtoken');
const { JWT_SECRET, isPublicRoute, checkRbac } = require('../config/services');

/**
 * Middleware chặn các API Private để xác thực token trực tiếp tại Gateway.
 * 
 * CHI TIẾT LUỒNG DỮ LIỆU MỚI (TỐI ƯU):
 * 1. Client (Trình duyệt/Postman) -> gửi Request kèm Header `Authorization: Bearer <token>` tới Gateway.
 * 2. Gateway chặn request:
 *    - Nếu là API Public (đăng nhập/đăng ký...) -> next() cho qua trực tiếp.
 *    - Nếu là API Private -> lấy Token từ header Authorization.
 * 3. Gateway tự sử dụng thư viện `jsonwebtoken` và khóa bí mật `JWT_SECRET` để xác minh chữ ký:
 *    - Nếu Token sai chữ ký hoặc hết hạn -> Gateway trả thẳng lỗi 401 Unauthorized về cho Client.
 *    - Nếu Token hợp lệ -> Gateway giải mã (decode) thu được payload của User (bao gồm id, email, username, role, permissions).
 * 4. Gateway mã hoá Base64 payload của User đó rồi chèn vào Header `x-user-payload` của request hiện tại.
 * 5. Gateway chuyển tiếp request (Proxy) kèm theo Header đã chèn xuống các service con hạ nguồn.
 * 6. Các Microservices hạ nguồn (User, Chat, Canteen, v.v.) chỉ việc giải mã Base64 từ header `x-user-payload` 
 *    để lấy thông tin User sử dụng trực tiếp mà không cần làm bất kỳ bước xác thực nào khác.
 */
const gatewayAuthMiddleware = async (req, res, next) => {
  // Bước 1: Kiểm tra xem request có phải là route công khai không cần check Auth.
  if (isPublicRoute(req)) {
    return next();
  }

  // Bước 2: Kiểm tra cấu trúc header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
  }

  // Tách lấy chuỗi token JWT
  const token = authHeader.split(' ')[1];

  try {
    // Bước 3: Tự kiểm tra chữ ký và giải mã JWT tại Gateway bằng JWT_SECRET (không tốn request HTTP ra ngoài)
    const decoded = jwt.verify(token, JWT_SECRET);

    // Bước 4: Kiểm tra cấu trúc payload hợp lệ
    if (decoded && decoded.user && decoded.user._id) {
      // Kiểm tra vai trò và phân quyền (RBAC) ngay tại biên Gateway
      const userRole = decoded.user.role || 'user';
      if (!checkRbac(req.path, req.method, userRole)) {
        return res.status(403).json({ 
          message: `Forbidden: Access denied for role '${userRole}' (Không có quyền truy cập)` 
        });
      }

      // Mã hóa thông tin người dùng sang Base64 để truyền đi qua Header
      const userPayloadStr = JSON.stringify(decoded.user);
      const base64User = Buffer.from(userPayloadStr).toString('base64');
      
      // Inject thông tin user vào Header để gửi đi cho các microservice phía sau
      req.headers['x-user-payload'] = base64User;
      
      // Cho phép request tiếp tục đi tới bước phân tuyến (Proxy) tiếp theo
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload structure' });
    }
  } catch (error) {
    console.error('[Gateway Local Auth Error]:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = {
  gatewayAuthMiddleware,
};
