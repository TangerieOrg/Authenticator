import { NextFunction, Request, Response } from "express";

export function NoCacheMiddleware(req : Request, res : Response, next : NextFunction) {
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Expires", "0");

    next();
}