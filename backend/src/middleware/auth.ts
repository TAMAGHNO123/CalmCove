import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

// Extend Express Request to include userId
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
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[Auth] No authorization header or invalid format');
            return res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('[Auth] Token received, length:', token.length);
        console.log('[Auth] Secret key exists:', !!process.env.CLERK_SECRET_KEY);

        // Verify the JWT token with Clerk (secretKey is sufficient)
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        console.log('[Auth] Token verified successfully, userId:', payload?.sub);

        if (!payload || !payload.sub) {
            console.log('[Auth] Payload invalid or missing sub claim');
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        // Attach verified user ID to request (sub is the user ID in JWT)
        req.userId = payload.sub;
        next();
    } catch (error) {
        console.error('[Auth] Token verification error:', error);
        if (error instanceof Error) {
            console.error('[Auth] Error message:', error.message);
            console.error('[Auth] Error stack:', error.stack);
        }
        return res.status(401).json({ error: 'Unauthorized - Token verification failed' });
    }
}

/**
 * Optional auth middleware - continues even if no valid token
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });

            if (payload && payload.sub) {
                req.userId = payload.sub;
            }
        }

        next();
    } catch (error) {
        // Continue without auth if verification fails
        next();
    }
}
