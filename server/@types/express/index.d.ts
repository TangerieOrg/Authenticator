declare namespace Express {
    export interface Request {
        user? : import("UserTracking").UserCookieState;
        redis : import("middleware/Redis").RedisClient;
    }
}