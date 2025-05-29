'use strict';

const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const userRoutes = [
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: async (request, h) => {
            const { email, password, full_name, phone } = request.payload;

            try {
                // Check if user already exists
                const existingUser = await request.db('users')
                    .where({ email })
                    .first();

                if (existingUser) {
                    throw Boom.conflict('User already exists');
                }

                // Hash password
                const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
                const password_hash = await bcrypt.hash(password, saltRounds);

                // Create user
                const [user] = await request.db('users')
                    .insert({
                        id: uuidv4(),
                        email,
                        password_hash,
                        full_name,
                        phone,
                        role: 'user'
                    })
                    .returning(['id', 'email', 'full_name', 'role', 'created_at']);

                // Generate JWT token
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return {
                    message: 'User registered successfully',
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role
                    },
                    token
                };
            } catch (error) {
                if (error.isBoom) {
                    throw error;
                }
                console.error('Registration error:', error);
                throw Boom.internal('Registration failed');
            }
        },
        options: {
            auth: false,
            description: 'Register a new user',
            tags: ['api', 'auth'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).required(),
                    full_name: Joi.string().min(2).required(),
                    phone: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: async (request, h) => {
            const { email, password } = request.payload;

            try {
                // Find user
                const user = await request.db('users')
                    .where({ email })
                    .first();

                if (!user) {
                    throw Boom.unauthorized('Invalid credentials');
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                if (!isValidPassword) {
                    throw Boom.unauthorized('Invalid credentials');
                }

                // Generate JWT token
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return {
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role
                    },
                    token
                };
            } catch (error) {
                if (error.isBoom) {
                    throw error;
                }
                console.error('Login error:', error);
                throw Boom.internal('Login failed');
            }
        },
        options: {
            auth: false,
            description: 'User login',
            tags: ['api', 'auth'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users/profile',
        handler: async (request, h) => {
            const userId = request.auth.credentials.user.id;

            try {
                const user = await request.db('users')
                    .select(['id', 'email', 'full_name', 'phone', 'role', 'created_at'])
                    .where({ id: userId })
                    .first();

                if (!user) {
                    throw Boom.notFound('User not found');
                }

                return { user };
            } catch (error) {
                if (error.isBoom) {
                    throw error;
                }
                console.error('Profile fetch error:', error);
                throw Boom.internal('Failed to fetch profile');
            }
        },
        options: {
            description: 'Get user profile',
            tags: ['api', 'users'],
            auth: 'jwt'
        }
    }
];

module.exports = userRoutes;