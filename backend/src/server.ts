import express from "express";
import cors from "cors";
import { RedisMiddleware } from "./middleware/Redis";
import { NoCacheMiddleware } from "./middleware/NoCache";
import { LoggingMiddleware } from "./middleware/Logging";
import routes from "./routes";
import { ErrorMiddleware } from "./middleware/Error";

const server = express();

server.set('trust proxy', true)

server.options('*', cors());

server.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    NoCacheMiddleware,
    LoggingMiddleware,
    RedisMiddleware
);

server.use('/', routes);

server.use(
    ErrorMiddleware
)

export default server;