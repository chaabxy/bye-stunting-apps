'use strict';

const knex = require('knex');

const databasePlugin = {
    name: 'database',
    version: '1.0.0',
    register: async function (server, options) {
        const knexConfig = {
            client: 'postgresql',
            connection: {
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            },
            pool: {
                min: 2,
                max: 10
            },
            migrations: {
                tableName: 'knex_migrations',
                directory: './migrations'
            },
            seeds: {
                directory: './seeds'
            }
        };

        const db = knex(knexConfig);

        // Test connection
        try {
            await db.raw('SELECT 1');
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }

        // Make database available throughout the application
        server.decorate('server', 'db', db);
        server.decorate('request', 'db', db);
    }
};

module.exports = databasePlugin;