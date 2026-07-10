// Module gộp tài liệu Swagger API (Swagger Merged) của toàn bộ các Microservices hạ nguồn.
// Giúp lập trình viên chỉ cần vào cổng Gateway (http://localhost:3000/api-docs) là xem được tất cả API.

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { services, PORT } = require('../config/services');

const router = express.Router();

let cachedSpecs = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // Bộ nhớ đệm (Cache) tài liệu trong 5 phút để tăng tốc độ phản hồi

router.get('/docs-merged.json', async (req, res) => {
  const now = Date.now();
  // Nếu đã có cache và chưa hết hạn 5 phút, trả về cache ngay lập tức
  if (cachedSpecs && (now - lastCacheTime < CACHE_TTL)) {
    return res.json(cachedSpecs);
  }

  // Khung sườn tài liệu OpenAPI 3.0 của Gateway
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

  // Lặp qua danh sách service để tải docs.json từ từng service
  const fetchPromises = services.map(async (service) => {
    const serviceName = service.route.split('/').pop();
    try {
      // 1. Gateway gọi xuống API docs của Service (Local gọi Gateway -> Gateway gọi Service)
      const response = await axios.get(`${service.target}/api/docs.json`, { timeout: 1500 });
      const specData = response.data;

      // Nếu Service trả về dữ liệu API hợp lệ, lưu lại bản backup offline
      if (specData && specData.paths && Object.keys(specData.paths).length > 0) {
        try {
          const docsDir = path.join(__dirname, '..', 'docs');
          if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
          }
          fs.writeFileSync(
            path.join(docsDir, `${serviceName}.json`),
            JSON.stringify(specData, null, 2),
            'utf8'
          );
        } catch (fsErr) {
          console.error(`[Gateway Swagger] Không thể lưu file spec cho ${serviceName}: ${fsErr.message}`);
        }
        return { service, spec: specData };
      }

      // Nếu service online phản hồi rỗng, đọc lại bản backup offline
      try {
        const localPath = path.join(__dirname, '..', 'docs', `${serviceName}.json`);
        if (fs.existsSync(localPath)) {
          const fileData = fs.readFileSync(localPath, 'utf8');
          return { service, spec: JSON.parse(fileData) };
        }
      } catch (fsErr) {
        console.error(`[Gateway Swagger] Lỗi đọc fallback spec cho ${serviceName}: ${fsErr.message}`);
      }
      return { service, spec: specData };
    } catch (error) {
      console.warn(`[Gateway Swagger] Lỗi kết nối online tới ${service.target}: ${error.message}. Sử dụng file backup local...`);
      // Lấy file backup local khi không kết nối được dịch vụ (Offline)
      try {
        const localPath = path.join(__dirname, '..', 'docs', `${serviceName}.json`);
        if (fs.existsSync(localPath)) {
          const fileData = fs.readFileSync(localPath, 'utf8');
          const specData = JSON.parse(fileData);
          return { service, spec: specData };
        }
      } catch (fsErr) {
        console.error(`[Gateway Swagger] Lỗi đọc fallback spec offline cho ${serviceName}: ${fsErr.message}`);
      }
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);

  // Gộp (merge) tài liệu từ các service khác nhau
  for (const result of results) {
    if (!result) continue;
    const { service, spec } = result;
    const serviceNameTag = service.route.split('/').pop().toUpperCase();

    if (spec.paths) {
      for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
        let finalPath = pathStr;
        // Map lại route của service hạ nguồn qua route của gateway
        if (finalPath.startsWith('/api')) {
          finalPath = finalPath.replace('/api', service.route);
        } else {
          finalPath = service.route + (finalPath.startsWith('/') ? '' : '/') + finalPath;
        }

        // Định dạng tag để phân nhóm hiển thị trên Swagger UI theo tên Service
        for (const method of Object.keys(pathItem)) {
          if (pathItem[method]) {
            if (pathItem[method].tags && pathItem[method].tags.length > 0) {
              pathItem[method].tags = pathItem[method].tags.map(tag => {
                const prefixedTag = `${serviceNameTag} - ${tag}`;
                if (!merged.tags.some(t => t.name === prefixedTag)) {
                  merged.tags.push({ name: prefixedTag });
                }
                return prefixedTag;
              });
            } else {
              pathItem[method].tags = [serviceNameTag];
              if (!merged.tags.some(t => t.name === serviceNameTag)) {
                merged.tags.push({ name: serviceNameTag });
              }
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
  // Trả về dữ liệu JSON đã gộp hoàn chỉnh
  res.json(merged);
});

const swaggerOptions = {
  explorer: true,
  swaggerUrl: '/api/docs-merged.json'
};

/**
 * Thiết lập route tài liệu Swagger cho Express App.
 * @param {import('express').Application} app - Ứng dụng Express chính
 */
function setupSwaggerDocs(app) {
  // Gắn route docs-merged.json vào prefix /api
  app.use('/api', router);
  // Gắn giao diện web Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
}

module.exports = {
  setupSwaggerDocs,
};
