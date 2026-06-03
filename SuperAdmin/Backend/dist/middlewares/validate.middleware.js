"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const api_error_1 = require("../utils/api-error");
const validate = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Assign coerced/validated values back to request
        req.body = parsed.body;
        req.query = parsed.query;
        req.params = parsed.params;
        next();
    }
    catch (error) {
        console.log("error", error);
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((err) => ({
                field: err.path.slice(1).join('.'), // slice(1) removes the root 'body', 'query', or 'params' keys
                message: err.message,
            }));
            next(api_error_1.ApiError.badRequest('Validation failed', formattedErrors));
        }
        else {
            next(error);
        }
    }
};
exports.validate = validate;
