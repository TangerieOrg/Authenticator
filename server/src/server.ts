import express from "express";
import cors from "cors";
import CookieMiddleware from "cookie-parser";
import { RedisMiddleware } from "./middleware/Redis";
import { NoCacheMiddleware } from "./middleware/NoCache";
import { LoggingMiddleware } from "./middleware/Logging";
import routes from "./routes";
import { ErrorMiddleware } from "./middleware/Error";
import { UserCookiesMiddleware } from "./UserTracking";

const server = express();

server.set('trust proxy', true)

server.options('*', cors());

server.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    CookieMiddleware(process.env.COOKIE_SECRET || "cookie_secret"),
    UserCookiesMiddleware,
    NoCacheMiddleware,
    LoggingMiddleware,
    RedisMiddleware
);

server.use('/', routes);

server.use(
    ErrorMiddleware
)

export default server;