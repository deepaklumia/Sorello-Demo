"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function bootstrap() {
    try {
        await database_1.prisma.$connect();
        console.log('🔌 Connected to PostgreSQL via Prisma Client');
        const port = env_1.env.PORT;
        app_1.default.listen(port, () => {
            console.log(`🚀 Restaurant Admin Server listening on http://localhost:${port}`);
            console.log(`📄 Swagger documentation served at http://localhost:${port}/api-docs`);
        });
    }
    catch (error) {
        console.error('❌ Failed to bootstrap Restaurant Admin Server:', error);
        process.exit(1);
    }
}
bootstrap();
