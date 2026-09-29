"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (zodSchema) => {
    return (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        const parseData = zodSchema.safeParse(req.body);
        if (!parseData.success) {
            next(parseData.error);
        }
        req.body = parseData.data;
        next();
    };
};
exports.validateSchema = validateSchema;
//# sourceMappingURL=validateRequest.js.map