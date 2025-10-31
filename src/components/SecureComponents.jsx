/**
 * SECURE FORM COMPONENT
 * 
 * React component wrapper that provides built-in security features
 */

import React, { useState } from 'react';
import { sanitizeFormData, validateFormSubmission } from '../utils/secureApi';

/**
 * Secure Form Component with built-in validation and sanitization
 */
export const SecureForm = ({ 
    children, 
    onSubmit, 
    validationRules = {},
    className = '',
    ...props 
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate and sanitize
        const validation = validateFormSubmission(data, validationRules);
        
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        setErrors({});
        setIsSubmitting(true);
        
        try {
            await onSubmit(validation.sanitized, e);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form 
            onSubmit={handleSubmit} 
            className={className}
            noValidate
            {...props}
        >
            {typeof children === 'function' 
                ? children({ errors, isSubmitting })
                : children
            }
        </form>
    );
};

/**
 * Secure Input Component with built-in sanitization
 */
export const SecureInput = ({ 
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    validator,
    className = '',
    sanitize = true,
    ...props 
}) => {
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    
    const handleChange = (e) => {
        let inputValue = e.target.value;
        
        // Sanitize input if enabled
        if (sanitize && typeof inputValue === 'string') {
            inputValue = inputValue.trim();
        }
        
        // Update parent
        if (onChange) {
            e.target.value = inputValue;
            onChange(e);
        }
    };
    
    const handleBlur = (e) => {
        setTouched(true);
        
        // Validate on blur if validator provided
        if (validator) {
            const result = validator(e.target.value);
            setError(result.valid ? '' : result.error);
        }
        
        if (onBlur) {
            onBlur(e);
        }
    };
    
    return (
        <div className="secure-input-wrapper">
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${className} ${touched && error ? 'is-invalid' : ''}`}
                {...props}
            />
            {touched && error && (
                <div className="invalid-feedback d-block text-danger small mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};

/**
 * Secure Password Input with strength indicator
 */
export const SecurePasswordInput = ({ 
    name = 'password',
    value,
    onChange,
    showStrength = true,
    className = '',
    ...props 
}) => {
    const [strength, setStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    
    const calculateStrength = (password) => {
        if (!password) return 0;
        
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        return Math.min(score, 5);
    };
    
    const handleChange = (e) => {
        const password = e.target.value;
        setStrength(calculateStrength(password));
        
        if (onChange) {
            onChange(e);
        }
    };
    
    const getStrengthColor = () => {
        if (strength <= 1) return 'danger';
        if (strength <= 3) return 'warning';
        return 'success';
    };
    
    const getStrengthLabel = () => {
        if (strength <= 1) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };
    
    return (
        <div className="secure-password-wrapper">
            <div className="input-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className={className}
                    autoComplete="new-password"
                    {...props}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            </div>
            
            {showStrength && value && (
                <div className="password-strength mt-2">
                    <div className="progress" style={{ height: '4px' }}>
                        <div 
                            className={`progress-bar bg-${getStrengthColor()}`}
                            role="progressbar"
                            style={{ width: `${(strength / 5) * 100}%` }}
                        />
                    </div>
                    <small className={`text-${getStrengthColor()}`}>
                        Password Strength: {getStrengthLabel()}
                    </small>
                </div>
            )}
        </div>
    );
};

/**
 * Secure File Upload Component
 */
export const SecureFileUpload = ({
    name = 'file',
    accept,
    maxSizeMB = 5,
    onChange,
    className = '',
    ...props
}) => {
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    
    const handleChange = (e) => {
        const file = e.target.files[0];
        setError('');
        
        if (!file) {
            setFileName('');
            return;
        }
        
        // Validate file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File size must not exceed ${maxSizeMB}MB`);
            e.target.value = '';
            setFileName('');
            return;
        }
        
        // Validate file type
        if (accept) {
            const allowedTypes = accept.split(',').map(t => t.trim());
            const fileType = file.type;
            const fileExt = `.${file.name.split('.').pop()}`;
            
            if (!allowedTypes.includes(fileType) && !allowedTypes.includes(fileExt)) {
                setError(`File type not allowed. Allowed: ${accept}`);
                e.target.value = '';
                setFileName('');
                return;
            }
        }
        
        // Check for double extensions
        const extensions = file.name.split('.').slice(1);
        if (extensions.length > 1) {
            setError('Files with multiple extensions are not allowed');
            e.target.value = '';
            setFileName('');
            return;
        }
        
        setFileName(file.name);
        
        if (onChange) {
            onChange(e);
        }
    };
    
    return (
        <div className="secure-file-upload">
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={handleChange}
                className={`${className} ${error ? 'is-invalid' : ''}`}
                {...props}
            />
            {fileName && (
                <small className="text-muted d-block mt-1">
                    Selected: {fileName}
                </small>
            )}
            {error && (
                <div className="invalid-feedback d-block">
                    {error}
                </div>
            )}
        </div>
    );
};

/**
 * Auto-logout timer component
 */
export const AutoLogoutTimer = ({ 
    timeout = 15 * 60 * 1000, // 15 minutes default
    onLogout,
    warningTime = 2 * 60 * 1000 // 2 minutes before logout
}) => {
    const [showWarning, setShowWarning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    
    React.useEffect(() => {
        let logoutTimer;
        let warningTimer;
        let countdownInterval;
        
        const resetTimer = () => {
            // Clear existing timers
            clearTimeout(logoutTimer);
            clearTimeout(warningTimer);
            clearInterval(countdownInterval);
            setShowWarning(false);
            
            // Set warning timer
            warningTimer = setTimeout(() => {
                setShowWarning(true);
                setTimeRemaining(warningTime);
                
                // Start countdown
                countdownInterval = setInterval(() => {
                    setTimeRemaining(prev => {
                        if (prev <= 1000) {
                            clearInterval(countdownInterval);
                            return 0;
                        }
                        return prev - 1000;
                    });
                }, 1000);
            }, timeout - warningTime);
            
            // Set logout timer
            logoutTimer = setTimeout(() => {
                if (onLogout) {
                    onLogout();
                }
            }, timeout);
        };
        
        // Events that reset the timer
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });
        
        // Initial timer
        resetTimer();
        
        // Cleanup
        return () => {
            clearTimeout(logoutTimer);
            clearTimeout(warningTimer);
            clearInterval(countdownInterval);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [timeout, warningTime, onLogout]);
    
    if (!showWarning) return null;
    
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    
    return (
        <div 
            className="alert alert-warning position-fixed bottom-0 start-50 translate-middle-x mb-3" 
            style={{ zIndex: 9999, maxWidth: '500px' }}
        >
            <strong>Session Timeout Warning</strong>
            <p className="mb-0">
                You will be logged out in {minutes}:{seconds.toString().padStart(2, '0')} due to inactivity.
                Move your mouse or press any key to stay logged in.
            </p>
        </div>
    );
};

export default {
    SecureForm,
    SecureInput,
    SecurePasswordInput,
    SecureFileUpload,
    AutoLogoutTimer
};
