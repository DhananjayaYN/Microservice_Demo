import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    
    const userData = {
      username: formData.name.trim(),  // Changed from 'name' to 'username' to match backend
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined
    };
    
    setIsLoading(true);
    
    try {
      console.log('Attempting to register user:', { email: userData.email, name: userData.name });
      
      const response = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Registration API Response:', response);
      
      // Handle different success response formats
      if ((response.status === 'success' || response.statusCode === 201) && response.data) {
        // Show success message and redirect to login
        alert('Registration successful! Please sign in.');
        navigate('/login');
      } else if (response.message) {
        // Handle API error messages
        throw new Error(response.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        if (status === 400) {
          setError(data?.message || 'Invalid registration data. Please check your input.');
        } else if (status === 409) {
          setError('An account with this email already exists. Please use a different email or login.');
        } else {
          setError(data?.message || `Registration failed with status ${status}. Please try again.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message || 'Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required

            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address (Optional)</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="signup-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="login-link">
        Already have an account? <a href="/signin">Sign In</a>
      </div>
    </div>
  );
};

export default SignUp;
