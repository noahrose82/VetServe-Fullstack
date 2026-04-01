"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.issues.map(i => ({
                path: i.path.join('.'),
                message: i.message
            }))
        });
    }
    req.body = parsed.data;
    next();
};
exports.validateBody = validateBody;
