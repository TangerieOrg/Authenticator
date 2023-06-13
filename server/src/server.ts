import express from "express";
import cors from "cors";
import CookieMiddleware from "cookie-parser";
import { getUserIDCookie } from "./cookies";
import routes from "./routes";

const server = express();

server.set('trust proxy', true)

server.options('*', cors());

server.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    CookieMiddleware(process.env.COOKIE_SECRET || "cookie_secret"),
);

server.use((req, res, next) => {
    // No Cache
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Expires", "0");

    // Logging
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(`[${ip}] ${req.url} (${JSON.stringify(req.body)})`);

    req.userid = getUserIDCookie(req);

    next();
})

server.use('/', routes);

// @ts-ignore
server.use((err, req, res, next) => {
    if(!res.headersSent) {
        console.log(`[ERR] '${err.message}'`);
        res.status(400);
        res.json({ error: err.message });
    }
})

export default server;