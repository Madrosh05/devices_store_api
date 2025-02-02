const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Horus Automation API',
      version: '1.0.0',
      description: 'API para gestión de productos y dispositivos IoT'
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);