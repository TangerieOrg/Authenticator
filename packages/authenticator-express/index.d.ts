import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        // Inject additional properties on express.Request
        interface Request {
            userid? : string;
        }
    }
}

declare module "express-serve-static-core" {
    interface Request {
        userid?: string;
    }
  }
  

export interface AuthenticatorMiddlewareConfig {
    cookieKey: string;
}
export default function AuthenticatorMiddleware(cfg?: Partial<AuthenticatorMiddlewareConfig>): (req: Request, res: Response, next: NextFunction) => void;
