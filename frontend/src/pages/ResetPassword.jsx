import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiAlertCircle, FiHash, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/forms.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [mobileNumber, setMobileNumber] = useState(location.state?.mobileNumber || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (otp.length !== 6) {
      setError('Enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(mobileNumber, otp, password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please check your OTP.');
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
          <h2>Reset Password</h2>
          <p>Please enter the 6-digit code sent to your phone</p>
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
              <FiHash />
              <input 
                type="tel" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>6-Digit OTP</label>
            <div className="input-wrapper">
              <FiHash />
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <FiLock />
              <input 
                type="password" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;
