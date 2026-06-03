export declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    security: {
        BearerAuth: never[];
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            ErrorResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    errors: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                field: {
                                    type: string;
                                    example: string;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                            };
                        };
                    };
                };
            };
            Restaurant: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    phone: {
                        type: string;
                        example: string;
                    };
                    address: {
                        type: string;
                        example: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    subscriptionPlan: {
                        type: string;
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            Order: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    restaurantId: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    customerName: {
                        type: string;
                        example: string;
                    };
                    totalAmount: {
                        type: string;
                        example: number;
                    };
                    orderStatus: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    paymentStatus: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    restaurant: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                            };
                            name: {
                                type: string;
                            };
                        };
                    };
                };
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                };
            };
        };
    };
    paths: {
        '/auth/register': {
            post: {
                summary: string;
                security: never[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    passwordPlain: {
                                        type: string;
                                        minLength: number;
                                    };
                                    name: {
                                        type: string;
                                    };
                                    role: {
                                        type: string;
                                        enum: string[];
                                        default: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/auth/login': {
            post: {
                summary: string;
                security: never[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                token: {
                                                    type: string;
                                                    example: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/admin/restaurants': {
            get: {
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum?: undefined;
                    };
                    description: string;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                    };
                    description?: undefined;
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                        meta: {
                                            type: string;
                                            properties: {
                                                page: {
                                                    type: string;
                                                };
                                                limit: {
                                                    type: string;
                                                };
                                                totalCount: {
                                                    type: string;
                                                };
                                                totalPages: {
                                                    type: string;
                                                };
                                                hasNextPage: {
                                                    type: string;
                                                };
                                                hasPreviousPage: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    phone: {
                                        type: string;
                                    };
                                    address: {
                                        type: string;
                                    };
                                    status: {
                                        type: string;
                                        enum: string[];
                                        default: string;
                                    };
                                    subscriptionPlan: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/restaurants/{id}': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    phone: {
                                        type: string;
                                    };
                                    address: {
                                        type: string;
                                    };
                                    subscriptionPlan: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            delete: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/restaurants/{id}/status': {
            patch: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    status: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/orders': {
            get: {
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format?: undefined;
                        enum?: undefined;
                    };
                    description?: undefined;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        enum?: undefined;
                    };
                    description?: undefined;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format?: undefined;
                        enum?: undefined;
                    };
                    description: string;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                        format?: undefined;
                    };
                    description?: undefined;
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/orders/{id}': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/dashboard': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                totalRestaurants: {
                                                    type: string;
                                                    example: number;
                                                };
                                                activeRestaurants: {
                                                    type: string;
                                                    example: number;
                                                };
                                                totalOrders: {
                                                    type: string;
                                                    example: number;
                                                };
                                                todayOrders: {
                                                    type: string;
                                                    example: number;
                                                };
                                                totalRevenue: {
                                                    type: string;
                                                    example: number;
                                                };
                                                todayRevenue: {
                                                    type: string;
                                                    example: number;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/analytics/revenue': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                revenueByDay: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            date: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            revenue: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                                revenueByMonth: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            month: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            revenue: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                                revenueByRestaurant: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            restaurantId: {
                                                                type: string;
                                                                format: string;
                                                            };
                                                            restaurantName: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            revenue: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/admin/analytics/orders': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                orderTrendsByDay: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            date: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            count: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                                orderTrendsByMonth: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            month: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            count: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                                statusBreakdown: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            status: {
                                                                type: string;
                                                                example: string;
                                                            };
                                                            count: {
                                                                type: string;
                                                                example: number;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
