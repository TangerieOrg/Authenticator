import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";
import { RedisClient } from "middleware/Redis";

export const USER_COOKIE_KEY = 'userid';

export interface UserCookieState {
    UserId : string;
}

export const UserCookiesMiddleware = async (req : Request, res : Response, next : NextFunction) => {
    const UserId : string | undefined = req.signedCookies[USER_COOKIE_KEY];

    if(UserId) req.user = { UserId };

    next();
}

export const createUserId = () => randomBytes(20).toString("hex");

export const setUserIDCookie = (userId : string, res : Response) => {
    res.cookie(USER_COOKIE_KEY, userId, {
        signed: true,
        expires: new Date(9999, 1),
        sameSite: 'none',
        path: '/'
    });
}

export const removeUserIDCookie = (res : Response) => {
    res.clearCookie(USER_COOKIE_KEY, {
        signed: true,
        sameSite: 'none',
        path: '/'
    })
}

export interface DBUser {
    UserId : string; // The cookie assigned to the user
    GithubId : number; // The ID return by github
    access_token : string;
}

export const createDBUser = async (user : DBUser, redis : RedisClient) => {
    return await redis.json.set(user.UserId, "$", user as any);
}

export const getDBUser = async (userId : string, redis : RedisClient) => {
    return (await redis.json.get(userId, {
        path: "$"
    }) as any as [DBUser])[0]
}

export const findDBUserByGithubId = async (GithubId : number, redis : RedisClient) => {
    const userIds = await redis.keys("*");
    for(const userId of userIds) {
        const user = await getDBUser(userId, redis);
        if(user.GithubId === GithubId) return user; 
    }
}

export const getOrCreateUser = async (GithubId : number, access_token : string, redis : RedisClient) => {
    const existing = await findDBUserByGithubId(GithubId, redis);
    if(existing) {
        await redis.json.set(existing.UserId, "$.access_token", access_token);
        return existing;
    }
    
    const UserId = createUserId();
    const user : DBUser = { GithubId, UserId, access_token }
    await createDBUser(user, redis);
    return user;
}