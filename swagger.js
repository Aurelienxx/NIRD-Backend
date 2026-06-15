const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API NIRD',
      version: '1.0.0',
      description: 'Documentation de l’API NIRD'
    },
    servers: [
      {
        url: 'https://nird-backend.jrcan.dev'
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

  apis: [
    './src/**/*.js'
  ]
};

module.exports = swaggerJsdoc(options);