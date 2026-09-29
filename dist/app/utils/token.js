"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtils = void 0;
const jwt_1 = require("./jwt");
const env_1 = require("../../config/env");
const cookie_1 = require("./cookie");
const ms_1 = __importDefault(require("ms"));
const getAccessToken = (payload) => {
    const accessToken = jwt_1.jwtUtils.createToken(payload, env_1.envVars.ACCESS_TOKEN_SECRET, { expiresIn: env_1.envVars.ACCESS_TOKEN_EXPIRES_IN });
    return accessToken;
};
const getRefreshToken = (payload) => {
    const refreshToken = jwt_1.jwtUtils.createToken(payload, env_1.envVars.REFRESH_TOKEN_SECRET, { expiresIn: env_1.envVars.REFRESH_TOKEN_EXPIRES_IN });
    return refreshToken;
};
const setAccessTokenCookie = (res, token) => {
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
    cookie_1.cookieUtils.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: (0, ms_1.default)("1d"), // 1 day
    });
    console.log(token, "set cookie");
};
const setRefreshTokenCookie = (res, token) => {
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
    cookie_1.cookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: (0, ms_1.default)("7d"), // 7 days
    });
};
const setBatterAuthSessionCookie = (res, token) => {
    // const maxAge = ms(Number(envVars.ACCESS_TOKEN_EXPIRES_IN))
    cookie_1.cookieUtils.setCookie(res, "betterAuthSession", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24
    });
};
exports.tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setBatterAuthSessionCookie,
    setRefreshTokenCookie
};
//# sourceMappingURL=token.js.map