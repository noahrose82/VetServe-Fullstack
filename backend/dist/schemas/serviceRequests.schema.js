"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRequestUpdateSchema = exports.serviceRequestCreateSchema = void 0;
const zod_1 = require("zod");
exports.serviceRequestCreateSchema = zod_1.z.object({
    veteranId: zod_1.z.number().int().positive(),
    category: zod_1.z.string().min(3).max(60),
    description: zod_1.z.string().min(10).max(500),
    status: zod_1.z.enum(['Open', 'In Progress', 'Closed']).optional()
});
exports.serviceRequestUpdateSchema = exports.serviceRequestCreateSchema.partial();
