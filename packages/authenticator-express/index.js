"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AuthenticatorMiddleware(cfg = {}) {
    const config = {
        cookieKey: "userid",
        ...cfg
    };
    
    return (req, res, next) => {
        req.userid = req.signedCookies[config.cookieKey];
        next();
    };
}
exports.default = AuthenticatorMiddleware;
