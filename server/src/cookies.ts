import { Request, Response } from "express";
export const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY ?? 'userid';

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

export const getUserIDCookie = (req : Request) => {
    return req.signedCookies[USER_COOKIE_KEY] as string | undefined;
}