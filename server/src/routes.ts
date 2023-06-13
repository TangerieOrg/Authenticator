import { composeRedirectURL, decodeState, getOAuthURL, getUserDetails, requestAccessToken } from "OAuth";
import { getDBUser, getOrCreateUser, removeUserIDCookie, setUserIDCookie } from "UserTracking";
import express from "express";
import asyncHandler from "express-async-handler"

const routes = express.Router();

routes.get('/url', (req, res) => {
    const { redirect, ...data } = req.query;

    if(!redirect || redirect.length === 0) throw new Error("No redirect URL provided");

    res.json({
        url: getOAuthURL({
            redirect,
            data: data ?? {}
        })
    });
});

routes.get('/callback', asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    if(!code) throw new Error("Invalid Request");


    const state = decodeState(req.query.state as string);
    if(!state) throw new Error("No state provided");

    const redirectURL = composeRedirectURL(state.redirect, state.data);

    const access_token = await requestAccessToken(code);

    if(!access_token) {
        // Redirect if auth fails
        res.redirect(redirectURL);
        throw new Error("Authentication Request Failed");
    }

    const githubUser = await getUserDetails(access_token);

    // Create or get user
    // Update database
    const user = await getOrCreateUser(githubUser.id, access_token, req.redis);
    // Set cookie
    setUserIDCookie(user.UserId, res);

    // Redirect
    res.redirect(redirectURL);
}));

routes.get('/user', asyncHandler(async (req, res) => {
    if(!req.user) throw new Error("No UserID");

    const dbUser = await getDBUser(req.user.UserId, req.redis).catch(() => {
        removeUserIDCookie(res);
        throw new Error("User not in database");
    });


    const user = await getUserDetails(dbUser.access_token).catch(() => {
        removeUserIDCookie(res);
        throw new Error("Access Token Expired");
    });

    res.json(user);
}));

routes.get("/logout", (req, res) => {
    if(!req.user) throw new Error("Not Logged In");

    removeUserIDCookie(res);
    res.json({
        message: "Logged Out"
    })
})

export default routes;