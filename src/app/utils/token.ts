import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { cookieUtils } from "./cookie";
import ms, { StringValue } from "ms";
import {Response} from 'express'


const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions)
    return accessToken
}
const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions)
    return refreshToken
}

const setAccessTokenCookie = (res: Response, token: string) => {
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
    cookieUtils.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: ms("1d"), // 1 day
    })
        console.log(token, "set cookie")
}

const setRefreshTokenCookie =  (res: Response, token: string) => {
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
    cookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: ms("7d"), // 7 days
    })

}

const setBatterAuthSessionCookie = (res: Response, token: string) => {
    // const maxAge = ms(Number(envVars.ACCESS_TOKEN_EXPIRES_IN))
    cookieUtils.setCookie(res, "betterAuthSession", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000*60*60*24
    })
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setBatterAuthSessionCookie,
    setRefreshTokenCookie
}