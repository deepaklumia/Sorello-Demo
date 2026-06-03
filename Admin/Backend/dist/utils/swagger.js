"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'SaaS POS Platform - Restaurant Admin API',
        description: 'REST API documentation for the Restaurant Admin module of the SaaS POS platform.',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:5002/api',
            description: 'Local Development Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    paths: {
        '/restaurant-auth/login': {
            post: {
                summary: 'Log in as a restaurant admin',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    slug: { type: 'string', example: 'burger-palace' },
                                    email: { type: 'string', format: 'email', example: 'info@burgerpalace.com' },
                                    password: { type: 'string', example: 'burger123' },
                                },
                                required: ['slug', 'email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Authentication successful',
                    },
                    401: {
                        description: 'Invalid credentials',
                    },
                },
            },
        },
        '/restaurant-auth/change-password': {
            post: {
                summary: 'Change temp password to permanent password',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    currentPassword: { type: 'string', example: 'temp_ab1234' },
                                    newPassword: { type: 'string', example: 'permanent123' },
                                },
                                required: ['currentPassword', 'newPassword'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Password changed successfully',
                    },
                },
            },
        },
        '/restaurant/profile': {
            get: {
                summary: 'Get restaurant profile',
                tags: ['Profile'],
                responses: {
                    200: {
                        description: 'Profile details returned',
                    },
                },
            },
            put: {
                summary: 'Update restaurant profile details',
                tags: ['Profile'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'New Restaurant Name' },
                                    phone: { type: 'string', example: '+15559876' },
                                    address: { type: 'string', example: '123 New Main St' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Profile updated successfully',
                    },
                },
            },
        },
        '/restaurant/menu/categories': {
            get: {
                summary: 'Get all menu categories',
                tags: ['Menu Categories'],
                responses: {
                    200: {
                        description: 'List of categories',
                    },
                },
            },
            post: {
                summary: 'Create a new menu category',
                tags: ['Menu Categories'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Starters' },
                                    description: { type: 'string', example: 'Appetizers and quick snacks' },
                                },
                                required: ['name'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Category created successfully',
                    },
                },
            },
        },
        '/restaurant/menu/items': {
            get: {
                summary: 'Get all menu items',
                tags: ['Menu Items'],
                responses: {
                    200: {
                        description: 'List of items',
                    },
                },
            },
            post: {
                summary: 'Create a new menu item',
                tags: ['Menu Items'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    categoryId: { type: 'string', format: 'uuid', example: 'uuid-here' },
                                    name: { type: 'string', example: 'Crispy Onion Rings' },
                                    description: { type: 'string', example: 'Golden fried onion rings' },
                                    price: { type: 'number', example: 5.99 },
                                    preparationTime: { type: 'integer', example: 8 },
                                    isAvailable: { type: 'boolean', example: true },
                                },
                                required: ['categoryId', 'name', 'price', 'preparationTime'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Menu item created successfully',
                    },
                },
            },
        },
        '/restaurant/hours': {
            get: {
                summary: 'Get weekly opening hours config',
                tags: ['Opening Hours'],
                responses: {
                    200: {
                        description: 'Weekly schedule config',
                    },
                },
            },
        },
        '/restaurant/orders': {
            get: {
                summary: 'Get all orders for the restaurant',
                tags: ['Orders'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'string' } },
                    { name: 'limit', in: 'query', schema: { type: 'string' } },
                    { name: 'orderStatus', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    200: {
                        description: 'List of orders with pagination metadata',
                    },
                },
            },
        },
        '/restaurant/dashboard': {
            get: {
                summary: 'Get aggregated dashboard metrics overview',
                tags: ['Dashboard'],
                responses: {
                    200: {
                        description: 'Aggregated analytics payload',
                    },
                },
            },
        },
    },
};
exports.default = exports.swaggerDocument;
