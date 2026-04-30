import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from './NotificationBell';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          Art<span>Gallery</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop">
          <Link to="/gallery">Gallery</Link>
          <Link to="/auction">Auctions</Link>
          {user?.role === 'artist' && <Link to="/upload">Upload</Link>}
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        </div>

        <div className="nav-actions desktop">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search art..." />
          </div>

          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <NotificationBell />
              <div 
                className="profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FiUser />
                <span>{user.name}</span>
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/bid-history">Bid History</Link>
                    <Link to="/settings">Settings</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/auction" onClick={() => setIsOpen(false)}>Auctions</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                {user?.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>}
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
