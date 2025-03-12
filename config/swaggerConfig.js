// config/swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation for my application',
        },
        servers: [
            {
                //url: 'http://localhost:3000',  // Adjust as necessary
                url: `http://192.168.1.44:3000}`,  //http://192.168.1.37:3000
            },
        ],
    },
    apis: ['./app.js'], // Path to your API files (can be multiple files)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
