"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'SaaS POS Platform - Super Admin API',
        version: '1.0.0',
        description: 'Production-ready REST API for SaaS POS Platform Super Admin modules.',
    },
    servers: [
        {
            url: '/api',
            description: 'Main API Prefix',
        },
    ],
    security: [
        {
            BearerAuth: [],
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token as "Bearer <token>"',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Validation failed' },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: { type: 'string', example: 'body.email' },
                                message: { type: 'string', example: 'Invalid email address' },
                            },
                        },
                    },
                },
            },
            Restaurant: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: 'f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d' },
                    name: { type: 'string', example: 'Gourmet Kitchen' },
                    email: { type: 'string', format: 'email', example: 'contact@gourmet.com' },
                    phone: { type: 'string', example: '+15550199' },
                    address: { type: 'string', example: '123 Main St, New York, NY' },
                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
                    subscriptionPlan: { type: 'string', example: 'premium' },
                    createdAt: { type: 'string', format: 'date-time', example: '2026-06-03T15:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2026-06-03T15:00:00.000Z' },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
                    restaurantId: { type: 'string', format: 'uuid', example: 'f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d' },
                    customerName: { type: 'string', example: 'John Doe' },
                    totalAmount: { type: 'number', example: 45.50 },
                    orderStatus: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'PREPARED', 'COMPLETED', 'DECLINED'], example: 'COMPLETED' },
                    paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], example: 'PAID' },
                    createdAt: { type: 'string', format: 'date-time', example: '2026-06-03T15:05:00.000Z' },
                    restaurant: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                        },
                    },
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'STAFF'] },
                    restaurantId: { type: 'string', format: 'uuid', nullable: true },
                },
            },
        },
    },
    paths: {
        '/auth/register': {
            post: {
                summary: 'Register a new user (primarily Super Admin setup)',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'passwordPlain', 'name'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    passwordPlain: { type: 'string', minLength: 6 },
                                    name: { type: 'string' },
                                    role: { type: 'string', enum: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'STAFF'], default: 'SUPER_ADMIN' },
                                    restaurantId: { type: 'string', format: 'uuid' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User created successfully',
                    },
                    400: {
                        description: 'Invalid input',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'Authenticate and obtain JWT token',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Login successful' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                                                user: { $ref: '#/components/schemas/User' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid email or password',
                    },
                },
            },
        },
        '/admin/restaurants': {
            get: {
                summary: 'Get all restaurants',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'string' }, description: 'Page number' },
                    { name: 'limit', in: 'query', schema: { type: 'string' }, description: 'Items per page' },
                    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term for name' },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] } },
                ],
                responses: {
                    200: {
                        description: 'List of restaurants',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string' },
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                page: { type: 'number' },
                                                limit: { type: 'number' },
                                                totalCount: { type: 'number' },
                                                totalPages: { type: 'number' },
                                                hasNextPage: { type: 'boolean' },
                                                hasPreviousPage: { type: 'boolean' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create a new restaurant',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'phone', 'address', 'subscriptionPlan'],
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    phone: { type: 'string' },
                                    address: { type: 'string' },
                                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
                                    subscriptionPlan: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Restaurant created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/Restaurant' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/restaurants/{id}': {
            get: {
                summary: 'Get restaurant details',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: {
                        description: 'Restaurant details',
                        content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Restaurant' } } } } },
                    },
                    404: { description: 'Restaurant not found' },
                },
            },
            put: {
                summary: 'Update restaurant information',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    phone: { type: 'string' },
                                    address: { type: 'string' },
                                    subscriptionPlan: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Restaurant updated',
                        content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Restaurant' } } } } },
                    },
                },
            },
            delete: {
                summary: 'Soft delete restaurant',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: {
                        description: 'Restaurant soft deleted',
                        content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' } } } } },
                    },
                },
            },
        },
        '/admin/restaurants/{id}/status': {
            patch: {
                summary: 'Activate, deactivate, or suspend restaurant',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['status'],
                                properties: {
                                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Status updated',
                        content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Restaurant' } } } } },
                    },
                },
            },
        },
        '/admin/orders': {
            get: {
                summary: 'View all orders across the platform',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'string' } },
                    { name: 'limit', in: 'query', schema: { type: 'string' } },
                    { name: 'restaurantId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'startDate', in: 'query', schema: { type: 'string' }, description: 'ISO date or YYYY-MM-DD' },
                    { name: 'endDate', in: 'query', schema: { type: 'string' } },
                    { name: 'orderStatus', in: 'query', schema: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'PREPARED', 'COMPLETED', 'DECLINED'] } },
                    { name: 'paymentStatus', in: 'query', schema: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] } },
                ],
                responses: {
                    200: {
                        description: 'List of orders',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/orders/{id}': {
            get: {
                summary: 'Get order details',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: {
                        description: 'Order details',
                        content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Order' } } } } },
                    },
                },
            },
        },
        '/admin/dashboard': {
            get: {
                summary: 'Get high-level dashboard metrics',
                responses: {
                    200: {
                        description: 'Dashboard metrics',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                totalRestaurants: { type: 'integer', example: 10 },
                                                activeRestaurants: { type: 'integer', example: 8 },
                                                totalOrders: { type: 'integer', example: 1500 },
                                                todayOrders: { type: 'integer', example: 45 },
                                                totalRevenue: { type: 'number', example: 34500.25 },
                                                todayRevenue: { type: 'number', example: 1250.50 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/analytics/revenue': {
            get: {
                summary: 'Get revenue analytics breakdown',
                responses: {
                    200: {
                        description: 'Revenue trends by day, month, and restaurant',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                revenueByDay: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            date: { type: 'string', example: '2026-06-03' },
                                                            revenue: { type: 'number', example: 1250.50 },
                                                        },
                                                    },
                                                },
                                                revenueByMonth: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            month: { type: 'string', example: '2026-06' },
                                                            revenue: { type: 'number', example: 35200.00 },
                                                        },
                                                    },
                                                },
                                                revenueByRestaurant: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            restaurantId: { type: 'string', format: 'uuid' },
                                                            restaurantName: { type: 'string', example: 'Gourmet Kitchen' },
                                                            revenue: { type: 'number', example: 15400.20 },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/analytics/orders': {
            get: {
                summary: 'Get order trends and status breakdown',
                responses: {
                    200: {
                        description: 'Order analytics',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                orderTrendsByDay: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            date: { type: 'string', example: '2026-06-03' },
                                                            count: { type: 'integer', example: 45 },
                                                        },
                                                    },
                                                },
                                                orderTrendsByMonth: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            month: { type: 'string', example: '2026-06' },
                                                            count: { type: 'integer', example: 1200 },
                                                        },
                                                    },
                                                },
                                                statusBreakdown: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            status: { type: 'string', example: 'COMPLETED' },
                                                            count: { type: 'integer', example: 850 },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
