import express from "express";
import asyncHandler from "express-async-handler"
import * as Authenticator from "@tangerie/authenticator-api";
import { composeRedirectURL, decodeState } from "./util";
import { removeUserIDCookie, setUserIDCookie } from "./cookies";

Authenticator.configure({
    url: process.env.AUTHENTICATOR_URL
})

const routes = express.Router();

routes.get('/login', asyncHandler(async (req, res) => {
    const redirect = req.query.redirect as string; 
    if(!redirect || redirect.length === 0) throw new Error("No redirect URL provided");
    const url = await Authenticator.getAuthURL({ redirect });
    res.redirect(url);
}));

routes.get('/logout', (req, res) => {
    const redirect = req.query.redirect as string; 
    if(!redirect || redirect.length === 0) throw new Error("No redirect URL provided");
    if(!req.userid) throw new Error("Not Logged In");
    removeUserIDCookie(res);
    res.redirect(redirect);
})

routes.get('/callback', asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    if(!code) throw new Error("Invalid Request");

    const state = decodeState(req.query.state as string);
    if(!state) throw new Error("No state provided");

    const userId = await Authenticator.requestUserID(code)
    
    setUserIDCookie(userId, res);

    const redirectURL = composeRedirectURL(state.redirect, state.data);

    res.redirect(redirectURL);
}));

routes.get('/check', asyncHandler(async (req, res) => {
    await Authenticator.getGithubUser(req.userid ?? "")
    .then(() => {
        res.json({ success: true });
    })
    .catch(() => {
        res.json({ success: false })
    });
}))

export default routes;