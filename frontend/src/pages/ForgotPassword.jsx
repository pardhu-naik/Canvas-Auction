import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPhone, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/forms.css';

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await forgotPassword(mobileNumber);
      setMessage('OTP sent successfully! Redirecting...');
      setTimeout(() => {
        navigate('/reset-password', { state: { mobileNumber } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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
          <h2>Forgot Password</h2>
          <p>Enter your mobile number to receive a 6-digit OTP</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle /> {error}
          </div>
        )}

        {message && (
          <div className="success-message" style={{ color: '#059669', background: '#ecfdf5', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiAlertCircle /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-wrapper">
              <FiPhone />
              <input 
                type="tel" 
                placeholder="Enter your registered mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="back-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
