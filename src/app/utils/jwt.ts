import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (
  payload: JwtPayload,
  secret: string,
  options: SignOptions
) => {
  if (!options.expiresIn) {
    throw new Error("expiresIn is required");
  }

  return jwt.sign(payload, secret, {
    expiresIn: options.expiresIn
  });
};
const verifyToken = (token: string, secret: string) => {
    try {
        const decode = jwt.verify(token, secret) as JwtPayload;
        return {
            success: true,
            data: decode
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            error
        }
    }
 }
const decodeToken = (token: string) => {
    const decode = jwt.decode(token) as JwtPayload;
    return decode
}

export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken
}