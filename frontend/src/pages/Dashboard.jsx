import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiHeart, FiClock, FiSettings, FiLogOut, FiUploadCloud, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <div className="container" style={{paddingTop: '100px'}}>Please login to view dashboard.</div>;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar glass-card">
          <div className="user-profile-info">
            <div className="avatar" style={{ position: 'relative' }}>
              {user.name.charAt(0)}
              {user.isVerified && (
                <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                  <FiCheckCircle color="#4CAF50" size={16} />
                </div>
              )}
            </div>
            <h3>{user.name}</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
              {user.role === 'artist' ? (user.isVerified ? 'Verified Artist' : 'Artist') : 'Collector'}
              {user.verificationStatus === 'pending' && <em style={{ fontSize: '0.7rem', color: '#FF9800' }}>(Verification Pending)</em>}
            </span>
          </div>

          <nav className="dashboard-nav">
            <button className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}><FiUser /> Overview</button>
            <button className={location.pathname === '/orders' ? 'active' : ''} onClick={() => navigate('/orders')}><FiShoppingBag /> My Orders</button>
            <button className={location.pathname === '/wishlist' ? 'active' : ''} onClick={() => navigate('/wishlist')}><FiHeart /> My Wishlist</button>
            <button className={location.pathname === '/bid-history' ? 'active' : ''} onClick={() => navigate('/bid-history')}><FiClock /> My Bids</button>
            {user.role === 'artist' && (
              <button className={location.pathname === '/upload' ? 'active' : ''} onClick={() => navigate('/upload')}><FiUploadCloud /> New Artwork</button>
            )}
            <button className={location.pathname === '/settings' ? 'active' : ''} onClick={() => navigate('/settings')}><FiSettings /> Settings</button>
            <button onClick={handleLogout} className="logout-btn"><FiLogOut /> Logout</button>
          </nav>
        </aside>

        <main className="dashboard-content">
          <motion.div 
            className="welcome-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h2>Greetings, {user.name.split(' ')[0]}!</h2>
                <p>You have 3 active bids and 1 artwork successfully {user.role === 'artist' ? 'sold' : 'purchased'} this week.</p>
            </div>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                <FiUser size={200} />
            </div>
          </motion.div>

          <div className="stats-grid">
            <div className="stat-card glass-card">
                <span className="label">{user.role === 'artist' ? 'Total Sales' : 'Collection'}</span>
                <p className="value" style={{ color: 'var(--primary-color)' }}>{user.role === 'artist' ? '$12,480' : '12 Pieces'}</p>
            </div>
            <div className="stat-card glass-card">
                <span className="label">Active Bids</span>
                <p className="value" style={{ color: 'var(--secondary-color)' }}>03</p>
            </div>
            <div className="stat-card glass-card">
                <span className="label">{user.role === 'artist' ? 'Works' : 'Followers'}</span>
                <p className="value">24</p>
            </div>
          </div>

          <div className="recent-activity glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Quick Actions</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)' }}>Updated just now</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/gallery')} style={{ padding: '15px 30px' }}>Explore Gallery</button>
              <button className="btn btn-outline" onClick={() => navigate('/auction')} style={{ padding: '15px 30px' }}>Live Drops</button>
              {user.role === 'artist' && (
                <button className="btn btn-outline" onClick={() => navigate('/upload')} style={{ padding: '15px 30px' }}>Publish New</button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
