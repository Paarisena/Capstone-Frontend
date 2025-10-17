/**
 * 🔧 Express Compatibility Fixes
 * Handles compatibility issues between different Express versions and middleware
 */

/**
 * Express 5.x Compatibility Check
 * Prevents the express-mongo-sanitize error with read-only query property
 */
export const checkExpressCompatibility = () => {
    const expressVersion = process.env.npm_package_dependencies_express || '4.x';
    
    if (expressVersion.startsWith('^5') || expressVersion.startsWith('5')) {
        console.warn('⚠️  Express 5.x detected - Using compatibility mode for middleware');
        
        // Flag for middleware compatibility mode
        process.env.EXPRESS_V5_MODE = 'true';
    }
};

/**
 * Mongo Sanitize Compatibility Wrapper
 * Provides alternative sanitization for Express 5.x
 */
export const compatibleMongoSanitize = (options = {}) => {
    const expressVersion = process.env.EXPRESS_V5_MODE;
    
    if (expressVersion === 'true') {
        // Alternative sanitization for Express 5.x
        return (req, res, next) => {
            try {
                // Sanitize body
                if (req.body) {
                    req.body = sanitizeObject(req.body);
                }
                
                // Sanitize params
                if (req.params) {
                    req.params = sanitizeObject(req.params);
                }
                
                // For Express 5.x, create a new query object instead of modifying
                if (req.query) {
                    const sanitizedQuery = sanitizeObject(req.query);
                    // Use Object.defineProperty to replace the getter
                    Object.defineProperty(req, 'query', {
                        value: sanitizedQuery,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                
                next();
            } catch (error) {
                console.error('Sanitization error:', error);
                next();
            }
        };
    } else {
        // Use standard express-mongo-sanitize for Express 4.x
        const mongoSanitize = require('express-mongo-sanitize');
        return mongoSanitize(options);
    }
};

/**
 * Sanitize object recursively
 */
const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Remove keys that contain MongoDB operators
            if (typeof key === 'string' && key.startsWith('$')) {
                continue;
            }
            
            // Recursively sanitize nested objects
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitized[key] = sanitizeObject(obj[key]);
            } else {
                sanitized[key] = obj[key];
            }
        }
    }
    
    return sanitized;
};

/**
 * Rate Limiter Compatibility Check
 */
export const compatibleRateLimit = (options) => {
    const rateLimit = require('express-rate-limit');
    
    // Ensure options are compatible with both Express versions
    return rateLimit({
        ...options,
        // Add Express 5.x specific options if needed
        standardHeaders: true,
        legacyHeaders: false,
    });
};

/**
 * Check and log compatibility status
 */
export const logCompatibilityStatus = () => {
    const express = require('express');
    const expressVersion = express.version || '4.x';
    
    console.log(`🔧 Express Version: ${expressVersion}`);
    
    if (expressVersion.startsWith('5')) {
        console.log('✅ Express 5.x compatibility mode active');
        console.log('🛡️ Using alternative mongo sanitization');
    } else {
        console.log('✅ Express 4.x standard mode');
        console.log('🛡️ Using standard express-mongo-sanitize');
    }
};