import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description?: string | undefined;
    };
}, {
    body: {
        name: string;
        description?: string | undefined;
    };
}>;
export declare const updateCategorySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
    }>, {
        name?: string | undefined;
        description?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
    };
}>;
export declare const getCategoryByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const createItemSchema: z.ZodObject<{
    body: z.ZodObject<{
        categoryId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        price: z.ZodNumber;
        preparationTime: z.ZodNumber;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        categoryId: string;
        price: number;
        preparationTime: number;
        description?: string | undefined;
        imageUrl?: string | undefined;
        isAvailable?: boolean | undefined;
    }, {
        name: string;
        categoryId: string;
        price: number;
        preparationTime: number;
        description?: string | undefined;
        imageUrl?: string | undefined;
        isAvailable?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        categoryId: string;
        price: number;
        preparationTime: number;
        description?: string | undefined;
        imageUrl?: string | undefined;
        isAvailable?: boolean | undefined;
    };
}, {
    body: {
        name: string;
        categoryId: string;
        price: number;
        preparationTime: number;
        description?: string | undefined;
        imageUrl?: string | undefined;
        isAvailable?: boolean | undefined;
    };
}>;
export declare const updateItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        categoryId: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        price: z.ZodOptional<z.ZodNumber>;
        preparationTime: z.ZodOptional<z.ZodNumber>;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    }>, {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        categoryId?: string | undefined;
        imageUrl?: string | undefined;
        price?: number | undefined;
        preparationTime?: number | undefined;
        isAvailable?: boolean | undefined;
    };
}>;
export declare const getItemByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const updateItemAvailabilitySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        isAvailable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        isAvailable: boolean;
    }, {
        isAvailable: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isAvailable: boolean;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isAvailable: boolean;
    };
}>;
export default createCategorySchema;
