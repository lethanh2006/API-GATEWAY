# API Gateway Service

A centralized, production-ready NestJS API Gateway that routes client requests, enables CORS, validates inputs, and handles reverse proxying for real-time WebSockets (Socket.io) to upstream microservices.

## Features

- **Centralized Routing:** Single entrypoint routing to multiple upstream microservices.
- **WebSocket Reverse Proxy:** Built-in Socket.io proxying with automatic upgrade handling for the Chat Service.
- **Auto-generated Documentation:** Embedded OpenAPI Swagger documentation.
- **Global Validation Pipes:** Whitelisting and automatic DTO validation.
- **Security Headers:** CORS configured for dynamic environments.

## Microservices Proxied

- **Authentication Service:** `/api/auth`
- **User Service:** `/api/user`
- **Chat Service:** `/api/chat` & `/socket.io`
- **Todo Service:** `/api/todo`
- **Workschedule Service:** `/api/workschedule`
- **Canteen Service:** `/api/canteen`

## Environment Variables

Copy the template from `.env.example` and set the following parameters:

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:4000
USER_SERVICE_URL=http://localhost:5000
CHAT_SERVICE_URL=http://localhost:5002
TODO_SERVICE_URL=http://localhost:5003
WORKSCHEDULE_SERVICE_URL=http://localhost:5004
CANTEEN_SERVICE_URL=http://localhost:5005
JWT_SECRET=your_jwt_secret
CANTEEN_INTERNAL_SECRET=replace_with_a_long_random_shared_secret
```

`CANTEEN_INTERNAL_SECRET` phải giống cấu hình của Canteen, có ít nhất 32 ký tự
và được thay riêng theo từng môi trường.

## Luồng căn tin nhân viên

Nhân viên chọn bàn rồi tạo đơn với `tableId`, danh sách món và `paymentMethod: CASH`.
Giá món/tùy chọn được tính tại Canteen; client chỉ gửi tên tùy chọn.
Admin xem/lọc đơn theo bàn và xác nhận `PATCH /api/canteen/orders/:id/payment/cash`.
Đơn mới có trạng thái `CREATED`, `COMPLETED` hoặc `CANCELLED`;
thanh toán có `PENDING` hoặc `PAID`.

Các API quản lý món, danh mục, bàn và đơn vẫn được giữ. Đã gỡ DTO/API bếp,
kho, nguyên liệu, phân bàn tự động và tích hợp QR/Casso khỏi Gateway.
