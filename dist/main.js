"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bodyParser = __importStar(require("body-parser"));
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_proxy_middleware_1 = require("http-proxy-middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '10mb' }));
    app.enableCors({
        origin: '*',
        credentials: false,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle(process.env.TITTLE_SWAGGER || 'Centralized API Gateway')
        .setDescription(process.env.CONTENT_SWAGGER || 'API Gateway for Microservices')
        .setVersion(process.env.VERSION_SWAGGER || '1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(process.env.ENDPOINT_SWAGGER || 'api-docs', app, document);
    const chatServiceUrl = process.env.CHAT_SERVICE_URL || 'http://localhost:5002';
    const socketProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: chatServiceUrl,
        changeOrigin: true,
        ws: true,
        onError: (err) => {
            console.error('[Socket Proxy Error]', err.message);
        },
    });
    app.use('/socket.io', socketProxy);
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`[Gateway] đang khởi chạy thành công tại: http://localhost:${port}`);
    const server = app.getHttpServer();
    server.on('upgrade', (req, socket, head) => {
        console.log('[Gateway] Nhận được yêu cầu nâng cấp kết nối WS Upgrade:', req.url);
        socketProxy.upgrade(req, socket, head);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map