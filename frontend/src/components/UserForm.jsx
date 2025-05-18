import React, { useState } from 'react';
import { validateForm } from '../utils/validation';
import Button from '../components/Button';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      email: true,
      sms: true,
      inApp: true
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validationRules = {
    name: { 
      required: true, 
      requiredMessage: 'Please enter a name'
    },
    email: { 
      required: true, 
      email: true,
      requiredMessage: 'Please enter an email address',
      emailMessage: 'Please enter a valid email address'
    },
    phone: { 
      required: false, 
      phone: true,
      phoneMessage: 'Please enter a valid phone number with country code (e.g., +1234567890)'
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (like preferences.email)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData, validationRules);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit form data to API
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Handle success
        alert('User created successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferences: {
            email: true,
            sms: true,
            inApp: true
          }
        });
      } else {
        // Handle API error
        setErrors({
          submit: result.message || 'Failed to create user'
        });
      }
    } catch (error) {
      // Handle network error
      setErrors({
        submit: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? 'form-control error' : 'form-control'}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'form-control error' : 'form-control'}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+91XXXXXXXXXX"
          className={errors.phone ? 'form-control error' : 'form-control'}
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>
      
      <div className="preferences-container">
        <div className="preferences-title">Notification Preferences</div>
        <div className="checkbox-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="preferences.email"
              checked={formData.preferences.email}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Email
          </label>
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="preferences.sms"
              checked={formData.preferences.sms}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            SMS
          </label>
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="preferences.inApp"
              checked={formData.preferences.inApp}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            In-App
          </label>
        </div>
      </div>
      
      {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn btn-primary"
      >
        {isSubmitting ? 'Adding User...' : 'Add User'}
      </button>
    </form>
  );
}

export default UserForm;
