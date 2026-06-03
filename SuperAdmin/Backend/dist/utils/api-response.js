"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = ({ res, statusCode = 200, message = 'Success', data, meta, }) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
};
exports.sendResponse = sendResponse;
