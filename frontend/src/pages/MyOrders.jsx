import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiHeart, FiClock, FiSettings, FiLogOut, FiShoppingBag, FiInfo, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import API from '../services/api';
import Loader from '../components/Loader';
import '../styles/dashboard.css';

const MyOrders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
        setOrders(storedOrders);
      } catch (error) {
        console.error('Error fetching orders from local storage', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return <div className="container" style={{paddingTop: '100px'}}>Please login to view orders.</div>;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar glass-card">
          <div className="user-profile-info">
            <div className="avatar">{user.name.charAt(0)}</div>
            <h3>{user.name}</h3>
            <span>{user.role === 'artist' ? 'Verified Artist' : 'Collector'}</span>
          </div>

          <nav className="dashboard-nav">
            <button className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}><FiUser /> Overview</button>
            <button className={location.pathname === '/orders' ? 'active' : ''} onClick={() => navigate('/orders')}><FiShoppingBag /> My Orders</button>
            <button className={location.pathname === '/wishlist' ? 'active' : ''} onClick={() => navigate('/wishlist')}><FiHeart /> My Wishlist</button>
            <button className={location.pathname === '/bid-history' ? 'active' : ''} onClick={() => navigate('/bid-history')}><FiClock /> My Bids</button>
            <button className={location.pathname === '/settings' ? 'active' : ''} onClick={() => navigate('/settings')}><FiSettings /> Settings</button>
            <button onClick={handleLogout} className="logout-btn"><FiLogOut /> Logout</button>
          </nav>
        </aside>

        <main className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>My <span className="gradient-text">Orders</span></h2>
            <div className="glass-card" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-secondary-light)' }}>
                Total Purchases: <strong>{orders.length}</strong>
            </div>
          </div>

          {loading ? <Loader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <motion.div 
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card" 
                    style={{ 
                        display: 'flex', 
                        gap: '25px', 
                        alignItems: 'center', 
                        padding: '20px',
                        border: '1px solid rgba(255,255,255,0.05)' 
                    }}
                  >
                    <img 
                        src={order.artwork?.image} 
                        alt={order.artwork?.title} 
                        style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{order.artwork?.title}</h4>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary-light)' }}>
                            <span>Order ID: #{order._id.slice(-8).toUpperCase()}</span>
                            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--success-color)', marginBottom: '5px' }}>
                            ${order.totalAmount}
                        </p>
                        <span className="status-badge" style={{ 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            color: 'var(--success-color)', 
                            padding: '4px 12px', 
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}>
                            {order.paymentStatus.toUpperCase()}
                        </span>
                    </div>
                    <button 
                        className="btn" 
                        onClick={() => navigate(`/artwork/${order.artwork?._id}`)}
                        style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                    >
                        <FiExternalLink />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <FiInfo size={40} color="var(--text-secondary-light)" style={{ marginBottom: '15px' }} />
                  <h3>No orders found</h3>
                  <p style={{ color: 'var(--text-secondary-light)', marginBottom: '25px' }}>You haven't purchased any masterpieces yet.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/gallery')}>Browse Gallery</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyOrders;
