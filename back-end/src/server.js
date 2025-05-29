'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom'); // Declare Boom variable
require('dotenv').config();

// Import plugins and routes
const authPlugin = require('./plugins/auth');
const databasePlugin = require('./plugins/database');
const userRoutes = require('./routes/users');
const childrenRoutes = require('./routes/children');
const measurementRoutes = require('./routes/measurements');
const articleRoutes = require('./routes/articles');
const messageRoutes = require('./routes/messages');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:3000'], // Your frontend URL
                credentials: true
            },
            validate: {
                failAction: async (request, h, err) => {
                    if (process.env.NODE_ENV === 'production') {
                        console.error('ValidationError:', err.message);
                        throw Boom.badRequest('Invalid request payload input'); // Use Boom here
                    } else {
                        console.error(err);
                        throw err;
                    }
                }
            }
        }
    });

    // Register plugins
    await server.register([
        require('@hapi/inert'),
        require('@hapi/vision'),
        {
            plugin: require('hapi-swagger'),
            options: {
                info: {
                    title: 'Stunting Prevention API',
                    version: '1.0.0',
                    description: 'API documentation for Stunting Prevention Application'
                },
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header'
                    }
                }
            }
        },
        databasePlugin,
        authPlugin
    ]);

    // Register routes
    server.route([
        ...userRoutes,
        ...childrenRoutes,
        ...measurementRoutes,
        ...articleRoutes,
        ...messageRoutes
    ]);

    // Health check endpoint
    server.route({
        method: 'GET',
        path: '/health',
        handler: (request, h) => {
            return { status: 'OK', timestamp: new Date().toISOString() };
        },
        options: {
            description: 'Health check endpoint',
            tags: ['api', 'health']
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();