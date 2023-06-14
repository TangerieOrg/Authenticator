import { getOAuthURL, getUserDetails, requestAccessToken } from "./OAuth";
import { getDBUser, getOrCreateUser } from "./UserTracking";
import express from "express";
import asyncHandler from "express-async-handler"

const routes = express.Router();

routes.use((req, res, next) => {
    if(req.body.userId) {
        req.user = {
            UserId: req.body.userId
        }
    }
    req.body = req.body.payload ?? {};
    next();
})

routes.get('/url', (req, res) => {
    res.json({
        url: getOAuthURL(req.body ?? {})
    });
});

// Request an access token, generate userID, save to database
routes.get('/authenticate', asyncHandler(async (req, res) => {
    const code = req.body.code as string;
    if(!code) throw new Error("Code required");

    const access_token = await requestAccessToken(code);

    if(!access_token) throw new Error("Code invalid");

    const githubUser = await getUserDetails(access_token);

    const { UserId } = await getOrCreateUser(githubUser.id, access_token, req.redis);

    res.json({ UserId });
}));

routes.get('/valid', asyncHandler(async (req, res) => {
    if(!req.user) throw new Error("No UserID");

    const dbUser = await getDBUser(req.user.UserId, req.redis).catch(() => {
        throw new Error("User not in database");
    });

    res.json({
        valid: true,
        GithubId: dbUser.GithubId

    })
}));

routes.get('/user', asyncHandler(async (req, res) => {
    if(!req.user) throw new Error("No UserID");

    const dbUser = await getDBUser(req.user.UserId, req.redis).catch(() => {
        throw new Error("User not in database");
    });


    const user = await getUserDetails(dbUser.access_token).catch(() => {
        throw new Error("Access Token Expired");
    });

    res.json(user);
}));

export default routes;