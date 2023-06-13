import express from "express";
import CookieMiddleware from "cookie-parser";
import AuthenticatorMiddleware from "../lib";

const server = express();

server.use(
    CookieMiddleware(process.env.COOKIE_SECRET || "cookie_secret"),
    AuthenticatorMiddleware()
);

// @ts-ignore
server.get("/", (req, res) => { res.json({ user: req.userid })})

const port = process.env.EXPRESS_PORT ?? 80;

server.listen(port, () => {
    console.log("Listening on port", port);
});