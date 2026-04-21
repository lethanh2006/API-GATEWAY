require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(morgan('dev'));


const services = [
  {
    route: '/api/user',
    target: process.env.USER_SERVICE_URL || 'http://localhost:5000',
  },
  {
    route: '/api/mail',
    target: process.env.MAIL_SERVICE_URL || 'http://localhost:5001',
  },
  {
    route: '/api/chat',
    target: process.env.CHAT_SERVICE_URL || 'http://localhost:5002',
  }
];


services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: '/api/v1', 
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error target ${target}:`, err.message);
        res.status(500).json({ message: 'Service Unavailable', error: err.message });
      }
    })
  );
});


app.get('/api/docs-merged.json', async (req, res) => {
  const merged = {
    openapi: '3.0.0',
    info: { title: 'Centralized API Gateway', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Gateway Server' }],
    paths: {},
    components: { schemas: {}, securitySchemes: {} },
    tags: []
  };

  for (const service of services) {
    try {
      const response = await axios.get(`${service.target}/api/docs.json`);
      const spec = response.data;
      const serviceNameTag = service.route.split('/').pop().toUpperCase(); 

      merged.tags.push({ name: serviceNameTag, description: `Endpoints from ${serviceNameTag} service` });

      if (spec.paths) {
        for (const [path, pathItem] of Object.entries(spec.paths)) {
          let finalPath = path;
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
    } catch (error) {
      console.error(`[Gateway] Ignore Swagger spec for ${service.target}: ${error.message}`);
    }
  }

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

app.listen(PORT, () => {
  console.log(`[Gateway] Server is running on http://localhost:${PORT}`);
  console.log(`[Gateway] Swagger UI available at http://localhost:${PORT}/api-docs`);
});
