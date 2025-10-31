/**
 * FRONTEND SECURITY UTILITIES
 * 
 * Comprehensive security functions for React application
 */

import DOMPurify from 'dompurify';

// ==================== INPUT SANITIZATION ====================

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (dirty) => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
    });
};

/**
 * Sanitize user input (remove script tags and dangerous characters)
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

/**
 * Sanitize all form data
 */
export const sanitizeFormData = (formData) => {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

// ==================== INPUT VALIDATION ====================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());
    
    return {
        valid: isValid,
        error: isValid ? null : 'Invalid email format',
        sanitized: email.trim().toLowerCase()
    };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one special character' };
    }
    
    return { valid: true, error: null };
};

/**
 * Validate name (no special characters or numbers)
 */
export const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: 'Name is required' };
    }
    
    const trimmed = name.trim();
    
    if (trimmed.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (trimmed.length > 50) {
        return { valid: false, error: 'Name must not exceed 50 characters' };
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { valid: true, error: null, sanitized: trimmed };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { valid: false, error: 'Phone number is required' };
    }
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 8 || cleaned.length > 15) {
        return { valid: false, error: 'Invalid phone number' };
    }
    
    return { valid: true, error: null, sanitized: cleaned };
};

/**
 * Validate postal code (Singapore format)
 */
export const validatePostalCode = (code) => {
    if (!code || typeof code !== 'string') {
        return { valid: false, error: 'Postal code is required' };
    }
    
    const cleaned = code.replace(/\s/g, '');
    
    if (!/^\d{6}$/.test(cleaned)) {
        return { valid: false, error: 'Postal code must be 6 digits' };
    }
    
    return { valid: true, error: null, sanitized: cleaned };
};

/**
 * Validate credit card number (basic Luhn algorithm)
 */
export const validateCreditCard = (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== 'string') {
        return { valid: false, error: 'Card number is required' };
    }
    
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleaned)) {
        return { valid: false, error: 'Invalid card number format' };
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    const isValid = sum % 10 === 0;
    
    return {
        valid: isValid,
        error: isValid ? null : 'Invalid card number',
        sanitized: cleaned
    };
};

/**
 * Validate quantity (positive integer)
 */
export const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    
    if (isNaN(num) || num < 1) {
        return { valid: false, error: 'Quantity must be at least 1' };
    }
    
    if (num > 999) {
        return { valid: false, error: 'Quantity cannot exceed 999' };
    }
    
    return { valid: true, error: null, sanitized: num };
};

/**
 * Validate price (positive number)
 */
export const validatePrice = (price) => {
    const num = parseFloat(price);
    
    if (isNaN(num) || num <= 0) {
        return { valid: false, error: 'Price must be greater than 0' };
    }
    
    if (num > 1000000) {
        return { valid: false, error: 'Price too high' };
    }
    
    return { valid: true, error: null, sanitized: num };
};

// ==================== TOKEN MANAGEMENT ====================

/**
 * Safely get token from localStorage
 */
export const getToken = (tokenKey = 'token') => {
    try {
        const token = localStorage.getItem(tokenKey);
        
        if (!token) return null;
        
        // Basic JWT validation
        if (token.split('.').length !== 3) {
            console.warn('Invalid token format');
            removeToken(tokenKey);
            return null;
        }
        
        // Check if token is expired
        if (isTokenExpired(token)) {
            console.warn('Token expired');
            removeToken(tokenKey);
            return null;
        }
        
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

/**
 * Safely set token in localStorage
 */
export const setToken = (token, tokenKey = 'token') => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token');
        }
        
        localStorage.setItem(tokenKey, token);
        return true;
    } catch (error) {
        console.error('Error setting token:', error);
        return false;
    }
};

/**
 * Remove token from localStorage
 */
export const removeToken = (tokenKey = 'token') => {
    try {
        localStorage.removeItem(tokenKey);
        return true;
    } catch (error) {
        console.error('Error removing token:', error);
        return false;
    }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        
        return Date.now() >= expiry;
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return true; // Assume expired on error
    }
};

/**
 * Decode JWT token payload
 */
export const decodeToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// ==================== SECURE STORAGE ====================

/**
 * Encrypt sensitive data before storing (basic XOR encryption)
 * Note: For production, use a proper encryption library
 */
export const encryptData = (data, key = 'default-key') => {
    try {
        const jsonString = JSON.stringify(data);
        let encrypted = '';
        
        for (let i = 0; i < jsonString.length; i++) {
            encrypted += String.fromCharCode(
                jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        return btoa(encrypted);
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

/**
 * Decrypt stored data
 */
export const decryptData = (encryptedData, key = 'default-key') => {
    try {
        const encrypted = atob(encryptedData);
        let decrypted = '';
        
        for (let i = 0; i < encrypted.length; i++) {
            decrypted += String.fromCharCode(
                encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

/**
 * Securely store sensitive data
 */
export const secureStore = (key, data) => {
    try {
        const encrypted = encryptData(data);
        if (encrypted) {
            sessionStorage.setItem(key, encrypted);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Secure store error:', error);
        return false;
    }
};

/**
 * Retrieve securely stored data
 */
export const secureRetrieve = (key) => {
    try {
        const encrypted = sessionStorage.getItem(key);
        if (!encrypted) return null;
        
        return decryptData(encrypted);
    } catch (error) {
        console.error('Secure retrieve error:', error);
        return null;
    }
};

// ==================== CSRF PROTECTION ====================

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Get or create CSRF token
 */
export const getCSRFToken = () => {
    let token = sessionStorage.getItem('csrf-token');
    
    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem('csrf-token', token);
    }
    
    return token;
};

// ==================== RATE LIMITING (CLIENT-SIDE) ====================

const rateLimitMap = new Map();

/**
 * Client-side rate limiting
 */
export const rateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
    const now = Date.now();
    const record = rateLimitMap.get(key) || { attempts: [], blockedUntil: 0 };
    
    // Check if currently blocked
    if (record.blockedUntil > now) {
        const remainingTime = Math.ceil((record.blockedUntil - now) / 1000);
        return {
            allowed: false,
            error: `Too many attempts. Please try again in ${remainingTime} seconds.`,
            remainingTime
        };
    }
    
    // Remove old attempts outside the window
    record.attempts = record.attempts.filter(time => time > now - windowMs);
    
    // Check if limit exceeded
    if (record.attempts.length >= maxAttempts) {
        record.blockedUntil = now + windowMs;
        rateLimitMap.set(key, record);
        
        return {
            allowed: false,
            error: `Too many attempts. Please try again in ${Math.ceil(windowMs / 1000)} seconds.`,
            remainingTime: Math.ceil(windowMs / 1000)
        };
    }
    
    // Add new attempt
    record.attempts.push(now);
    rateLimitMap.set(key, record);
    
    return {
        allowed: true,
        remaining: maxAttempts - record.attempts.length
    };
};

/**
 * Clear rate limit for a key
 */
export const clearRateLimit = (key) => {
    rateLimitMap.delete(key);
};

// ==================== SECURE NAVIGATION ====================

/**
 * Safely redirect to URL
 */
export const safeRedirect = (url, navigate) => {
    // Only allow relative URLs or same origin
    try {
        const parsedUrl = new URL(url, window.location.origin);
        
        if (parsedUrl.origin === window.location.origin) {
            navigate(parsedUrl.pathname + parsedUrl.search + parsedUrl.hash);
        } else {
            console.warn('Attempted redirect to external URL blocked:', url);
        }
    } catch (error) {
        console.error('Invalid redirect URL:', error);
    }
};

// ==================== CONTENT SECURITY ====================

/**
 * Escape HTML to prevent XSS
 */
export const escapeHTML = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, allowedTypes = [], maxSizeMB = 5) => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, error: `File size must not exceed ${maxSizeMB}MB` };
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }
    
    // Check for double extensions (potential attack)
    const fileName = file.name;
    const extensions = fileName.split('.').slice(1);
    if (extensions.length > 1) {
        return { valid: false, error: 'Files with multiple extensions are not allowed' };
    }
    
    return { valid: true, error: null };
};

// ==================== ERROR HANDLING ====================

/**
 * Safely display error messages (prevent information leakage)
 */
export const getSafeErrorMessage = (error) => {
    // Don't expose sensitive error details to users
    const safeMessages = {
        'Network Error': 'Unable to connect to server. Please check your internet connection.',
        'Request failed with status code 401': 'Session expired. Please log in again.',
        'Request failed with status code 403': 'Access denied.',
        'Request failed with status code 404': 'Resource not found.',
        'Request failed with status code 500': 'Server error. Please try again later.'
    };
    
    const errorMessage = error?.message || error?.toString() || 'An error occurred';
    
    return safeMessages[errorMessage] || 'An error occurred. Please try again.';
};

// ==================== EXPORT ALL ====================

export default {
    sanitizeHTML,
    sanitizeInput,
    sanitizeFormData,
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    validatePostalCode,
    validateCreditCard,
    validateQuantity,
    validatePrice,
    getToken,
    setToken,
    removeToken,
    isTokenExpired,
    decodeToken,
    encryptData,
    decryptData,
    secureStore,
    secureRetrieve,
    generateCSRFToken,
    getCSRFToken,
    rateLimit,
    clearRateLimit,
    safeRedirect,
    escapeHTML,
    validateFileUpload,
    getSafeErrorMessage
};
