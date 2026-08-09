"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUpstreamError = throwUpstreamError;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function createErrorPayload(data, status, serviceName) {
    if (isRecord(data)) {
        return {
            ...data,
            statusCode: typeof data.statusCode === 'number' ? data.statusCode : status,
            message: data.message ?? `${serviceName} không thể xử lý yêu cầu`,
        };
    }
    if (typeof data === 'string' && data.trim()) {
        return {
            statusCode: status,
            message: data,
        };
    }
    return {
        statusCode: status,
        message: `${serviceName} không thể xử lý yêu cầu`,
    };
}
function throwUpstreamError(error, serviceName, logger) {
    if ((0, axios_1.isAxiosError)(error) && error.response) {
        const { data, status } = error.response;
        throw new common_1.HttpException(createErrorPayload(data, status, serviceName), status);
    }
    const detail = error instanceof Error ? error.message : String(error);
    logger.warn(`Không kết nối được ${serviceName}: ${detail}`);
    throw new common_1.BadGatewayException(`${serviceName} hiện không khả dụng`);
}
//# sourceMappingURL=upstream-error.js.map