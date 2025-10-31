/**
 * SECURE API UTILITIES
 * 
 * Enhanced API request functions with security features
 */

import { 
    sanitizeInput, 
    sanitizeFormData,
    validateEmail,
    validatePassword,
    validateName,
    getToken,
    setToken,
    removeToken,
    getSafeErrorMessage,
    getCSRFToken,
    rateLimit
} from './security';

const beUrl = import.meta.env.VITE_BE_URL;

/**
 * Secure fetch wrapper with automatic error handling
 */
const secureFetch = async (url, options = {}) => {
    try {
        // Add CSRF token to headers
        const headers = {
            ...options.headers,
            'X-CSRF-Token': getCSRFToken()
        };
        
        // Add credentials
        const secureOptions = {
            ...options,
            headers,
            credentials: 'include'
        };
        
        const response = await fetch(url, secureOptions);
        
        // Handle 401 (unauthorized) - clear tokens and redirect
        if (response.status === 401) {
            removeToken('Usertoken');
            removeToken('admintoken');
            removeToken('userID');
            throw new Error('Session expired. Please log in again.');
        }
        
        return response;
    } catch (error) {
        console.error('Secure fetch error:', error);
        throw error;
    }
};

/**
 * Secure user registration with validation and rate limiting
 */
export const secureUserRegister = async (data) => {
    // Client-side rate limiting
    const rateLimitCheck = rateLimit('register', 3, 300000); // 3 attempts per 5 minutes
    if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.error);
    }
    
    // Validate input
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) {
        throw new Error(nameValidation.error);
    }
    
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
    }
    
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
    }
    
    if (data.password !== data.confirmpassword) {
        throw new Error('Passwords do not match');
    }
    
    // Sanitize data
    const sanitizedData = {
        name: nameValidation.sanitized,
        email: emailValidation.sanitized,
        password: data.password, // Don't sanitize password
        confirmpassword: data.confirmpassword
    };
    
    try {
        const response = await secureFetch(`${beUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitizedData)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
        }
        
        return responseData;
    } catch (error) {
        throw new Error(getSafeErrorMessage(error));
    }
};

/**
 * Secure user login with validation and rate limiting
 */
export const secureUserLogin = async (data) => {
    // Client-side rate limiting
    const rateLimitCheck = rateLimit('login', 5, 900000); // 5 attempts per 15 minutes
    if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.error);
    }
    
    // Validate input
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
    }
    
    if (!data.password || data.password.length < 1) {
        throw new Error('Password is required');
    }
    
    // Sanitize email
    const sanitizedData = {
        email: emailValidation.sanitized,
        password: data.password
    };
    
    try {
        const response = await secureFetch(`${beUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitizedData)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            if (responseData.requiresVerification) {
                return {
                    requiresVerification: true,
                    message: responseData.message,
                    email: sanitizedData.email
                };
            }
            throw new Error(responseData.message || 'Login failed');
        }
        
        // Safely store token
        if (responseData.token) {
            setToken(responseData.token, 'Usertoken');
        }
        
        if (responseData.userID) {
            localStorage.setItem('userID', responseData.userID);
        }
        
        return responseData;
    } catch (error) {
        throw new Error(getSafeErrorMessage(error));
    }
};

/**
 * Secure admin login
 */
export const secureAdminLogin = async (data) => {
    // Client-side rate limiting
    const rateLimitCheck = rateLimit('admin-login', 3, 900000); // 3 attempts per 15 minutes
    if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.error);
    }
    
    // Validate input
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
    }
    
    if (!data.password || data.password.length < 1) {
        throw new Error('Password is required');
    }
    
    // Sanitize email
    const sanitizedData = {
        email: emailValidation.sanitized,
        password: data.password
    };
    
    try {
        const response = await secureFetch(`${beUrl}/api/AdminLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitizedData)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            if (responseData.requiresVerification) {
                return {
                    requiresVerification: true,
                    message: responseData.message,
                    email: sanitizedData.email
                };
            }
            throw new Error(responseData.message || 'Login failed');
        }
        
        // Safely store token
        if (responseData.token) {
            setToken(responseData.token, 'admintoken');
        }
        
        if (responseData.adminID) {
            localStorage.setItem('userID', responseData.adminID);
        }
        
        return responseData;
    } catch (error) {
        throw new Error(getSafeErrorMessage(error));
    }
};

/**
 * Secure logout
 */
export const secureLogout = (isAdmin = false) => {
    try {
        if (isAdmin) {
            removeToken('admintoken');
        } else {
            removeToken('Usertoken');
        }
        
        localStorage.removeItem('userID');
        sessionStorage.clear();
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

/**
 * Get authenticated request headers
 */
export const getAuthHeaders = (isAdmin = false) => {
    const tokenKey = isAdmin ? 'admintoken' : 'Usertoken';
    const token = getToken(tokenKey);
    
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-CSRF-Token': getCSRFToken()
    };
};

/**
 * Make authenticated API request
 */
export const authenticatedRequest = async (url, options = {}, isAdmin = false) => {
    const headers = {
        ...getAuthHeaders(isAdmin),
        ...options.headers
    };
    
    try {
        const response = await secureFetch(url, {
            ...options,
            headers
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || `Request failed with status ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        throw new Error(getSafeErrorMessage(error));
    }
};

/**
 * Validate and sanitize form submission
 */
export const validateFormSubmission = (formData, validationRules) => {
    const errors = {};
    const sanitized = {};
    
    for (const [field, value] of Object.entries(formData)) {
        const rule = validationRules[field];
        
        if (rule) {
            const result = rule(value);
            
            if (!result.valid) {
                errors[field] = result.error;
            } else {
                sanitized[field] = result.sanitized || value;
            }
        } else {
            // If no validation rule, just sanitize
            sanitized[field] = typeof value === 'string' ? sanitizeInput(value) : value;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitized
    };
};

export default {
    secureFetch,
    secureUserRegister,
    secureUserLogin,
    secureAdminLogin,
    secureLogout,
    getAuthHeaders,
    authenticatedRequest,
    validateFormSubmission
};
