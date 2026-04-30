import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';
import '../styles/forms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-container glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the world's most exclusive art community</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <FiUser />
              <input 
                type="text" 
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FiMail />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FiLock />
              <input 
                type="password" 
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <FiLock />
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                autoComplete="new-password" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-wrapper">
              <FiUser /> 
              <input 
                type="tel" 
                name="mobileNumber" 
                placeholder="Enter your mobile number" 
                value={formData.mobileNumber} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Join As</label>
            <CustomSelect 
              options={[
                { value: 'user', label: 'Collector / Buyer', icon: '👤' },
                { value: 'artist', label: 'Artist / Creator', icon: '🎨' }
              ]}
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              placeholder="Select your role"
              icon={FiBriefcase}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
