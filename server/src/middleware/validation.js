// middleware/validation.js - Simplified
import xss from "xss";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Unified validation middleware
 */
export const validate = (rules = {}) => {
    return (req, res, next) => {
        const { required = [], email = [], sanitize: sanitizeFields = [], minLength = {} } = rules;

        // Check required
        const missing = required.filter(f => !req.body[f]?.toString().trim());
        if (missing.length) {
            return res.status(400).json({ success: false, message: `Missing: ${missing.join(', ')}` });
        }

        // Validate email
        for (const field of email) {
            if (req.body[field] && !emailRegex.test(req.body[field])) {
                return res.status(400).json({ success: false, message: `Invalid email: ${field}` });
            }
        }

        // Check min length
        for (const [field, min] of Object.entries(minLength)) {
            if (req.body[field] && req.body[field].length < min) {
                return res.status(400).json({ success: false, message: `${field} must be ${min}+ chars` });
            }
        }

        // Sanitize
        sanitizeFields.forEach(f => {
            if (req.body[f]) req.body[f] = xss(req.body[f]);
        });

        next();
    };
};

// Backward compatibility
export const validateRequired = (fields) => validate({ required: fields });
export const validateEmail = validate({ email: ['email'] });
export const validatePassword = validate({ minLength: { password: 6 } });
export const sanitizeInput = (fields) => validate({ sanitize: fields });
