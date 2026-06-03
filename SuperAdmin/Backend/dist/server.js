"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const server = app_1.default.listen(env_1.env.PORT, () => {
    console.log(`🚀 Server running in ${env_1.env.NODE_ENV} mode on http://localhost:${env_1.env.PORT}`);
    console.log(`📖 API docs available at http://localhost:${env_1.env.PORT}/api-docs`);
});
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await database_1.prisma.$disconnect();
            console.log('Prisma database client disconnected.');
            process.exit(0);
        }
        catch (err) {
            console.error('Error disconnecting Prisma client:', err);
            process.exit(1);
        }
    });
    // Timeout shutdown safety fallback
    setTimeout(() => {
        console.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
