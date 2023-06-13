declare namespace Express {
    export interface Request {
        user? : import("../../src/UserTracking").UserCookieState;
        redis : import("../../src/middleware/Redis").RedisClient;
    }
}