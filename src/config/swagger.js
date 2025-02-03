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
        url: process.env.API_URL || 'http://localhost:3001'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string'
                  },
                  param: {
                    type: 'string'
                  }
                }
              },
              description: 'Lista de errores detallados (opcional)'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            price: {
              type: 'number'
            }
          }
        },
        Device: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            type: {
              type: 'string'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            email: {
              type: 'string'
            },
            password: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);