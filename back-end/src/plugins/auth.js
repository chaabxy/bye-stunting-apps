'use strict';

const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const authPlugin = {
    name: 'auth',
    version: '1.0.0',
    register: async function (server, options) {
        // JWT authentication scheme
        server.auth.scheme('jwt', (server, options) => {
            return {
                authenticate: async (request, h) => {
                    const authorization = request.headers.authorization;

                    if (!authorization || !authorization.startsWith('Bearer ')) {
                        throw Boom.unauthorized('Missing or invalid authorization header');
                    }

                    const token = authorization.substring(7); // Remove 'Bearer ' prefix

                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET);
                        
                        // Get user from database
                        const user = await request.db('users')
                            .where({ id: decoded.userId })
                            .first();

                        if (!user) {
                            throw Boom.unauthorized('User not found');
                        }

                        return h.authenticated({
                            credentials: {
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role
                                }
                            }
                        });
                    } catch (error) {
                        if (error.name === 'JsonWebTokenError') {
                            throw Boom.unauthorized('Invalid token');
                        }
                        if (error.name === 'TokenExpiredError') {
                            throw Boom.unauthorized('Token expired');
                        }
                        throw error;
                    }
                }
            };
        });

        // Register the strategy
        server.auth.strategy('jwt', 'jwt');
        server.auth.default('jwt');
    }
};

module.exports = authPlugin;