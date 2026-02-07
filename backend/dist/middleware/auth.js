"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
const backend_1 = require("@clerk/backend");
/**
 * Middleware to verify Clerk session token and extract authenticated user ID
 * Expects Authorization header with Bearer token
 */
async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[Auth] No authorization header or invalid format');
            return res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('[Auth] Token received, length:', token.length);
        console.log('[Auth] Secret key exists:', !!process.env.CLERK_SECRET_KEY);
        // Verify the JWT token with Clerk (with clock skew tolerance)
        const payload = await (0, backend_1.verifyToken)(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            clockSkewInMs: 30000, // Allow 30 seconds of clock drift
        });
        console.log('[Auth] Token verified successfully, userId:', payload?.sub);
        if (!payload || !payload.sub) {
            console.log('[Auth] Payload invalid or missing sub claim');
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        // Attach verified user ID to request (sub is the user ID in JWT)
        req.userId = payload.sub;
        next();
    }
    catch (error) {
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
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = await (0, backend_1.verifyToken)(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
                clockSkewInMs: 30000,
            });
            if (payload && payload.sub) {
                req.userId = payload.sub;
            }
        }
        next();
    }
    catch (error) {
        // Continue without auth if verification fails
        next();
    }
}
//# sourceMappingURL=auth.js.map