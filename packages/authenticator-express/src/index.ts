import { NextFunction, Request, Response } from "express";

export interface AuthenticatorMiddlewareConfig {
    cookieKey : string;
}

export default function AuthenticatorMiddleware(cfg : Partial<AuthenticatorMiddlewareConfig> = {}) {
    const config : AuthenticatorMiddlewareConfig = {
        cookieKey: "userid",
        ...cfg
    }
    return (req : Request, res : Response, next : NextFunction) => {
        req.userid = req.signedCookies[config.cookieKey];
        next();
    }
}