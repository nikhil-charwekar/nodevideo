const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Setup Swagger UI for API Documentation
 * @param {object} app - Express app instance
 */
function setupSwaggerUI(app) {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Video Streaming API',
                version: '1.0.0',
                description: 'An API for video streaming and category management'
            },
            servers: [
                {
                    //  url: `http://localhost:${process.env.PORT || 3000}`,
                    url: `http://192.168.1.44:${process.env.PORT || 3000}`,  //http://192.168.1.37:3000
                },
            ],
        },
        apis: ['./routes/*.js'], // Path to the routes files that contain Swagger annotations
    };

    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwaggerUI;
