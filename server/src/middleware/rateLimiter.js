// middleware/rateLimiter.js - Simplified
import rateLimit from "express-rate-limit";

const createLimiter = (windowMs, max, message, skipSuccess = false) => rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: skipSuccess,
});

export const apiLimiter = createLimiter(15 * 60 * 1000, 100, "Too many requests");
export const authLimiter = createLimiter(15 * 60 * 1000, 5, "Too many login attempts", true);
export const expensiveOperationLimiter = createLimiter(60 * 1000, 10, "Slow down");
export const createEventLimiter = createLimiter(60 * 60 * 1000, 10, "Too many events");
