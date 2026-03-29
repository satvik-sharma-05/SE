// utils/helpers.js - Consolidated utility functions
import mongoose from "mongoose";
import xss from "xss";

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => mongoose.isValidObjectId(id);

/**
 * Sanitize HTML input
 */
export const sanitize = (text) => xss(text);

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Generate random string
 */
export const randomString = (length = 32) => {
    return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Async handler wrapper - eliminates try-catch in routes
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Success response
 */
export const success = (res, data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        ...data,
    });
};

/**
 * Error response
 */
export const error = (res, message = "Error", statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};

/**
 * Cosine similarity for vectors
 */
export const cosineSimilarity = (a, b) => {
    if (!a || !b || a.length !== b.length) return 0;
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (magA * magB) || 0;
};

/**
 * Paginate query results
 */
export const paginate = (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};
