"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, options) => {
    if (!options.expiresIn) {
        throw new Error("expiresIn is required");
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: options.expiresIn
    });
};
const verifyToken = (token, secret) => {
    try {
        const decode = jsonwebtoken_1.default.verify(token, secret);
        return {
            success: true,
            data: decode
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
            error
        };
    }
};
const decodeToken = (token) => {
    const decode = jsonwebtoken_1.default.decode(token);
    return decode;
};
exports.jwtUtils = {
    createToken,
    verifyToken,
    decodeToken
};
//# sourceMappingURL=jwt.js.map