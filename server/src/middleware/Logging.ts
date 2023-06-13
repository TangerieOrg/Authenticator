import { NextFunction, Request, Response } from "express";

export function LoggingMiddleware(req : Request, res : Response, next : NextFunction) {
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(`[${ip}] ${req.url} (${JSON.stringify(req.body)})`);
    next();
}