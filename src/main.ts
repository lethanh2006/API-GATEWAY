import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configure bodyParser JSON payload limits
  app.use(bodyParser.json({ limit: '10mb' }));

  // 2. Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: '*',
    credentials: false,
  });

  // 3. Setup global validation pipes matching user DTO validation standards
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // 4. Configure Centralized Swagger UI route using native SwaggerModule scanning
  const config = new DocumentBuilder()
    .setTitle(process.env.TITTLE_SWAGGER || 'Centralized API Gateway')
    .setDescription(process.env.CONTENT_SWAGGER || 'API Gateway for Microservices')
    .setVersion(process.env.VERSION_SWAGGER || '1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.ENDPOINT_SWAGGER || 'api-docs', app, document);

  // 5. Setup WebSocket / Socket.io reverse proxy for Chat Service
  const chatServiceUrl = process.env.CHAT_SERVICE_URL || 'http://localhost:5002';
  const socketProxy = createProxyMiddleware({
    target: chatServiceUrl,
    changeOrigin: true,
    ws: true,
    onError: (err: any) => {
      console.error('[Socket Proxy Error]', err.message);
    },
  });

  // Attach socket.io path to socketProxy middleware
  app.use('/socket.io', socketProxy);

  // 6. Start the API Gateway HTTP Server
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`[Gateway] đang khởi chạy thành công tại: http://localhost:${port}`);

  // 7. Bind WebSocket Upgrade listener for Socket.io traffic
  const server = app.getHttpServer();
  server.on('upgrade', (req: any, socket: any, head: any) => {
    console.log('[Gateway] Nhận được yêu cầu nâng cấp kết nối WS Upgrade:', req.url);
    socketProxy.upgrade(req, socket, head);
  });
}

bootstrap();
