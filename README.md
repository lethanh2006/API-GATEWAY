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
- **Payment Service:** `/api/payment`

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
PAYMENT_SERVICE_URL=http://localhost:5006
JWT_SECRET=your_jwt_secret
CANTEEN_INTERNAL_SECRET=replace_with_a_long_random_shared_secret
PAYMENT_INTERNAL_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_PAYMENT_SECRET
```

`CANTEEN_INTERNAL_SECRET` phải giống cấu hình của Canteen;
`PAYMENT_INTERNAL_SECRET` phải giống cấu hình của Payment. Mỗi secret cần ít nhất
32 ký tự và phải được thay riêng theo từng môi trường.
