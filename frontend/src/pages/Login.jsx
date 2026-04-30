import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/forms.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
          <h2>Welcome Back</h2>
          <p>Login to your account to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FiMail />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <div className="input-wrapper">
              <FiLock />
              <input 
                type="password" 
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
