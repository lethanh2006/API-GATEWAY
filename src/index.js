require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';

app.use(cors());
app.use(morgan('dev'));

// 1. Định nghĩa các Router công khai không cần check Auth
const publicRoutes = [
  { path: '/api/auth/login', method: 'POST' },
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/auth/verify', method: 'POST' },
  { path: '/api-docs', method: 'GET' },
  { path: '/api/docs-merged.json', method: 'GET' },
];

function isPublicRoute(req) {
  return publicRoutes.some(route => 
    req.path.startsWith(route.path) && req.method === route.method
  );
}

// 2. Middleware xác thực JWT tập trung tại Gateway
const gatewayAuthMiddleware = async (req, res, next) => {
  if (isPublicRoute(req)) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
  }
  try {
    // Gọi Auth Service kiểm tra token thông qua Introspect endpoint
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/introspect`, {}, {
      headers: { Authorization: authHeader }
    });
    if (response.data && response.data.valid) {
      // Mã hóa payload người dùng sang Base64 để truyền đi an toàn bằng Header
      const userPayloadStr = JSON.stringify(response.data.user);
      const base64User = Buffer.from(userPayloadStr).toString('base64');
      
      // Inject thông tin user vào Header để gửi đi cho các microservice phía sau
      req.headers['x-user-payload'] = base64User;
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('[Gateway Auth Error]:', error.response?.data || error.message);
    const status = error.response?.status || 401;
    const message = error.response?.data?.message || 'Unauthorized';
    return res.status(status).json({ message });
  }
};

// Đính kèm Middleware vào toàn bộ Router ngoại trừ routing trực tiếp của /api/auth
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next(); // Cho qua để proxy chuyển thẳng tới Auth Service xử lý
  }
  gatewayAuthMiddleware(req, res, next);
});

// Danh sách các Microservices hạ nguồn
const services = [
  {
    route: '/api/auth',
    target: AUTH_SERVICE_URL,
  },
  {
    route: '/api/user',
    target: process.env.USER_SERVICE_URL || 'http://localhost:5000',
  },
  {
    route: '/api/chat',
    target: process.env.CHAT_SERVICE_URL || 'http://localhost:5002',
  },
  {
    route: '/api/todo',
    target: process.env.TODO_SERVICE_URL || 'http://localhost:5003',
  },
  {
    route: '/api/workschedule',
    target: process.env.WORKSCHEDULE_SERVICE_URL || 'http://localhost:5004',
  }
];

// Khởi tạo Socket proxy
const socketProxy = createProxyMiddleware({
  target: process.env.CHAT_SERVICE_URL || 'http://localhost:5002',
  changeOrigin: true,
  ws: true,
  on: {
    error: (err) => console.error('[Socket Proxy Error]', err.message),
  }
});

// Khởi tạo proxy cho từng dịch vụ
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // Truyền header 'x-user-payload' xuống các service hạ nguồn
        if (req.headers['x-user-payload']) {
          proxyReq.setHeader('x-user-payload', req.headers['x-user-payload']);
        }
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error target ${target}:`, err.message);
        res.status(500).json({ message: 'Service Unavailable', error: err.message });
      }
    })
  );
});

// Giữ nguyên phần logic Socket proxy, Swagger docs merged... ở cuối file cũ
let cachedSpecs = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // Cache 5 minutes

app.get('/api/docs-merged.json', async (req, res) => {
  const now = Date.now();
  if (cachedSpecs && (now - lastCacheTime < CACHE_TTL)) {
    return res.json(cachedSpecs);
  }

  const merged = {
    openapi: '3.0.0',
    info: { title: 'Centralized API Gateway', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Gateway Server' }],
    paths: {},
    components: { 
      schemas: {}, 
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      } 
    },
    tags: []
  };

  const fetchPromises = services.map(async (service) => {
    const serviceName = service.route.split('/').pop();
    try {
      const response = await axios.get(`${service.target}/api/docs.json`, { timeout: 1500 });
      const specData = response.data;
      
      // Save copy to local docs folder as fallback only if the online spec has paths defined
      if (specData && specData.paths && Object.keys(specData.paths).length > 0) {
        try {
          const docsDir = path.join(__dirname, 'docs');
          if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
          }
          fs.writeFileSync(
            path.join(docsDir, `${serviceName}.json`),
            JSON.stringify(specData, null, 2),
            'utf8'
          );
        } catch (fsErr) {
          console.error(`[Gateway] Failed to save local spec for ${serviceName}: ${fsErr.message}`);
        }
        return { service, spec: specData };
      }
      
      // If the online spec is empty, fallback to local docs file if it exists
      try {
        const localPath = path.join(__dirname, 'docs', `${serviceName}.json`);
        if (fs.existsSync(localPath)) {
          const fileData = fs.readFileSync(localPath, 'utf8');
          return { service, spec: JSON.parse(fileData) };
        }
      } catch (fsErr) {
        console.error(`[Gateway] Error reading fallback spec for empty online service ${serviceName}: ${fsErr.message}`);
      }
      return { service, spec: specData };
    } catch (error) {
      console.warn(`[Gateway] Online check failed for ${service.target}: ${error.message}. Checking local docs fallback...`);
      // Fallback to local files
      try {
        const localPath = path.join(__dirname, 'docs', `${serviceName}.json`);
        if (fs.existsSync(localPath)) {
          const fileData = fs.readFileSync(localPath, 'utf8');
          const specData = JSON.parse(fileData);
          return { service, spec: specData };
        }
      } catch (fsErr) {
        console.error(`[Gateway] Error reading fallback spec for ${serviceName}: ${fsErr.message}`);
      }
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);

  for (const result of results) {
    if (!result) continue;
    const { service, spec } = result;
    const serviceNameTag = service.route.split('/').pop().toUpperCase();

    merged.tags.push({ name: serviceNameTag });

    if (spec.paths) {
      for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
        let finalPath = pathStr;
        if (finalPath.startsWith('/api')) {
          finalPath = finalPath.replace('/api', service.route);
        } else {
          finalPath = service.route + (finalPath.startsWith('/') ? '' : '/') + finalPath;
        }

        for (const method of Object.keys(pathItem)) {
          if (pathItem[method]) {
            pathItem[method].tags = pathItem[method].tags || [];
            if (!pathItem[method].tags.includes(serviceNameTag)) {
              pathItem[method].tags.push(serviceNameTag);
            }
          }
        }

        merged.paths[finalPath] = pathItem;
      }
    }

    if (spec.components) {
      if (spec.components.schemas) Object.assign(merged.components.schemas, spec.components.schemas);
      if (spec.components.securitySchemes) Object.assign(merged.components.securitySchemes, spec.components.securitySchemes);
    }
  }

  cachedSpecs = merged;
  lastCacheTime = now;
  res.json(merged);
});

const swaggerOptions = {
  explorer: true,
  swaggerUrl: '/api/docs-merged.json'
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running', services: services.map(s => s.route) });
});

app.use('/socket.io', socketProxy);

const httpServer = app.listen(PORT, () => {
  console.log(`[Gateway] running on http://localhost:${PORT}`);
});

httpServer.on('upgrade', (req, socket, head) => {
  console.log('[Gateway] WS Upgrade request:', req.url);
  socketProxy.upgrade(req, socket, head);
});
