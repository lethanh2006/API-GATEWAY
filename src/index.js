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
    // {
    //   route: '/api/mail',
    //   target: process.env.MAIL_SERVICE_URL || 'http://localhost:5001',
    // },
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

  const socketProxy = createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true,
    ws: true,
    on: {
      error: (err) => console.error('[Socket Proxy Error]', err.message),
    }
  });

  services.forEach(({ route, target }) => {
    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true,
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

        merged.tags.push({ name: serviceNameTag });

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

   app.use('/socket.io', socketProxy);

  const httpServer = app.listen(PORT, () => {
    console.log(`[Gateway] running on http://localhost:${PORT}`);
  });

  httpServer.on('upgrade', (req, socket, head) => {
    console.log('[Gateway] WS Upgrade request:', req.url);
    socketProxy.upgrade(req, socket, head);
  });
