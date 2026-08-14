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
MAIL_SERVICE_URL=http://localhost:5001
CHAT_SERVICE_URL=http://localhost:5002
TODO_SERVICE_URL=http://localhost:5003
WORKSCHEDULE_SERVICE_URL=http://localhost:5004
CANTEEN_SERVICE_URL=http://localhost:5005
PAYMENT_SERVICE_URL=http://localhost:5006
JWT_SECRET=your_jwt_secret
