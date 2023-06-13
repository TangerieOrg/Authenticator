import { randomBytes } from "crypto";
import { RedisClient } from "./middleware/Redis";

export const createUserId = () => randomBytes(20).toString("hex");

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