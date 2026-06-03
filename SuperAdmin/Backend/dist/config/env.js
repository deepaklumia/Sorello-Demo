"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5001),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().url({ message: 'DATABASE_URL must be a valid connection string' }),
    JWT_SECRET: zod_1.z.string().min(8, { message: 'JWT_SECRET must be at least 8 characters long' }),
    JWT_EXPIRES_IN: zod_1.z.string().default('24h'),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
}
exports.env = result.data;
