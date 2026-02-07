import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
/**
 * Middleware to verify Clerk session token and extract authenticated user ID
 * Expects Authorization header with Bearer token
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Optional auth middleware - continues even if no valid token
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map