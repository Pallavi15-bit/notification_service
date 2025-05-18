/**
 * Validation utility functions for form inputs
 */

// Check if value is empty
export const isEmpty = (value) => {
  return value === undefined || value === null || value.trim() === '';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format (basic validation)
export const isValidPhone = (phone) => {
  // Allow + and digits, minimum 10 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

// Validate form fields
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required && isEmpty(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }
    
    // Skip other validations if empty and not required
    if (isEmpty(value) && !fieldRules.required) {
      return;
    }
    
    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Please enter a valid email address';
    }
    
    // Phone validation
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || 'Please enter a valid phone number';
    }
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.minLengthMessage || 
        `${field} must be at least ${fieldRules.minLength} characters`;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.maxLengthMessage || 
        `${field} cannot exceed ${fieldRules.maxLength} characters`;
    }
    
    // Custom validation
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

// Example usage:
// const validationRules = {
//   name: { required: true, requiredMessage: 'Name is required' },
//   email: { required: true, email: true },
//   phone: { required: false, phone: true },
//   password: { 
//     required: true, 
//     minLength: 8,
//     custom: (value) => !value.includes('password') ? null : 'Password cannot contain the word "password"'
//   }
// };
// 
// const errors = validateForm(formData, validationRules);
// if (Object.keys(errors).length === 0) {
//   // Form is valid, proceed with submission
// }
